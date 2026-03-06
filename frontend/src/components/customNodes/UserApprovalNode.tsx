import { Handle, Position } from "@xyflow/react";
import { ThumbsUp } from "lucide-react";

export default function UserApprovalNode() {
  return (
    <div className="p-2 space-y-2 bg-white rounded-lg border">
      <div className="flex items-center gap-2">
        <ThumbsUp className="w-6 h-6 bg-yellow-100 p-1 rounded-md" />
        <span className="text-sm">User Approval Node</span>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-sm border py-1 px-2 rounded-md">Approve</h4>
        <h4 className="text-sm border py-1 px-2 rounded-md">Reject</h4>
      </div>

      <Handle type="target" position={Position.Left} id="approve" />
      <Handle type="source" position={Position.Right} id="reject" />
      <Handle
        type="source"
        position={Position.Right}
        id="reject"
        style={{ top: 90 }}
      />
    </div>
  );
}
