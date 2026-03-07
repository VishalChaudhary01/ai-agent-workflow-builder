import { useWorkflowContext } from "@/context/workflowContext";
import AgentSetting from "./nodeSetting/AgentSetting";
import IfElseSetting from "./nodeSetting/IfElseSetting";
import WhileSetting from "./nodeSetting/WhileSetting";
import UserApprovalSetting from "./nodeSetting/UserApprovalSetting";
import EndSetting from "./nodeSetting/EndSetting";
import APISetting from "./nodeSetting/APISetting";

export default function SettingPanel() {
  const { selectedNode } = useWorkflowContext();

  switch (selectedNode?.type) {
    case "agentNode":
      return <AgentSetting key={selectedNode.id} />;
    case "ifElseNode":
      return <IfElseSetting key={selectedNode.id} />;
    case "whileNode":
      return <WhileSetting key={selectedNode.id} />;
    case "userApprovalNode":
      return <UserApprovalSetting key={selectedNode.id} />;
    case "endNode":
      return <EndSetting key={selectedNode.id} />;
    case "apiNode":
      return <APISetting key={selectedNode.id} />;
    default:
      return null;
  }
}
