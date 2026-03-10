import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Play, Send, StopCircle, User } from "lucide-react";
import { useWorkflowQuery } from "@/lib/queries";
import { nodeTypes } from "@/components/Buildre";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { runWorkflowMutationFn } from "@/lib/api-functions";
import { toast } from "sonner";
import Header from "@/components/Header";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

const generateWorkflowConfig = (nodes: Node[], edges: Edge[]) => {
  const edgeMap = edges.reduce<Record<string, Edge[]>>((acc, edge) => {
    if (!acc[edge.source]) acc[edge.source] = [];
    acc[edge.source].push(edge);
    return acc;
  }, {});

  const flow = nodes.map((node) => {
    const connectedEdges = edgeMap[node.id] ?? [];

    let next:
      | string
      | string[]
      | { if: string | null; else: string | null }
      | null = null;

    switch (node.type) {
      case "ifElseNode": {
        const ifEdge = connectedEdges.find((e) => e.sourceHandle === "if");
        const elseEdge = connectedEdges.find((e) => e.sourceHandle === "else");

        next = {
          if: ifEdge?.target ?? null,
          else: elseEdge?.target ?? null,
        };
        break;
      }

      case "endNode": {
        next = null;
        break;
      }

      // startNode, agentNode, apiNode, userApprovalNode, whileNode all follow
      // the same single-next or fan-out pattern
      default: {
        if (connectedEdges.length === 1) {
          next = connectedEdges[0].target;
        } else if (connectedEdges.length > 1) {
          next = connectedEdges.map((e) => e.target);
        }
        break;
      }
    }

    return {
      id: node.id,
      type: node.type,
      label: (node.data?.label as string) ?? node.type,
      settings: node.data ?? {},
      next,
    };
  });

  const startNode = nodes.find((n) => n.type === "startNode");

  return {
    startNodeId: startNode?.id ?? null,
    flow,
  };
};

export default function Preview() {
  const { id = "" } = useParams();

  const { data: res, isPending: isLoading, isError } = useWorkflowQuery(id);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "system-welcome",
      role: "system",
      content: "Workflow loaded. Send a message to run it.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (res?.workflow) {
      generateWorkflowConfig(res?.workflow.nodes, res?.workflow.edges);
    }
  }, [res?.workflow]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function parseOutputContent(output: string): string {
    if (!output) return "Workflow completed.";

    const cleaned = output
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.reply === "string") return parsed.reply;
      if (parsed && typeof parsed.message === "string") return parsed.message;
      if (typeof parsed === "string") return parsed;

      return JSON.stringify(parsed, null, 2);
    } catch {
      return cleaned;
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: runWorkflowMutationFn,
    onSuccess: (data) => {
      console.log("res data", data);

      const failedNode = data.executionLog?.find(
        (entry: any) => entry.status === "error",
      );

      if (failedNode) {
        toast.error(
          `Node "${failedNode.label}" failed: ${failedNode.error ?? "Unknown error"}`,
        );
      }

      const content = failedNode
        ? `Something went wrong in the "${failedNode.label}" step. Please check your workflow configuration.`
        : parseOutputContent(data.output);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? "Request failed";
      toast.error(`Failed: ${message}`);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: `⚠️ ${message}`,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending || !res?.workflow) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      },
    ]);

    setInput("");

    const config = generateWorkflowConfig(
      res.workflow.nodes ?? [],
      res.workflow.edges ?? [],
    );

    mutate({
      workflowId: id,
      userMessage: trimmed,
      config,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-[88vh] gap-2 text-muted-foreground">
        <Loader2 className="animate-spin w-5 h-5" />
        <span>Loading workflow…</span>
      </div>
    );
  }

  if (isError || !res?.workflow) {
    return (
      <div className="flex items-center justify-center w-screen h-[88vh] text-destructive">
        Failed to load workflow. Please refresh or try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div
        className="grid grid-cols-4"
        style={{ width: "100%", height: "88vh" }}
      >
        <div className="col-span-3">
          <ReactFlow
            nodes={res?.workflow.nodes ?? []}
            edges={res?.workflow.edges ?? []}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Chat Panel */}
        <div className="col-span-1 flex flex-col border-l bg-gray-50 h-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {res.workflow.name ?? "Workflow"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Preview mode</p>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full",
                isPending
                  ? "bg-orange-100 text-orange-600"
                  : "bg-green-100 text-green-600",
              )}
            >
              {isPending ? (
                <>
                  <StopCircle className="w-3 h-3" /> Running
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Ready
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3 overflow-hidden">
            <div className="space-y-3">
              Messages
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isPending && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="px-3 py-3 border-t bg-white shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder="Send a message…"
                disabled={isPending}
                className="h-9 text-sm"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || isPending}
                className="h-9 w-9 p-0 shrink-0"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          isUser ? "bg-gray-200" : "bg-orange-100",
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-gray-600" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-orange-600" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-gray-900 text-white rounded-tr-sm"
            : "bg-white border text-gray-800 rounded-tl-sm shadow-sm",
        )}
      >
        {message.content}
        <p
          className={cn(
            "text-[10px] mt-1",
            isUser ? "text-gray-400 text-right" : "text-gray-400",
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-orange-600" />
      </div>
      <div className="bg-white border rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
