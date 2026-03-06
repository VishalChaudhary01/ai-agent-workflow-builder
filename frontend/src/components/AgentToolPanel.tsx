import { WorkflowContext } from "@/context/workflowContext";
import {
  Bot,
  CircleOff,
  Play,
  Repeat,
  ThumbsUp,
  TrendingUpDown,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { useContext } from "react";

export interface ToolType {
  id: string;
  name: string;
  icon: LucideIcon;
  bgColor: string;
  type: string;
}

const tools = [
  {
    id: "1",
    name: "Start",
    icon: Play,
    bgColor: "#fef9c2",
    type: "startNode",
  },
  {
    id: "2",
    name: "Agent",
    icon: Bot,
    bgColor: "#fef9c2",
    type: "agentNode",
  },
  {
    id: "3",
    name: "If/Else",
    icon: TrendingUpDown,
    bgColor: "#fef9c2",
    type: "ifElseNode",
  },
  {
    id: "4",
    name: "While",
    icon: Repeat,
    bgColor: "#fef9c2",
    type: "whileNode",
  },
  {
    id: "5",
    name: "API",
    icon: Webhook,
    bgColor: "#fef9c2",
    type: "apiNode",
  },
  {
    id: "6",
    name: "User Approval",
    icon: ThumbsUp,
    bgColor: "#fef9c2",
    type: "userApprovalNode",
  },
  {
    id: "7",
    name: "End",
    icon: CircleOff,
    bgColor: "#fef9c2",
    type: "endNode",
  },
];

export default function AgentToolPanel() {
  const { setAddedNodes } = useContext(WorkflowContext);

  const handleToolClick = (tool: ToolType) => {
    const newNode = {
      id: `${tool.id}-${Date.now()}`,
      position: { x: 0, y: 100 },
      data: { label: tool.name, ...tool },
      type: tool.type,
    };

    setAddedNodes((prev: any) => [...prev, newNode]);
  };

  return (
    <div className="p-4 rounded-lg bg-white border w-46">
      {tools.map((tool) => (
        <div
          key={tool.id}
          onClick={() => handleToolClick(tool)}
          className="flex items-center gap-4 hover:bg-orange-50 rounded-md ease-in-out duration-200 cursor-pointer p-2"
        >
          <tool.icon
            className="w-7 h-7 p-1 rounded-md"
            style={{ backgroundColor: tool.bgColor }}
          />
          <span className="text-base">{tool.name}</span>
        </div>
      ))}
    </div>
  );
}
