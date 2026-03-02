import { useProfileQuery } from "@/lib/queries";
import { Navigate, Outlet } from "react-router-dom";

export default function AppLayout() {
  const { data: user, isLoading } = useProfileQuery();

  if (isLoading) return <h4>Loading...</h4>;

  if (!user) return <Navigate to="/signin" />;

  return (
    <div className="mx-auto max-w-360 w-full min-h-screen">
      <Outlet />
    </div>
  );
}
