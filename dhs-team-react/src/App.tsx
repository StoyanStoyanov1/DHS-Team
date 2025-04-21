
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectRequest from "./pages/ProjectRequest";
import { useEffect } from "react";
import FixedAiChat from "./components/FixedAiChat";
import { ChatProvider } from "./contexts/ChatContext";

const queryClient = new QueryClient();

// Инициализиране на темата
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const App = () => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/project-request" element={<ProjectRequest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <FixedAiChat />
        </ChatProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
