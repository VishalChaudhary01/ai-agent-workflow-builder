import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import axios from "axios";
import { Env } from "@/config/env";

export interface WorkflowConfig {
  startNodeId: string | null;
  flow: FlowNode[];
}

export interface FlowNode {
  id: string;
  type: string;
  label: string;
  settings: Record<string, any>;
  next: string | string[] | { if: string | null; else: string | null } | null;
}

export interface ExecutionLogEntry {
  nodeId: string;
  nodeType: string;
  label: string;
  status: "running" | "success" | "error" | "skipped";
  input?: string;
  output?: string;
  error?: string;
  durationMs: number;
}

interface RunResult {
  output: string;
  log: ExecutionLogEntry[];
}

type ExecutionContext = Record<string, any>;

const MAX_STEPS = 50;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function extractReply(output: string): string {
  if (!output) return output;
  const cleaned = stripMarkdownFences(output);
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed.reply === "string") return parsed.reply;
    if (parsed && typeof parsed.message === "string") return parsed.message;
    if (typeof parsed === "string") return parsed;
  } catch {
    // not JSON — return as-is
  }
  return cleaned;
}

// ─── WorkflowRunner ───────────────────────────────────────────────────────────

export class WorkflowRunner {
  private nodeMap: Record<string, FlowNode>;
  private context: ExecutionContext;
  private log: ExecutionLogEntry[];
  private steps: number;

  constructor(
    private config: WorkflowConfig,
    private userMessage: string,
  ) {
    this.nodeMap = config.flow.reduce<Record<string, FlowNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    this.context = {
      userMessage,
      lastOutput: userMessage,
    };

    this.log = [];
    this.steps = 0;
  }

  async execute(): Promise<RunResult> {
    if (!this.config.startNodeId) {
      return { output: "Workflow has no start node.", log: [] };
    }

    let currentNodeId: string | null = this.config.startNodeId;

    while (currentNodeId !== null) {
      if (this.steps >= MAX_STEPS) {
        this.log.push({
          nodeId: "system",
          nodeType: "system",
          label: "Safety limit",
          status: "error",
          error: `Execution stopped after ${MAX_STEPS} steps to prevent infinite loops.`,
          durationMs: 0,
        });
        break;
      }
      this.steps++;

      const node = this.nodeMap[currentNodeId];
      if (!node) break;

      currentNodeId = await this.executeNode(node);
    }

    return {
      output: extractReply(
        this.context.lastOutput ?? "Workflow completed with no output.",
      ),
      log: this.log,
    };
  }

  private async executeNode(node: FlowNode): Promise<string | null> {
    const start = Date.now();
    const logEntry: ExecutionLogEntry = {
      nodeId: node.id,
      nodeType: node.type,
      label: node.label ?? node.type,
      status: "running",
      input: this.context.lastOutput,
      durationMs: 0,
    };

    try {
      let nextNodeId: string | null = null;

      switch (node.type) {
        case "startNode":
          nextNodeId = await this.executeStartNode(node);
          break;
        case "agentNode":
          nextNodeId = await this.executeAgentNode(node);
          break;
        case "apiNode":
          nextNodeId = await this.executeApiNode(node);
          break;
        case "ifElseNode":
          nextNodeId = await this.executeIfElseNode(node);
          break;
        case "whileNode":
          nextNodeId = await this.executeWhileNode(node);
          break;
        case "userApprovalNode":
          nextNodeId = await this.executeUserApprovalNode(node);
          break;
        case "endNode":
          nextNodeId = null;
          break;
        default:
          nextNodeId = typeof node.next === "string" ? node.next : null;
      }

      logEntry.status = "success";
      logEntry.output = this.context.lastOutput;
      logEntry.durationMs = Date.now() - start;
      this.log.push(logEntry);

      return nextNodeId;
    } catch (err: any) {
      logEntry.status = "error";
      logEntry.error = err.message ?? "Unknown error";
      logEntry.durationMs = Date.now() - start;
      this.log.push(logEntry);
      this.context.lastOutput = `Error in ${node.label}: ${err.message}`;
      return null;
    }
  }

  private async executeStartNode(node: FlowNode): Promise<string | null> {
    this.context.lastOutput = this.userMessage;
    return typeof node.next === "string" ? node.next : null;
  }

