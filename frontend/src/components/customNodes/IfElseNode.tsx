import { Handle, Position } from "@xyflow/react";
import { TrendingUpDown } from "lucide-react";
import { Input } from "../ui/input";

export default function IfElseNode() {
  return (
    <div className="p-2 space-y-2 bg-white rounded-lg border">
      <div className="flex items-center gap-2">
        <TrendingUpDown className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
        <span className="text-sm">If/Else Node</span>
      </div>

      <div className="flex flex-col gap-1">
        <Input className="text-sm" placeholder="If condition" />
        <Input className="text-sm" placeholder="Else condition" />
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="if" />
      <Handle
        type="source"
        position={Position.Right}
        id="else"
        style={{ top: 100 }}
      />
    </div>
  );
}
