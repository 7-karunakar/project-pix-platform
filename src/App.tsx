
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { authService } from "./services/authService";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setIsAuthenticated(!!currentUser);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Login onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout onLogout={handleLogout}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requiredPermission="dashboard">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute requiredPermission="projects">
                    <ProjectManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/budget" 
                element={
                  <ProtectedRoute requiredPermission="budget">
                    <BudgetManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cast-crew" 
                element={
                  <ProtectedRoute requiredPermission="castCrew">
                    <CastCrew />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <ProtectedRoute requiredPermission="schedule">
                    <Schedule />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assets" 
                element={
                  <ProtectedRoute requiredPermission="assets">
                    <Assets />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/locations" 
                element={
                  <ProtectedRoute requiredPermission="locations">
                    <Locations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communication" 
                element={
                  <ProtectedRoute requiredPermission="communication">
                    <Communication />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute requiredPermission="reports">
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute requiredPermission="tasks">
                    <Tasks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute requiredPermission="feedback">
                    <Feedback />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