  private async executeAgentNode(node: FlowNode): Promise<string | null> {
    const {
      instruction = "You are a helpful assistant.",
      model = "gemini-2.0-flash",
      temperature = 0.7,
      maxTokens = 1024,
      outputFormat = "text",
      jsonSchema,
    } = node.settings;

    const userInput = this.context.lastOutput ?? this.userMessage;

    let systemPrompt = instruction;
    if (outputFormat === "json" && jsonSchema) {
      systemPrompt +=
        `\n\nIMPORTANT: Respond ONLY with a raw JSON object. ` +
        `No markdown, no backticks, no code fences, no explanation. ` +
        `Just the JSON object itself. Schema:\n${jsonSchema}`;
    }

    let response: string;
    if (model.startsWith("gpt")) {
      response = await this.callOpenAI(
        model,
        systemPrompt,
        userInput,
        temperature,
        maxTokens,
      );
    } else if (model.startsWith("gemini")) {
      response = await this.callGemini(
        model,
        systemPrompt,
        userInput,
        temperature,
        maxTokens,
      );
    }
    // else if (model.startsWith("claude")) {
    //   response = await this.callClaude(
    //     model,
    //     systemPrompt,
    //     userInput,
    //     temperature,
    //     maxTokens,
    //   );
    else {
      throw new Error(`Unsupported model: ${model}`);
    }

    const stripped = stripMarkdownFences(response);

    try {
      const parsed = JSON.parse(stripped);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        Object.assign(this.context, parsed);
      }
    } catch {
      // Not JSON — that's fine for text output nodes, continue normally
    }

    if (outputFormat === "json") {
      // If explicitly set to JSON, validate it parsed correctly
      try {
        JSON.parse(stripped);
      } catch {
        throw new Error(
          `Agent "${node.label}" was set to JSON output but returned invalid JSON: ${stripped.slice(0, 200)}`,
        );
      }
    }

    // Always store the stripped (fence-free) string
    this.context.lastOutput = stripped;
    this.context[node.label] = stripped;

