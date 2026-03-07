import { Bot, ChevronDown, ChevronUp, Save, Sliders } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Controller, useForm } from "react-hook-form";
import { agentSchema, type AgentFormData } from "@/validators/nodeSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useWorkflowContext } from "@/context/workflowContext";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { useParams } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";

const MODELS = [
  {
    group: "Google",
    items: [
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
      { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    ],
  },
  {
    group: "OpenAI",
    items: [
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    ],
  },
  {
    group: "Anthropic",
    items: [
      { value: "claude-sonnet-4", label: "Claude Sonnet 4" },
      { value: "claude-haiku-3.5", label: "Claude Haiku 3.5" },
    ],
  },
];

const DEFAULT_JSON_SCHEMA = `{
  "type": "object",
  "properties": {
    "result": { "type": "string" }
  },
  "required": ["result"]
}`;

type OutputFormatType = "text" | "json";

export default function AgentSetting() {
  const { id: workflowId = "" } = useParams();
  const { saveNode, selectedNode } = useWorkflowContext();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: (selectedNode?.data?.name as string) ?? "",
      instruction: (selectedNode?.data?.instruction as string) ?? "",
      includeChatHistory:
        (selectedNode?.data?.includeChatHistory as boolean) ?? false,
      model: (selectedNode?.data?.model as string) ?? "gemini-2.0-flash",
      temperature: (selectedNode?.data?.temperature as number) ?? 0.7,
      maxTokens: (selectedNode?.data?.maxTokens as number) ?? 1024,
      outputFormat:
        (selectedNode?.data?.outputFormat as OutputFormatType) ?? "text",
      jsonSchema:
        (selectedNode?.data?.jsonSchema as string) ?? DEFAULT_JSON_SCHEMA,
    },
  });

  const onSubmit = (data: AgentFormData) => {
    if (!selectedNode || !workflowId) return;

    saveNode({ workflowId, nodeId: selectedNode.id, data });
  };

  return (
    <div className="flex flex-col bg-white border rounded-xl min-w-72 max-w-80 max-h-[85vh] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b bg-orange-50/80 rounded-t-xl shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
          <Bot className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 leading-none">
            Agent Settings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure this agent node
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col overflow-hidden"
      >
        <ScrollArea className="w-full h-96 p-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Summariser Agent"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="instruction"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="instruction">
                    System Instruction
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="instruction"
                    aria-invalid={fieldState.invalid}
                    placeholder="You are a halpful assistant that..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="includeChatHistory"
              control={form.control}
              render={({ field }) => (
                <Field className="flex-row items-center justify-between">
                  <FieldLabel>Include Chat History</FieldLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="model"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex-row items-center justify-between">
                  <FieldLabel htmlFor="model">Model</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-8 text-sm w-full flex-1">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS.map((group) => (
                        <SelectGroup key={group.group}>
                          <SelectLabel>{group.group}</SelectLabel>
                          {group.items.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAdvanced((v) => !v)}
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  Advanced
                </span>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              {showAdvanced && (
                <div className="space-y-3 mt-2">
                  <Controller
                    name="temperature"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className="flex items-center justify-between">
                          <FieldLabel>Temperature</FieldLabel>
                          <span className="text-xs font-mono">
                            {field.value.toFixed(1)}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min={0}
                          max={2}
                          step={0.1}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          className="w-full h-1.5 accent-orange-500 cursor-pointer px-0"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 -mt-2">
                          <span>Precise</span>
                          <span>Creative</span>
                        </div>
                      </Field>
                    )}
                  />

                  <Controller
                    name="maxTokens"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className="flex items-center justify-between">
                          <FieldLabel>Max Tokens</FieldLabel>
                          <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                            {field.value}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min={128}
                          max={8192}
                          step={128}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="w-full h-1.5 cursor-pointer px-0 accent-orange-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 -mt-2">
                          <span>128</span>
                          <span>8192</span>
                        </div>
                      </Field>
                    )}
                  />
                </div>
              )}
            </div>

            <Controller
              name="outputFormat"
              control={form.control}
              render={({ field }) => (
                <Field className="">
                  <FieldLabel>Output Format</FieldLabel>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList>
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="json">JSON</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text">
                      <p className="text-xs text-muted-foreground">
                        The agent will return a plain text response.
                      </p>
                    </TabsContent>
                    <TabsContent value="json">
                      <Controller
                        name="jsonSchema"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>JSON Schema</FieldLabel>
                            <FieldDescription>
                              Defines the shape of the agent's JSON output
                            </FieldDescription>
                            <Textarea
                              {...field}
                              placeholder={DEFAULT_JSON_SCHEMA}
                            />
                          </Field>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </Field>
              )}
            />
          </FieldGroup>
        </ScrollArea>

        <div className="px-4 py-3.5 border-t">
          <Button type="submit" className="w-full">
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
