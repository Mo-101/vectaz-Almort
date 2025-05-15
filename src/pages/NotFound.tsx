
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      <div className="absolute inset-0 bg-[#0A1A2F] z-0"></div>
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-screen">
        <div className="text-[#00FFD1] text-8xl font-bold mb-4">404</div>
        <div className="text-xl mb-6 text-white">This page is more missing than SR_24-029. Try again?</div>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#00FFD1]/20 border border-[#00FFD1]/50 rounded-lg text-[#00FFD1] hover:bg-[#00FFD1]/30 transition-colors"
        >
          Back to Known Territory
        </button>
      </div>
    </div>
  );
};

export default NotFound;
