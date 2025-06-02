
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProjectManagement from "./pages/ProjectManagement";
import BudgetManagement from "./pages/BudgetManagement";
import CastCrew from "./pages/CastCrew";
import Schedule from "./pages/Schedule";
import Assets from "./pages/Assets";
import Locations from "./pages/Locations";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectManagement />} />
            <Route path="/budget" element={<BudgetManagement />} />
            <Route path="/cast-crew" element={<CastCrew />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
