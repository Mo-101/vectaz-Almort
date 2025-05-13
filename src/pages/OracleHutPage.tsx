
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Plane, Truck, Ship, Download, FileText, Table } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import OracleHutSection for chat functionality
import OracleHutSection from '@/components/OracleHut/OracleHutSection';

// Vehicle component for Mode of Shipment
function MOSVehicle({ mode }: { mode: "air" | "sea" | "road" }) {
  const style = "w-full h-24 text-[#00FFD1]";
  if (mode === "air") return <Plane className={style} />;
  if (mode === "sea") return <Ship className={style} />;
  return <Truck className={style} />;
}

const OracleHutPage = () => {
  const [shipmentMode, setShipmentMode] = useState<"air" | "sea" | "road">("road");
  const [voiceActive, setVoiceActive] = useState(false);
  
  // Start with the chat interface visible
  const [showDashboard, setShowDashboard] = useState(false);

  const startVoice = () => {
    // Placeholder voice logic
    setVoiceActive(true);
    const utterance = new SpeechSynthesisUtterance(
      "Oracle activated. I am ready to illuminate your freight destiny."
    );
    utterance.voice = speechSynthesis.getVoices()[0];
    speechSynthesis.speak(utterance);
  };

  const downloadPDF = () => alert("🚚 PDF Export Placeholder");
  const downloadCSV = () => alert("📦 CSV Export Placeholder");
  
  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-0" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* App Title/Logo */}
        <div className="absolute top-4 right-6 z-20">
          <div className="text-xl font-bold text-[#00FFD1] tracking-wider">
            Oracle Hut <span className="text-xs text-white opacity-70">SYMBOLIC INSIGHTS</span>
          </div>
        </div>
        
        {/* Toggle button for switching between views */}
        <div className="absolute top-4 left-6 z-20">
          <Button 
            variant="outline" 
            className="border-[#00FFD1] text-[#00FFD1] hover:bg-[#00FFD1]/10"
            onClick={() => setShowDashboard(!showDashboard)}
          >
            {showDashboard ? "Chat with Oracle" : "View Dashboard"}
          </Button>
        </div>
        
        {showDashboard ? (
          <div className="flex-1 overflow-y-auto pb-20">
            <div className="container mx-auto pt-20 pb-24 px-4">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-[#00FFD1] tracking-tight">Oracle Hut: Symbolic Freight Insights</h1>
                <Button variant="outline" onClick={startVoice} className="border-[#00FFD1] text-[#00FFD1] hover:bg-[#00FFD1]/10">
                  <Mic className="mr-2 h-4 w-4" />
                  Ask Oracle
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Keep existing dashboard card code */}
                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-white">SASHATIED</h2>
                    <p className="text-sm mt-2 text-slate-400">
                      Mission analytics & distribution stats
                    </p>
                    <div className="mt-4">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-[72%] h-full bg-[#00FFD1]" />
                      </div>
                      <p className="text-sm mt-2 text-white">72.2 / 90.7 TB used</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-white">ROUSE TATIED</h2>
                    <p className="text-sm mt-2 text-slate-400">
                      Real-time delivery metrics
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-white">BROUNG</h2>
                    <p className="text-sm mt-2 text-slate-400">
                      Smart dispatch coordination
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Keep existing dashboard content */}
              <div className="my-6 flex justify-center">
                <div className="w-64">
                  <MOSVehicle mode={shipmentMode} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="col-span-1 lg:col-span-2">
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-white">BESTATION</h2>
                    <Tabs defaultValue="weather">
                      <TabsList className="bg-slate-800 text-white">
                        <TabsTrigger value="weather">Weather</TabsTrigger>
                        <TabsTrigger value="routing">Routing</TabsTrigger>
                        <TabsTrigger value="risks">Risk</TabsTrigger>
                      </TabsList>
                      <TabsContent value="weather" className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/50 p-4 rounded-xl text-white">22°C / Clear</div>
                        <div className="bg-slate-700/50 p-4 rounded-xl text-white">70% Humidity</div>
                        <div className="bg-slate-700/50 p-4 rounded-xl text-white">Wind: 8 km/h</div>
                      </TabsContent>
                      <TabsContent value="routing" className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/50 p-4 rounded-xl text-white">Route A - Mombasa</div>
                        <div className="bg-slate-700/50 p-4 rounded-xl text-white">Route B - Djibouti</div>
                        <div className="bg-slate-700/50 p-4 rounded-xl text-white">Route C - Dubai</div>
                      </TabsContent>
                      <TabsContent value="risks" className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-red-600/70 p-4 rounded-xl text-white">Border Delay: HIGH</div>
                        <div className="bg-yellow-500/70 p-4 rounded-xl text-white">Port: MODERATE</div>
                        <div className="bg-green-600/70 p-4 rounded-xl text-white">Driver Score: 91%</div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-white">MOTRIAL NOTETUTION</h2>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-700/50 p-2 rounded-xl text-white">Load Ratio: 56.6%</div>
                      <div className="bg-slate-700/50 p-2 rounded-xl text-white">Fuel Eff: 4.49 MPG</div>
                      <div className="bg-slate-700/50 p-2 rounded-xl text-white">Driver Score: 78%</div>
                      <div className="bg-slate-700/50 p-2 rounded-xl text-white">Stability: 93.6%</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 italic text-[#00FFD1] text-sm">
                    ✴️ "The Nairobi route whispers efficiency, but only if sanctioned cargo sails before fiscal tides shift."
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button variant="outline" onClick={downloadPDF} className="border-[#00FFD1] text-[#00FFD1] hover:bg-[#00FFD1]/10">
                  <FileText size={16} className="mr-2" /> Export PDF
                </Button>
                <Button variant="outline" onClick={downloadCSV} className="border-[#00FFD1] text-[#00FFD1] hover:bg-[#00FFD1]/10">
                  <Download size={16} className="mr-2" /> Export CSV
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Chat interface - takes up the full screen with proper styling
          <div className="flex-1 overflow-y-auto h-full pt-16">
            {/* Use OracleHutSection component for the chat functionality */}
            <OracleHutSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default OracleHutPage;
