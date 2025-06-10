
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import QuizPage from "./pages/QuizPage";
import CalculatorPage from "./pages/CalculatorPage";
import AnalysisPage from "./pages/AnalysisPage";
import ProgressPage from "./pages/ProgressPage";
import CoursesPage from "./pages/CoursesPage";
import PortfolioPage from "./pages/PortfolioPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/news" element={<NewsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
