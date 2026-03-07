import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import RootProvider from "./providers/rootProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootProvider>
      <Toaster richColors />
      <App />
    </RootProvider>
  </StrictMode>,
);
