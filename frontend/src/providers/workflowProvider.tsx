import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ReactFlowProvider, type Edge, type Node } from "@xyflow/react";
import { WorkflowContext } from "@/context/workflowContext";
import { udpateWorkflowMutationFn } from "@/lib/api-functions";

export default function WorkflowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addedNodes, setAddedNodes] = useState<Node[]>([
    {
      id: "start",
      position: { x: 0, y: 0 },
      data: { label: "Start" },
      type: "startNode",
    },
  ]);

  const [nodeEdges, setNodeEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { mutate } = useMutation({
    mutationFn: udpateWorkflowMutationFn,
    onSuccess: () => {
      toast.success("Workflow Node saved!");
    },
    onError: (err: any) => {
      toast.error(`Save failed: ${err?.response?.data?.message}`);
    },
  });

  const saveNode = ({
    workflowId,
    nodeId,
    data,
  }: {
    workflowId: string;
    nodeId: string;
    data: Record<string, unknown>;
  }) => {
    const updatedNodes = addedNodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          }
        : node,
    );

    setAddedNodes(updatedNodes);

    mutate({ id: workflowId, nodes: updatedNodes });
  };

  return (
    <ReactFlowProvider>
      <WorkflowContext.Provider
        value={{
          addedNodes,
          setAddedNodes,
          nodeEdges,
          setNodeEdges,
          selectedNode,
          setSelectedNode,
          saveNode,
        }}
      >
        {children}
      </WorkflowContext.Provider>
    </ReactFlowProvider>
  );
}
