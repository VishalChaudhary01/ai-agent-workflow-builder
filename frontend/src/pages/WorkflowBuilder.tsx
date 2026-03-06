import Builder from "@/components/Buildre";
import WorkflowBuilderHeader from "@/components/WorkflowBuilderHeader";

export default function WorkflowBuilder() {
  return (
    <div className="w-full">
      <WorkflowBuilderHeader />
      <div>
        <Builder />
      </div>
    </div>
  );
}
