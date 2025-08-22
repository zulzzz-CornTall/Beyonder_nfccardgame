
import React, { useEffect, useState } from 'react';
import { AttackType } from '@/types/game';

interface AttackEffectsProps {
  attack: AttackType | string | null;
  onComplete: () => void;
}

export const AttackEffects: React.FC<AttackEffectsProps> = ({ attack, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (attack) {
      console.log('Attack effect triggered:', attack);
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2000); // Show effect for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [attack, onComplete]);

  if (!attack || !isVisible) {
    console.log('Attack effect not showing:', { attack, isVisible });
    return null;
  }

  const attackType = attack as AttackType;

  const getAttackColor = () => {
    switch (attackType) {
      case 'burst': return 'bg-red-500/50';
      case 'guts': return 'bg-green-500/50';
      case 'slash': return 'bg-blue-500/50';
      default: return 'bg-gray-500/50';
    }
  };

  const getAttackName = () => {
    switch (attackType) {
      case 'burst': return '💥 BURST!';
      case 'guts': return '💚 GUTS!';
      case 'slash': return '⚔️ SLASH!';
      default: return 'ATTACK!';
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main Rumble Overlay */}
      <div className={`absolute inset-0 ${getAttackColor()} animate-rumble`}></div>
      
      {/* Pulsing Color Fill */}
      <div className={`absolute inset-0 ${getAttackColor()} animate-pulse`}></div>
      
      {/* Secondary Rumble Layer */}
      <div className={`absolute inset-0 ${getAttackColor()} animate-rumble opacity-60`} style={{ animationDelay: '0.1s' }}></div>
      
      {/* Attack Text with Rumble */}
      <div className="absolute inset-0 flex items-center justify-center animate-rumble">
        <div className="text-6xl font-bold text-white drop-shadow-2xl animate-pulse">
          {getAttackName()}
        </div>
      </div>
      
      {/* Additional Pulse Effects */}
      <div className={`absolute inset-0 ${getAttackColor()} animate-ping opacity-30`}></div>
      
      {/* Bounce Effect */}
      <div className={`absolute inset-0 ${getAttackColor()} animate-bounce opacity-40`}></div>
    </div>
  );
};
