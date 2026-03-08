import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/Signup";
import SigninPage from "./pages/Signin";
import DashboardPage from "./pages/Dashboard";
import AuthLayout from "./layouts/auth.layout";
import AppLayout from "./layouts/app.layout";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import Preview from "./pages/Preview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/workflow/:id" element={<WorkflowBuilder />} />
          <Route path="//workflow/:id/preview" element={<Preview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
