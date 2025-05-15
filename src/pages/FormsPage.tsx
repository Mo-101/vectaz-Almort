
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedRFQForm from '@/components/forms/EnhancedRFQForm';
import NewShipmentForm from '@/components/forms/NewShipmentForm';
import { GlassContainer } from '@/components/ui/glass-effects';
import Particles from '@/components/Particles';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import DeepCALSection from '@/components/DeepCALSection';

const FormsPage = () => {
  const [activeFormTab, setActiveFormTab] = useState("rfq");
  
  const demoForwarders = [
    { id: '1', name: 'Kenya Airways', reliability: 0.92 },
    { id: '2', name: 'DHL', reliability: 0.89 },
    { id: '3', name: 'Kuehne Nagel', reliability: 0.85 },
    { id: '4', name: 'FedEx', reliability: 0.91 },
    { id: '5', name: 'UPS', reliability: 0.88 }
  ];

  // Define the same particle colors as in the loading page
  const particleColors = [
    "#FF5E8F", // Pink
    "#5EFF8F", // Green
    "#5E8FFF", // Blue
    "#FF5E5E", // Red
    "#5EFFFF", // Cyan
    "#FF5EDF", // Magenta
    "#FFFF5E"  // Yellow
  ];

  return (
    <div className="h-screen w-full overflow-x-hidden relative bg-[#0A1A2F]">
      {/* Full page background color */}
      <div className="absolute inset-0 bg-[#0A1A2F] z-0"></div>
      
      {/* Animated background elements */}
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      {/* Particles background with reduced opacity */}
      <Particles
        particleColors={particleColors}
        particleCount={200}
        particleSpread={12}
        speed={0.05}
        particleBaseSize={80}
        moveParticlesOnHover={false}
        particleHoverFactor={0.5}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={25}
        disableRotation={false}
        className="opacity-40" // Reduced opacity for particles
      />
      
      <div className="relative z-10 w-full pt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassContainer className="mb-6 p-4">
            <h1 className="text-2xl font-bold text-center text-[#00FFD1]">DeepCAL Operations Center</h1>
            <p className="text-sm text-center text-gray-400 mt-2">
              Manage shipments and request quotes from the advanced operations hub
            </p>
          </GlassContainer>
          
          <Tabs defaultValue={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="rfq" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
                Request For Quotation
              </TabsTrigger>
              <TabsTrigger value="shipment" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
                New Shipment
              </TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
                DeepCAL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rfq">
              <EnhancedRFQForm availableForwarders={demoForwarders} />
            </TabsContent>
            
            <TabsContent value="shipment">
              <NewShipmentForm />
            </TabsContent>
            
            <TabsContent value="calculator">
              <DeepCALSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
