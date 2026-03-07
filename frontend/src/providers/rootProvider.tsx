import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkflowProvider from "./workflowProvider";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WorkflowProvider>{children}</WorkflowProvider>
    </QueryClientProvider>
  );
}
