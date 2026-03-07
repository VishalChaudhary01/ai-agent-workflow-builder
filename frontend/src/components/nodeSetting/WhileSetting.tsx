import { Repeat, Save } from "lucide-react";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkflowContext } from "@/context/workflowContext";
import { whileSchema, type WhileData } from "@/validators/nodeSetting";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function IfElseSetting() {
  const { id: workflowId = "" } = useParams();
  const { selectedNode, saveNode } = useWorkflowContext();

  const form = useForm<WhileData>({
    resolver: zodResolver(whileSchema),
    defaultValues: {
      condition: "",
    },
  });

  const onSubmit = (data: WhileData) => {
    if (!selectedNode || !workflowId) return;

    saveNode({ workflowId, nodeId: selectedNode.id, data });
  };

  return (
    <div className="flex flex-col bg-white border rounded-xl min-w-72 max-w-80 max-h-[85vh] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b bg-orange-50/80 rounded-t-xl shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
          <Repeat className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 leading-none">
            While Condition
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Loop the workflow based on a condition
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col overflow-hidden"
      >
        <FieldGroup className="p-4">
          <Controller
            name="condition"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="condition">If Condition</FieldLabel>
                <Input
                  {...field}
                  id="condition"
                  aria-invalid={fieldState.invalid}
                  placeholder='{{agent.status}} != "completed"'
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
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
