import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import Framework from "./pages/Framework";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import RequireAuth from "./components/RequireAuth";
import DashboardHome from "./pages/dashboard/DashboardHome";
import QueryBuilder from "./pages/dashboard/QueryBuilder";
import AgentMonitor from "./pages/dashboard/AgentMonitor";
import VisualInsights from "./pages/dashboard/VisualInsights";
import Reports from "./pages/dashboard/Reports";
import ResultsView from "./pages/dashboard/ResultsView";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./hooks/useAuth";
import PharmacyData from "./pages/dashboard/PharmacyData";
import { DrugSearchPage } from "./pages/DrugSearch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/framework" element={<Framework />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/drugs" element={<DrugSearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="query" element={<QueryBuilder />} />
            <Route path="agents" element={<AgentMonitor />} />
            <Route path="insights" element={<VisualInsights />} />
            <Route path="reports" element={<Reports />} />
            <Route path="results" element={<ResultsView />} />
            <Route path="pharmacy-data" element={<PharmacyData />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
