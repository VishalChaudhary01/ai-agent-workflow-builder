import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-4 md:pt-12 md:px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl md:text-6xl text-center font-extrabold tracking-tight">
          Workflows
        </h1>
      </div>
      <div className="mt-12 ">
        <div className="w-full flex items-center justify-end mb-4 sm:px-0 px-12">
          <Button>Create New Workflow</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card className="mx-auto w-full max-w-90">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>
                This card uses the small size variant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The card component supports a size prop that can be set to
                &quot;sm&quot; for a more compact appearance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
