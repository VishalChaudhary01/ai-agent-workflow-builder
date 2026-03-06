import { Handle, Position } from "@xyflow/react";
import { CircleOff } from "lucide-react";

export default function EndNode() {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
      <CircleOff className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
      <span className="text-sm">End Node</span>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
