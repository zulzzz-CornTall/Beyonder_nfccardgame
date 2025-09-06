
import React, { useEffect, useState } from 'react';
import { AttackType } from '@/types/game';

interface AttackEffectsProps {
  attack: AttackType | string | null;
  onComplete: () => void;
}

export const AttackEffects: React.FC<AttackEffectsProps> = ({ attack, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<'impact' | 'explosion' | 'fade'>('impact');

  useEffect(() => {
    if (attack) {
      console.log('Attack effect triggered:', attack);
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2000); // Show effect for 2 seconds for faster gameplay

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
      case 'burst': return 'bg-red-500/30';
      case 'guts': return 'bg-green-500/30';
      case 'slash': return 'bg-blue-500/30';
      default: return 'bg-gray-500/30';
    }
  };
  
  const getAttackGradient = () => {
    switch (attackType) {
      case 'burst': return 'from-red-600/60 via-orange-500/40 to-yellow-400/20';
      case 'guts': return 'from-green-600/60 via-emerald-500/40 to-lime-400/20';
      case 'slash': return 'from-blue-600/60 via-cyan-500/40 to-sky-400/20';
      default: return 'from-gray-600/60 via-gray-500/40 to-gray-400/20';
    }
  };

  const getAttackName = () => {
    switch (attackType) {
      case 'burst': return '💥 BURST ATTACK!';
      case 'guts': return '💚 GUTS STRIKE!';
      case 'slash': return '⚔️ SLASH COMBO!';
      default: return '⚡ POWER ATTACK!';
    }
  };
  
  const getAttackEmoji = () => {
    switch (attackType) {
      case 'burst': return '🔥';
      case 'guts': return '🌟';
      case 'slash': return '⚡';
      default: return '💫';
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Radial Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-radial ${getAttackGradient()} animate-power-surge`}></div>
      
      {/* Main Rumble Overlay */}
      <div className={`absolute inset-0 ${getAttackColor()} animate-rumble`}></div>
      
      {/* Impact Shockwave */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-32 h-32 rounded-full ${getAttackColor()} animate-ping`}></div>
      </div>
      
      {/* Secondary Shockwave */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
        <div className={`w-64 h-64 rounded-full ${getAttackColor()} animate-ping opacity-60`}></div>
      </div>
      
      {/* Floating Attack Emojis */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-9xl animate-bounce opacity-80" style={{ animationDelay: '0.1s' }}>
          {getAttackEmoji()}
        </div>
      </div>
      
      {/* Attack Text with Enhanced Effects */}
      <div className="absolute inset-0 flex items-center justify-center animate-power-surge">
        <div className="text-center">
          <div className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl animate-pulse mb-4">
            {getAttackName()}
          </div>
          <div className="text-2xl text-yellow-300 font-semibold animate-bounce">
            CRITICAL HIT!
          </div>
        </div>
      </div>
      
      {/* Screen Flash Effect */}
      <div className={`absolute inset-0 bg-white/20 animate-ping`} style={{ animationDuration: '0.3s' }}></div>
      
      {/* Particle Effects */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-2 h-2 ${getAttackColor()} rounded-full animate-ping`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
