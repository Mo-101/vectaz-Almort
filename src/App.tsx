
import React, { Suspense, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormsPage from "./pages/FormsPage";
import DeepCALPage from "./pages/DeepCALPage";
import OracleHutPage from "./pages/OracleHutPage";
import LoadingScreen from "./components/LoadingScreen";
import { isSystemBooted, bootApp } from "./init/boot";
import { useBaseDataStore } from "@/store/baseState";
import { Shipment } from "./types/deeptrack";
import ElevenLabsConvaiWidget from "@/components/chat/ElevenLabsConvaiWidget";
import MainLayout from "@/components/layout/MainLayout";

// Create a client
const queryClient = new QueryClient();

// Lazily load the Training page
const TrainingPage = React.lazy(() => import('./pages/training'));

// Setup App with React Query for data fetching and caching
function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { setShipmentData } = useBaseDataStore();

  useEffect(() => {
    // Check if we've already initialized this session
    const hasInitialized = sessionStorage.getItem('appInitialized');
    if (hasInitialized === 'true') {
      setIsLoading(false);
      setIsInitialLoad(false);
      return;
    }

    // Load sample data faster for demonstration
    const initializeApp = async () => {
      console.log("Initializing application...");
      
      // Check if the system is already booted from a previous session
      if (isSystemBooted()) {
        console.log("System already booted, proceeding to application");
        setIsLoading(false);
        // Mark as initialized so we don't show loading screen on page navigation
        sessionStorage.setItem('appInitialized', 'true');
        return;
      }

      // Generate 25 sample shipments for accurate data representation (reduced from 105)
      const shipments: Shipment[] = Array(25).fill(0).map((_, i) => {
        const requestRef = `SR_24-${i.toString().padStart(3, '0')}_NBO`;
        return {
          id: requestRef,
          request_reference: requestRef,
          origin_country: ['Kenya', 'South Africa', 'Ethiopia', 'Nigeria', 'Egypt'][i % 5],
          origin_latitude: 1.2404475 + (i * 0.01),
          origin_longitude: 36.990054 + (i * 0.01),
          destination_country: ['Zimbabwe', 'Tanzania', 'Uganda', 'Sudan', 'Rwanda'][i % 5],
          destination_latitude: -17.80269125 + (i * 0.01),
          destination_longitude: 31.08848075 + (i * 0.01),
          date_of_collection: new Date().toISOString().split('T')[0],
          cargo_description: `Cargo ${i}`,
          item_category: ['Electronics', 'Clothing', 'Food', 'Machinery', 'Other'][i % 5],
          carrier: ['DHL', 'FedEx', 'UPS', 'Kuehne+Nagel', 'Maersk'][i % 5],
          "carrier+cost": `${Math.floor(Math.random() * 1000)} USD`,
          kuehne_nagel: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          scan_global_logistics: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          dhl_express: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          dhl_global: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          bwosi: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          agl: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          siginon: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          frieght_in_time: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
          weight_kg: Math.floor(Math.random() * 100) + 1,
          volume_cbm: Math.random() * 10,
          initial_quote_awarded: ['DHL', 'FedEx', 'UPS', 'Kuehne+Nagel', 'Maersk'][i % 5],
          final_quote_awarded_freight_forwader_Carrier: ['DHL', 'FedEx', 'UPS', 'Kuehne+Nagel', 'Maersk'][i % 5],
          comments: `Sample shipment ${i}`,
          date_of_arrival_destination: new Date().toISOString(),
          delivery_status: ['delivered', 'in_transit', 'pending'][i % 3],
          mode_of_shipment: ['air', 'sea', 'road'][i % 3],
          forwarder_quotes: {
            'dhl': Math.floor(Math.random() * 1000),
            'fedex': Math.floor(Math.random() * 1000),
            'ups': Math.floor(Math.random() * 1000)
          },
          date_of_greenlight_to_pickup: Math.random() > 0.7 ? new Date().toISOString() : null
        };
      });
      
      try {
        // Boot the application
        await bootApp();
        console.log("Boot completed successfully");
        
        // Store the data in the global state
        setShipmentData(shipments, 'internal', 'v1.0', 'sample-hash');
      } catch (error) {
        console.error("Boot failed:", error);
      } finally {
        setIsLoading(false);
        // Mark as initialized so we don't show loading screen on page navigation
        sessionStorage.setItem('appInitialized', 'true');
      }
    };
    
    // Initialize immediately and set a fallback timer just in case
    initializeApp();
    
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback timer triggered");
      setIsLoading(false);
      sessionStorage.setItem('appInitialized', 'true');
    }, 3000); // Show loading screen for max 3 seconds
    
    return () => clearTimeout(fallbackTimer);
  }, [setShipmentData]);

  // If initial application load is still in progress, show loading screen
  if (isLoading && isInitialLoad) {
    return (
      <TooltipProvider>
        <LoadingScreen isInitialLoad={true} />
      </TooltipProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/deepcal" element={<DeepCALPage />} />
              <Route path="/oracle" element={<OracleHutPage />} />
              <Route path="/training" element={
                <Suspense fallback={<div className="h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFD1]"></div>
                </div>}>
                  <TrainingPage />
                </Suspense>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          
          {/* UI Components for notifications */}
          <Toaster />
          <Sonner />
          
          {/* Chat Widget - kept outside of layout to ensure it's always visible */}
          <ElevenLabsConvaiWidget agentId="kWY3sE6znRmHQqPy48sk" />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
