import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AppStateProvider } from "./features/app-state/AppStateContext";
import Index from "./pages/Index";
import Jogadores from "./pages/Jogadores";
import Sorteio from "./pages/Sorteio";
import Escalacoes from "./pages/Escalacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppStateProvider>
        <Sonner richColors closeButton position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/jogadores" element={<Jogadores />} />
              <Route path="/sorteio" element={<Sorteio />} />
              <Route path="/escalacoes" element={<Escalacoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