    return typeof node.next === "string" ? node.next : null;
  }

  private async executeApiNode(node: FlowNode): Promise<string | null> {
    const {
      url,
      method = "GET",
      headers = {},
      body,
      responseField,
    } = node.settings;

    if (!url) throw new Error("API node is missing a URL");

    // ── URL interpolation ─────────────────────────────────────────────────
    const resolvedUrl = url.replace(
      /\{\{(\w+)\}\}/g,
      (match: string, key: string) => {
        // 1. Direct context key — works now because executeAgentNode spreads
        //    parsed JSON fields into this.context via Object.assign
        if (this.context[key] !== undefined && this.context[key] !== null) {
          const val = String(this.context[key]).trim();
          if (!val) {
            console.warn(`[APINode] Context key "{{${key}}}" is empty`);
            return "";
          }
          return encodeURIComponent(val);
        }

        // 2. Fallback: try parsing lastOutput as JSON
        try {
          const parsed = JSON.parse(
            stripMarkdownFences(this.context.lastOutput ?? "{}"),
          );
          if (parsed[key] !== undefined && parsed[key] !== null) {
            return encodeURIComponent(String(parsed[key]).trim());
          }
        } catch {
          /* not JSON */
        }

        console.warn(
          `[APINode] Could not resolve template variable: {{${key}}}`,
        );
        return "";
      },
    );

    console.log("[APINode] Resolved URL:", resolvedUrl);

    // Guard: catch empty city before making the request
    if (/wttr\.in\/(\/|\?|%20|\s|$)/.test(resolvedUrl)) {
      throw new Error(
        `City resolved to empty in API URL. ` +
          `Ensure your Intent Detector agent has Output Format set to JSON ` +
          `and returns a "city" field.`,
      );
    }

    // ── Body interpolation ────────────────────────────────────────────────
    let requestBody: any = undefined;
    if (body) {
      try {
        const resolvedBody = body.replace(
          /\{\{(\w+)\}\}/g,
          (match: string, key: string) => {
            if (this.context[key] !== undefined && this.context[key] !== null) {
              return String(this.context[key]);
            }
            try {
              const parsed = JSON.parse(
                stripMarkdownFences(this.context.lastOutput ?? "{}"),
              );
              if (parsed[key] !== undefined) return String(parsed[key]);
            } catch {
              /* not JSON */
            }
            return "";
          },
        );
        requestBody = JSON.parse(resolvedBody);
      } catch {
        console.warn(
          "[APINode] Could not parse request body as JSON — skipping.",
        );
      }
    }

    // ── HTTP request ──────────────────────────────────────────────────────
    const requestHeaders: Record<string, string> = {
      // Required: wttr.in returns empty/HTML without a User-Agent
      "User-Agent": "WorkflowRunner/1.0",
      ...(method !== "GET" && requestBody !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    };

    let response: any;
    try {
      response = await axios({
        method,
        url: resolvedUrl,
        headers: requestHeaders,
        data: requestBody,
        timeout: 1000 * 60 * 2,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message ?? err.message;
      throw new Error(
        `API request failed${status ? ` (HTTP ${status})` : ""}: ${message}`,
      );
    }

    // ── Response extraction ───────────────────────────────────────────────
    let output: string;
    if (responseField) {
      const value = responseField.split(".").reduce((obj: any, key: string) => {
        if (obj == null) return undefined;
        const index = Number(key);
        return !isNaN(index) ? obj[index] : obj[key];
      }, response.data);

      if (value == null) {
        console.warn(
          `[APINode] responseField "${responseField}" not found — returning full body`,
        );
        output = JSON.stringify(response.data);
      } else {
        output = typeof value === "string" ? value : JSON.stringify(value);
      }
    } else {
      output =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);
    }

    this.context.lastOutput = output;
    this.context[node.label] = output;

    if (typeof node.next === "string") return node.next;
    if (Array.isArray(node.next) && node.next.length > 0) return node.next[0];
    return null;
  }

  private async executeIfElseNode(node: FlowNode): Promise<string | null> {
    const { ifCondition } = node.settings;

    if (!ifCondition) {
      throw new Error("IfElse node is missing a condition expression");
    }

    const cleanCondition = ifCondition.replace(/\\"/g, '"');

    const evalContext = {
      ...this.context,
      lastOutput: stripMarkdownFences(this.context.lastOutput ?? ""),
    };

    let result: boolean;
    try {
      const evaluate = new Function(
        ...Object.keys(evalContext),
        `return Boolean(${cleanCondition})`,
      );
      result = evaluate(...Object.values(evalContext));
    } catch (err: any) {
      throw new Error(
        `Invalid condition expression: "${cleanCondition}" — ${err.message}`,
      );
    }

    const branches = node.next as { if: string | null; else: string | null };
    return result ? (branches.if ?? null) : (branches.else ?? null);
  }

  private async executeWhileNode(node: FlowNode): Promise<string | null> {
    const { condition, maxIterations = 10 } = node.settings;

    const iterKey = `__while_${node.id}_count`;
    this.context[iterKey] = (this.context[iterKey] ?? 0) + 1;

    if (this.context[iterKey] > maxIterations) {
      const branches = node.next as { if: string | null; else: string | null };
      return branches?.else ?? null;
    }

    let conditionMet: boolean;
    try {
      const evaluate = new Function(
        ...Object.keys(this.context),
        `return Boolean(${condition})`,
      );
      conditionMet = evaluate(...Object.values(this.context));
    } catch {
      throw new Error(`Invalid while condition: "${condition}"`);
    }

    const branches = node.next as { if: string | null; else: string | null };
    return conditionMet ? (branches?.if ?? null) : (branches?.else ?? null);
  }

  private async executeUserApprovalNode(
    node: FlowNode,
  ): Promise<string | null> {
    this.context.lastOutput = `[Approval required] ${this.context.lastOutput} — Auto-approved in preview mode.`;
    return typeof node.next === "string" ? node.next : null;
  }

  private async callGemini(
    model: string,
    systemPrompt: string,
    userInput: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(Env.GEMINI_API_KEY);
    const genModel = genAI.getGenerativeModel({
      model,
      systemInstruction: systemPrompt,
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    });
    const result = await genModel.generateContent(userInput);
    return result.response.text();
  }

  private async callOpenAI(
    model: string,
    systemPrompt: string,
    userInput: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    const openai = new OpenAI({ apiKey: Env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
    });
    return completion.choices[0]?.message?.content ?? "";
  }

  //   private async callClaude(
  //     model: string,
  //     systemPrompt: string,
  //     userInput: string,
  //     temperature: number,
  //     maxTokens: number
  //   ): Promise<string> {
  //     const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  //     const message = await anthropic.messages.create({
  //       model,
  //       max_tokens: maxTokens,
  //       temperature,
  //       system: systemPrompt,
  //       messages: [{ role: "user", content: userInput }],
  //     });
  //     const block = message.content[0];
  //     return block.type === "text" ? block.text : "";
  //   }
}
