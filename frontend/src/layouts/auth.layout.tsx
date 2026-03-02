import { useProfileQuery } from "@/lib/queries";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { data: user, isLoading } = useProfileQuery();

  if (isLoading) return <h4>Loading...</h4>;

  if (user) return <Navigate to="/" />;

  return (
    <div>
      <Outlet />
    </div>
  );
}
