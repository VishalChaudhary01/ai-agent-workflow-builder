import { Handle, Position } from "@xyflow/react";
import { Webhook } from "lucide-react";

export default function APINode() {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
      <Webhook className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
      <span className="text-sm">API Node</span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
