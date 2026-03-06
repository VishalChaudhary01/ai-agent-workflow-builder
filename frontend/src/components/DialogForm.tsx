import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkflowMutationFn } from "@/lib/api-functions";
import {
  createWorkflowSchema,
  type CreateWorkflowType,
} from "@/validators/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: (e: boolean) => void;
}

export default function DialogForm({ open, onClose }: Props) {
  const navigate = useNavigate();

  const form = useForm<CreateWorkflowType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkflowMutationFn,
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (isPending) return;

    mutate(data, {
      onSuccess: (res) => {
        navigate(`/workflow/${res?.id}`);
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ?? "Failed to create new workspace",
        );
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="font-semibold">
              Create New Workflow
            </DialogTitle>
            <DialogDescription>
              Build new workflow for your personal and professional works
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...form.register("description")} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
