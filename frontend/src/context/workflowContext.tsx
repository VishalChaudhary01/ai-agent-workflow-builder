import type { Edge, Node } from "@xyflow/react";
import React, { createContext, useContext } from "react";

interface WorkflowContextType {
  addedNodes: Node[];
  setAddedNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  nodeEdges: Edge[];
  setNodeEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  saveNode: ({
    workflowId,
    nodeId,
    data,
  }: {
    workflowId: string;
    nodeId: string;
    data: Record<string, unknown>;
  }) => void;
}

export const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflowContext must be used inside WorkflowProvider");
  }
  return context;
};
