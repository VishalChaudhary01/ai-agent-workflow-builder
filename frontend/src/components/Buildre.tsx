import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  BackgroundVariant,
  useOnSelectionChange,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import StartNode from "./customNodes/StartNote";
import AgentNode from "./customNodes/AgentNode";
import IfElseNode from "./customNodes/IfElseNode";
import WhileNode from "./customNodes/WhileNode";
import APINode from "./customNodes/APINode";
import EndNode from "./customNodes/EndNode";
import AgentToolPanel from "./AgentToolPanel";
import { useWorkflowContext } from "@/context/workflowContext";
import { useMutation } from "@tanstack/react-query";
import { udpateWorkflowMutationFn } from "@/lib/api-functions";
import { useParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkflowQuery } from "@/lib/queries";
import { toast } from "sonner";
import UserApprovalNode from "./customNodes/UserApprovalNode";
import SettingPanel from "./SettingPanel";

export const nodeTypes = {
  startNode: StartNode,
  agentNode: AgentNode,
  ifElseNode: IfElseNode,
  whileNode: WhileNode,
  apiNode: APINode,
  endNode: EndNode,
  userApprovalNode: UserApprovalNode,
};

export default function Builder() {
  const { id = "" } = useParams();

  const { addedNodes, setAddedNodes, setNodeEdges, setSelectedNode } =
    useWorkflowContext();

  const { data: result, isPending, isError } = useWorkflowQuery(id);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const initialised = useRef(false);

  useEffect(() => {
    if (!initialised.current && result?.workflow) {
      const { nodes: savedNodes = [], edges: savedEdges = [] } =
        result.workflow;

      setNodes(savedNodes);
      setEdges(savedEdges);

      setAddedNodes(savedNodes);
      setNodeEdges(savedEdges);

      initialised.current = true;
    }
  }, [result, setAddedNodes, setNodeEdges]);

  useEffect(() => {
    if (!addedNodes) return;
    setNodes(addedNodes);
  }, [addedNodes]);

  const { mutate } = useMutation({
    mutationFn: udpateWorkflowMutationFn,
    onSuccess: () => {
      toast.success("Workflow saved!");
    },
    onError: (err: any) => {
      toast.error(`Save failed: ${err?.response?.data?.message}`);
    },
  });

  const saveNodeAndEdges = async () => {
    mutate({ id, nodes, edges });
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((prev) => {
        const updatedNode = applyNodeChanges(changes, prev);

        setAddedNodes(updatedNode);

        return updatedNode;
      }),

    [setAddedNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((prev) => {
        const updated = applyEdgeChanges(changes, prev);
        setNodeEdges(updated);
        return updated;
      }),
    [setNodeEdges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((prev) => {
        const updated = addEdge(connection, prev);
        setNodeEdges(updated);
        return updated;
      }),
    [setNodeEdges],
  );

  const onNodeSelect = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      setSelectedNode(nodes[0]);
    },
    [nodes],
  );

  useOnSelectionChange({
    onChange: onNodeSelect,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-screen h-[88vh] gap-2 text-muted-foreground">
        <Loader2 className="animate-spin w-5 h-5" />
        <span>Loading workflow…</span>
      </div>
    );
  }

  if (isError || !result?.workflow) {
    return (
      <div className="flex items-center justify-center w-screen h-[88vh] text-destructive">
        Failed to load workflow. Please refresh or try again.
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "88vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        deleteKeyCode="Delete"
        fitView
      >
        <Controls />
        <MiniMap />

        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        <Panel position="top-left">
          <AgentToolPanel />
        </Panel>
        <Panel position="top-right">
          <SettingPanel />
        </Panel>
        <Panel position="bottom-center">
          <Button onClick={saveNodeAndEdges}>
            <Save className="w-6 h-6" />
            Save
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
