import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";

export default function StartNode() {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
      <Play className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
      <span className="text-sm">Start</span>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
