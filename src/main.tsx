import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import "./styles/globals.css";

import Home from "./app/Home.tsx";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <NuqsAdapter>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <Home />
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </NuqsAdapter>
    </StrictMode>
  );
}
