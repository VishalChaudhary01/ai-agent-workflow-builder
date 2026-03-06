import { Handle, Position } from "@xyflow/react";
import { Bot } from "lucide-react";

export default function AgentNode() {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
      <Bot className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
      <span className="text-sm">Agent Node</span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
