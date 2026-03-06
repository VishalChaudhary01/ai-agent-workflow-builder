import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WorkflowContext } from "./context/workflowContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const [addedNodes, setAddedNodes] = useState([
    {
      id: "start",
      position: { x: 0, y: 0 },
      data: { label: "Start" },
      type: "startNode",
    },
  ]);

  const [nodeEdges, setNodeEdges] = useState([]);

  return (
    <QueryClientProvider client={queryClient}>
      <WorkflowContext.Provider
        value={{ addedNodes, setAddedNodes, nodeEdges, setNodeEdges }}
      >
        {children}
      </WorkflowContext.Provider>
    </QueryClientProvider>
  );
}
