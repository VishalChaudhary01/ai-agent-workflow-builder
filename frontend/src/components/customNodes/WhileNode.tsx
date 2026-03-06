import { Handle, Position } from "@xyflow/react";
import { Repeat } from "lucide-react";
import { Input } from "../ui/input";

export default function WhileNode() {
  return (
    <div className="p-2 space-y-2 bg-white rounded-lg border">
      <div className="flex items-center gap-2">
        <Repeat className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
        <span className="text-sm">While Node</span>
      </div>

      <Input className="text-sm" placeholder="Condition" />

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
