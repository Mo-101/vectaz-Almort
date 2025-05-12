
import React, { Suspense, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormsPage from "./pages/FormsPage";
import DeepCALPage from "./pages/DeepCALPage";
import LoadingScreen from "./components/LoadingScreen";
import { isSystemBooted, bootApp } from "@/core/engine/boot";
import GlobalNavigation from "./components/GlobalNavigation";
import DeepTalk from "./components/chat/DeepTalk";

// Create a client
const queryClient = new QueryClient();

// Lazily load the Training page
const TrainingPage = React.lazy(() => import('./pages/training'));

// Setup App with React Query for data fetching and caching
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize application
    const initializeApp = async () => {
      console.log("Initializing application...");
      
      // Check if the system is already booted from a previous session
      if (isSystemBooted()) {
        console.log("System already booted, proceeding to application");
        setIsLoading(false);
        return;
      }
      
      try {
        // Boot the application with data from deeptrack_3.json
        await bootApp();
        console.log("Boot completed successfully");
      } catch (error) {
        console.error("Boot failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initialize immediately and set a fallback timer just in case
    initializeApp();
    
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback timer triggered");
      setIsLoading(false);
    }, 3000); // Show loading screen for max 3 seconds
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Router for navigation */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/forms" element={<FormsPage />} />
                <Route path="/deepcal" element={<DeepCALPage />} />
                <Route path="/training" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <TrainingPage />
                  </Suspense>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global Navigation appears on every page */}
              <GlobalNavigation />
            </BrowserRouter>
        
            {/* UI Components for notifications */}
            <Toaster />
            <Sonner />
            
            {/* Floating DeepTalk chatbot */}
            <DeepTalk />
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
