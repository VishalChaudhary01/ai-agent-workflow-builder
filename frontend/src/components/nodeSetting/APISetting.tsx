import { Save, Webhook } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { apiSchema, type APIData } from "@/validators/nodeSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkflowContext } from "@/context/workflowContext";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useParams } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function APISetting() {
  const { id: workflowId = "" } = useParams();
  const { saveNode, selectedNode } = useWorkflowContext();

  const form = useForm<APIData>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      name: (selectedNode?.data?.name as string) ?? "",
      method: (selectedNode?.data?.method as Method) ?? "GET",
      url: (selectedNode?.data?.url as string) ?? "",
      includesApiKey: (selectedNode?.data?.includesApiKey as boolean) ?? false,
      apiKey: (selectedNode?.data?.apiKey as string) ?? "",
      bodyParams: (selectedNode?.data?.bodyParams as string) ?? "",
    },
  });

  const onSubmit = (data: APIData) => {
    console.log("ON Submit called::", data);
    if (!selectedNode || !workflowId) return;
    console.log("ON Submit called::", data);

    saveNode({ workflowId, nodeId: selectedNode.id, data });
  };

  return (
    <div className="flex flex-col bg-white border rounded-xl min-w-72 max-w-80 max-h-[85vh] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b bg-orange-50/80 rounded-t-xl shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
          <Webhook className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 leading-none">
            API Settings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure an external API request for this node.
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
                    placeholder="Enter API request name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="method"
              control={form.control}
              render={({ field }) => (
                <Field className="flex-row items-center justify-between">
                  <FieldLabel htmlFor="method">HTTP Method</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-35">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>

                    <SelectContent>
                      {["GET", "POST", "PUT", "PATCH", "DELETE"].map(
                        (method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="url">API URL</FieldLabel>
                  <Input
                    {...field}
                    id="url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://api.example.com/v1/resource"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="includesApiKey"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Include API Key</FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                  {field.value === true && (
                    <Field>
                      <Input
                        {...form.register("apiKey")}
                        placeholder="Enter your API key"
                      />
                      {form.formState.errors.apiKey && (
                        <FieldError errors={[form.formState.errors.apiKey]} />
                      )}
                    </Field>
                  )}
                </Field>
              )}
            />

            <Controller
              name="bodyParams"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="bodyParams">Body Parameters</FieldLabel>
                  <Textarea
                    {...field}
                    id="bodyParams"
                    placeholder='{ "key": "value" }'
                  />
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
