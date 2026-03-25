import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/CommandPalette";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Index from "./pages/Index.tsx";
import Channels from "./pages/Channels.tsx";
import Campaigns from "./pages/Campaigns.tsx";
import Insights from "./pages/Insights.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        <Sonner richColors closeButton position="top-right" />
        <BrowserRouter>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SidebarProvider>
  </QueryClientProvider>
);

export default App;
