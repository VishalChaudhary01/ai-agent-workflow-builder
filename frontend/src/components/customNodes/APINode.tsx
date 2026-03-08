import { Handle, Position } from "@xyflow/react";
import { Webhook } from "lucide-react";

export default function APINode({ data }: { data: any }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-lg border">
      <Webhook className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
      <div className="flex flex-col gap-0 min-w-16">
        <span className="text-sm">{data.name}</span>
        <span className="text-[10px] text-muted-foreground">{data.label}</span>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
