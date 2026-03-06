import { ChevronLeft, Code, Loader, Play } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkflowQuery } from "@/lib/queries";
import { useParams } from "react-router-dom";

export default function WorkflowBuilderHeader() {
  const { id } = useParams();
  const { data: res, isPending } = useWorkflowQuery(id ?? "");

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex gap-3">
          <ChevronLeft className="w-8 h-8" />

          <h2 className="text-lg sm:text-xl font-bold tracking-tight truncate">
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              res?.workflow?.name
            )}
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Code
          </Button>

          <Button size="sm">
            <Play className="w-4 h-4" />
            Preview
          </Button>

          <Button
            size="sm"
            className="hidden sm:inline-flex items-center gap-2"
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
