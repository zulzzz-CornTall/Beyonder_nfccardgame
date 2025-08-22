
import React, { useEffect, useState } from 'react';
import { AttackType } from '@/types/game';

interface AttackEffectsProps {
  attack: AttackType | null;
  onComplete: () => void;
}

export const AttackEffects: React.FC<AttackEffectsProps> = ({ attack, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (attack) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2000); // Show effect for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [attack, onComplete]);

  if (!attack || !isVisible) return null;

  const renderBurstEffect = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* Red beam effect */}
      <div className="relative w-full h-32">
        <div className="absolute top-1/2 left-0 w-full h-8 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse transform -translate-y-1/2 opacity-90">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-ping"></div>
        </div>
        {/* Energy particles */}
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-red-400 rounded-full animate-bounce transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-300 rounded-full animate-pulse transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-red-500 rounded-full animate-bounce transform -translate-y-1/2"></div>
      </div>
      {/* Blast text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-300 animate-pulse">
        💥 BURST!
      </div>
    </div>
  );

  const renderGutsEffect = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* Green explosion effect */}
      <div className="relative">
        {/* Main explosion circle */}
        <div className="w-48 h-48 bg-gradient-radial from-green-400 via-green-600 to-transparent rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-radial from-green-300 via-green-500 to-transparent rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Explosion particles */}
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-green-400 rounded-full animate-bounce transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-green-400 rounded-full animate-bounce transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 w-3 h-3 bg-green-400 rounded-full animate-bounce transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-3 h-3 bg-green-400 rounded-full animate-bounce transform -translate-y-1/2"></div>
        
        {/* Corner particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
      </div>
      {/* Explosion text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-green-300 animate-bounce">
        💚 GUTS!
      </div>
    </div>
  );

  const renderSlashEffect = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* Blue sword slash effect */}
      <div className="relative w-full h-full">
        {/* Diagonal slash lines */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform rotate-45 origin-center animate-pulse"></div>
        <div className="absolute top-1/4 left-0 w-full h-3 bg-gradient-to-r from-transparent via-blue-300 to-transparent transform rotate-45 origin-center animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-4 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform rotate-45 origin-center animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-3 bg-gradient-to-r from-transparent via-blue-300 to-transparent transform rotate-45 origin-center animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform rotate-45 origin-center animate-pulse"></div>
        
        {/* Sword silhouette */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
          <div className="w-1 h-32 bg-blue-400 mx-auto animate-pulse"></div>
          <div className="w-6 h-4 bg-blue-600 mx-auto transform -translate-y-1"></div>
        </div>
        
        {/* Slash particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 transform rotate-45 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-blue-400 transform rotate-45 animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-blue-300 transform rotate-45 animate-bounce"></div>
      </div>
      {/* Slash text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-blue-300 animate-pulse">
        ⚔️ SLASH!
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {attack === 'burst' && renderBurstEffect()}
      {attack === 'guts' && renderGutsEffect()}
      {attack === 'slash' && renderSlashEffect()}
    </div>
  );
};
