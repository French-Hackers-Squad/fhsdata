import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { trackVisitorIP } from "@/utils/ipTracker";
import { useEffect } from "react";
import Index from "@/pages/Index";
import WebsiteMonitor from "@/pages/WebsiteMonitor";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import IrisWeb from "@/pages/IrisWeb";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Terminal from "@/pages/Terminal";
import AttackReference from "@/pages/AttackReference";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    trackVisitorIP();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/attacks" element={<AttackReference />} />
          <Route 
            path="/monitor" 
            element={
              <ProtectedRoute>
                <WebsiteMonitor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/irisweb" element={<IrisWeb />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
