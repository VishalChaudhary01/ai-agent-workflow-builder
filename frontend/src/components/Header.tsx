import { ChevronLeft, Loader, Play, X } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkflowQuery } from "@/lib/queries";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Header() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: res, isPending } = useWorkflowQuery(id ?? "");
  const { pathname } = useLocation();

  const isPreview = pathname.includes("/preview");

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex gap-3">
          <ChevronLeft
            onClick={() => navigate(-1)}
            className="w-8 h-8 cursor-pointer"
          />

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
          {isPreview ? (
            <Button size="sm" onClick={() => navigate(-1)}>
              <X className="w-4 h-4" />
              Close Preview
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("preview")}>
              <Play className="w-4 h-4" />
              Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
