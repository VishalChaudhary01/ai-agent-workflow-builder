import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllWorkflowsQuery } from "@/lib/queries";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data: res, isPending } = useAllWorkflowsQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Workflows
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage and build your AI automation workflows
            </p>
          </div>

          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            Create New Workflow
          </Button>
        </div>

        <div className="mt-12">
          {isPending ? (
            <div className="flex items-center justify-center w-screen h-[88vh] gap-2 text-muted-foreground">
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Loading workflows…</span>
            </div>
          ) : res?.workflows?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium">No workflows yet</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Create your first workflow to get started.
              </p>
              <Button onClick={() => setOpen(true)} className="mt-6">
                Create Workflow
              </Button>
            </div>
          ) : (
            <div
              className="grid gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        lg:grid-cols-3 
                        xl:grid-cols-4"
            >
              {res?.workflows.map((wf: any) => (
                <Card
                  key={wf._id}
                  onClick={() => navigate(`/workflow/${wf._id}`)}
                  className="cursor-pointer transition-all duration-200 
                         hover:shadow-lg hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle className="text-lg truncate">
                      {wf.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {wf.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <DialogForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
