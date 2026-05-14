'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Envelope() {
  const [isOpening, setIsOpening] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSealFlying, setIsSealFlying] = useState(false);
  const [showFlapShadow, setShowFlapShadow] = useState(false);
  const router = useRouter();

  const handleOpenEnvelope = () => {
    if (isAnimating || isOpening) return;
    
    setIsAnimating(true);
    setIsOpening(true);
    setShowFlapShadow(true);
    
    // Start seal flying animation after a delay
    setTimeout(() => {
      setIsSealFlying(true);
    }, 300);
    
    // Redirect to home page after animation completes
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleEnvelopeClick = () => {
    handleOpenEnvelope();
  };

  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenEnvelope();
  };

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden cursor-pointer"
      onClick={handleEnvelopeClick}
    >
      {/* Envelope Container */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        isOpening ? 'scale-110' : ''
      }`}>
        
        {/* Envelope Back (Bottom Layer) */}
        <div className="absolute w-[95vw] h-[60vh] max-w-[800px] max-h-[500px] 
          bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 
          rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.3)]
          z-10">
          
          {/* Back Fold Lines - 45 degree from corners */}
          <div className="absolute top-0 left-0 w-[45%] h-[45%] 
            border-r-2 border-b-2 border-white/20 
            bg-gradient-to-br from-transparent via-black/10 to-transparent 
            clip-path-[polygon(0_0,100%_0,0_100%)]"></div>
          
          <div className="absolute top-0 right-0 w-[45%] h-[45%] 
            border-l-2 border-b-2 border-white/20 
            bg-gradient-to-br from-transparent via-black/10 to-transparent 
            clip-path-[polygon(100%_0,0_0,100%_100%)]"></div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] h-[45%] 
            border-t-2 border-white/20 
            bg-gradient-to-br from-transparent via-black/10 to-transparent 
            clip-path-[polygon(50%_0,100%_100%,0_100%)]"></div>
        </div>

        {/* Envelope Front (Middle Layer) */}
        <div className="absolute w-[95vw] h-[60vh] max-w-[800px] max-h-[500px] 
          bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 
          rounded-lg 
          shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)]
          z-20 
          clip-path-[polygon(0%_45%,50%_100%,100%_45%,100%_100%,0%_100%)]">
          
          {/* Front Fold Lines */}
          <div className="absolute top-0 left-0 w-[50%] h-[45%] 
            border-r-2 border-b-2 border-white/30 
            bg-gradient-to-br from-transparent via-black/15 to-transparent"></div>
          
          <div className="absolute top-0 right-0 w-[50%] h-[45%] 
            border-l-2 border-b-2 border-white/30 
            bg-gradient-to-br from-transparent via-black/15 to-transparent"></div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] h-[45%] 
            border-t-2 border-white/20 
            bg-gradient-to-br from-transparent via-black/15 to-transparent"></div>
          
          {/* Center Triangle */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[50%] h-[55%] 
            bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 
            clip-path-[polygon(50%_0%,0%_100%,100%_100%)] 
            shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)]"></div>
        </div>

        {/* Envelope Flap (Top Layer) */}
        <div className={`absolute w-[95vw] h-[60vh] max-w-[800px] max-h-[500px] 
          bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 
          rounded-t-lg 
          shadow-[0_-5px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]
          z-30 
          clip-path-[polygon(0%_0%,100%_0%,50%_100%)]
          origin-top
          ${isOpening ? 'animate-flap-open' : 'transition-transform duration-300 hover:scale-[1.02]'}`}>
          
          {/* Flap Shadow (shows during opening) */}
          <div className={`absolute inset-0 
            bg-gradient-to-b from-black/0 via-black/40 to-black/0 
            transition-opacity duration-500
            ${showFlapShadow ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Flap Highlight */}
          <div className="absolute inset-0 
            bg-gradient-to-b from-white/20 via-white/10 to-transparent 
            clip-path-[polygon(0%_0%,100%_0%,50%_100%)]"></div>
          
          {/* Flap Fold Lines */}
          <div className="absolute bottom-0 left-0 w-[50%] h-[45%] 
            border-r-2 border-t-2 border-white/30 
            bg-gradient-to-br from-transparent via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 right-0 w-[50%] h-[45%] 
            border-l-2 border-t-2 border-white/30 
            bg-gradient-to-br from-transparent via-black/20 to-transparent"></div>
        </div>

        {/* Wax Seal */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[100px] h-[100px] md:w-[120px] md:h-[120px]
            rounded-full 
            z-40 cursor-pointer
            ${isSealFlying ? 'animate-seal-fly' : 'animate-seal-pulse hover:scale-110 transition-transform duration-300'}
            ${isOpening ? 'opacity-0' : ''}`}
          onClick={handleSealClick}
        >
          {/* Seal Glow Effect */}
          <div className="absolute inset-0 
            bg-gradient-to-br from-red-600/30 via-red-700/40 to-red-800/30 
            rounded-full 
            animate-seal-glow"></div>
          
          {/* Seal Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Fallback if image doesn't load */}
              <div className="absolute inset-0 
                bg-gradient-to-br from-red-700 via-red-600 to-red-800 
                rounded-full 
                shadow-[inset_0_-5px_15px_rgba(0,0,0,0.5),inset_0_5px_15px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,0,0,0.4)]"></div>
              
              {/* You can replace this with your actual seal image */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl font-serif drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
                  Joshi
                </span>
                <span className="text-white font-bold text-sm md:text-base font-serif drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
                  Family
                </span>
              </div>
              
              {/* Optional: Uncomment to use actual image */}

            </div>
          </div>
        </div>

        {/* Click Instruction */}
        {!isOpening && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 
            bg-black/40 backdrop-blur-sm 
            px-6 py-3 rounded-full 
            border border-white/20
            animate-fade-in">
            <p className="text-white text-sm md:text-base font-medium">
              Click anywhere to open the invitation
            </p>
          </div>
        )}
      </div>

      {/* Loading/Redirecting Indicator */}
      {isOpening && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg md:text-xl font-medium animate-pulse">
              Opening Invitation...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}