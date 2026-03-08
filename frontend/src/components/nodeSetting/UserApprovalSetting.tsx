import { Save, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userApprovalSchema,
  type UserApprovalData,
} from "@/validators/nodeSetting";
import { useWorkflowContext } from "@/context/workflowContext";
import { useParams } from "react-router-dom";
import { Textarea } from "../ui/textarea";

export default function UserApprovalSetting() {
  const { id: workflowId = "" } = useParams();
  const { selectedNode, saveNode } = useWorkflowContext();

  const form = useForm<UserApprovalData>({
    resolver: zodResolver(userApprovalSchema),
    defaultValues: {
      title: (selectedNode?.data?.title as string) ?? "",
      message: (selectedNode?.data?.message as string) ?? "",
    },
  });

  const onSubmit = (data: UserApprovalData) => {
    if (!selectedNode || !workflowId) return;

    saveNode({ workflowId, nodeId: selectedNode.id, data });
  };

  return (
    <div className="flex flex-col bg-white border rounded-xl min-w-72 max-w-80 max-h-[85vh] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b bg-orange-50/80 rounded-t-xl shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
          <ThumbsUp className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 leading-none">
            User Approval
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Require human approval before continuing this workflow
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col overflow-hidden"
      >
        <FieldGroup className="p-4">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="title">Approval Title</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Review AI generated response"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
                <Textarea
                  {...field}
                  id="message"
                  aria-invalid={fieldState.invalid}
                  placeholder="Explain what needs to be reviewed before continuing"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="px-4 py-3.5 border-t">
          <Button type="submit" className="w-full">
            <Save className="w-4 h-4 mr-1.5" />
            Save Approval
          </Button>
        </div>
      </form>
    </div>
  );
}
