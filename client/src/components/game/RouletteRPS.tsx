import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFighting } from '@/lib/stores/useFighting';
import { useLanguage } from '@/lib/stores/useLanguage';
import { useAudio } from '@/lib/stores/useAudio';
import { RPSChoice } from '@/types/game';

interface RouletteRPSProps {
  playerId: 1 | 2;
  playerName: string;
  selectedAttack: string;
}

export const RouletteRPS: React.FC<RouletteRPSProps> = ({ 
  playerId, 
  playerName, 
  selectedAttack 
}) => {
  const { battleState, selectRPS } = useFighting();
  const { t } = useLanguage();
  const { playRouletteSpinning, playRpsSelect } = useAudio();
  const player = battleState.players.find(p => p.id === playerId);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentOption, setCurrentOption] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [spinInterval, setSpinInterval] = useState<NodeJS.Timeout | null>(null);

  const getRPSOptions = () => [
    { value: 'rock' as RPSChoice, emoji: '🪨', name: t.rock },
    { value: 'paper' as RPSChoice, emoji: '📄', name: t.paper },
    { value: 'scissors' as RPSChoice, emoji: '✂️', name: t.scissors }
  ];
  
  const rpsOptions = getRPSOptions();

  // Auto-start roulette when component mounts
  useEffect(() => {
    if (!player?.rpsChoice && !hasSpun) {
      const delay = Math.random() * 1000 + 500; // Random delay 0.5-1.5s
      const timer = setTimeout(() => {
        startRoulette();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [player?.rpsChoice, hasSpun]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (spinInterval) {
        clearInterval(spinInterval);
      }
    };
  }, [spinInterval]);

  const startRoulette = () => {
    if (isSpinning || player?.rpsChoice) return;
    
    setIsSpinning(true);
    setHasSpun(true);
    playRouletteSpinning(); // Add spinning sound effect
    
    // Continuous spin animation until manually stopped
    const interval = setInterval(() => {
      setCurrentOption((prev) => (prev + 1) % 3);
    }, 100); // Spin every 100ms
    
    setSpinInterval(interval);
  };

  const stopRoulette = () => {
    if (!isSpinning || !spinInterval) return;
    
    clearInterval(spinInterval);
    setSpinInterval(null);
    setIsSpinning(false);
    
    // Play selection sound and select the final result
    playRpsSelect();
    const finalChoice = rpsOptions[currentOption].value;
    selectRPS(playerId, finalChoice);
  };

  // If player already selected, show result
  if (player?.rpsChoice) {
    const selectedOption = rpsOptions.find(opt => opt.value === player.rpsChoice);
    return (
      <Card className="bg-black/50 border-green-500/50 w-full max-w-xs">
        <CardContent className="p-2 text-center">
          <div className="text-3xl mb-1">
            {selectedOption?.emoji}
          </div>
          <p className="text-green-300 font-semibold text-xs">
            {selectedOption?.name} ✓
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-yellow-500/50 w-full max-w-xs">
      <CardContent className="p-2">
        <div className="text-center mb-1">
          {isSpinning ? (
            <p className="text-yellow-300 font-semibold text-xs">🎲 Spinning...</p>
          ) : (
            <p className="text-yellow-300 font-semibold text-xs">🎯 Ready!</p>
          )}
        </div>
        
        {/* Roulette Display */}
        <div className="relative">
          <div className={`text-center transition-all duration-100 ${isSpinning ? 'scale-110' : 'scale-100'}`}>
            <div className="text-3xl mb-1 transform transition-transform duration-100">
              {rpsOptions[currentOption].emoji}
            </div>
            <div className={`text-xs font-semibold text-white ${isSpinning ? 'opacity-60' : 'opacity-100'}`}>
              {rpsOptions[currentOption].name}
            </div>
          </div>
          
          {/* Spinning indicator */}
          {isSpinning && (
            <div className="absolute inset-0 border-2 border-yellow-400 border-dashed rounded-lg animate-spin opacity-50"></div>
          )}
        </div>
        
        {/* Control buttons */}
        {!isSpinning && !hasSpun && (
          <div className="mt-1">
            <button
              onClick={startRoulette}
              className="w-full py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-all hover:scale-105"
            >
              🎰 Start
            </button>
          </div>
        )}
        
        {/* Stop button when spinning */}
        {isSpinning && (
          <div className="mt-1">
            <button
              onClick={stopRoulette}
              className="w-full py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-all hover:scale-105 animate-pulse"
            >
              🛑 Stop!
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};