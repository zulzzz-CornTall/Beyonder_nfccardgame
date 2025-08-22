import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFighting } from '@/lib/stores/useFighting';
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
  const player = battleState.players.find(p => p.id === playerId);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentOption, setCurrentOption] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  const rpsOptions: { value: RPSChoice; emoji: string; name: string }[] = [
    { value: 'rock', emoji: '🪨', name: 'Rock' },
    { value: 'paper', emoji: '📄', name: 'Paper' },
    { value: 'scissors', emoji: '✂️', name: 'Scissors' }
  ];

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

  const startRoulette = () => {
    if (isSpinning || player?.rpsChoice) return;
    
    setIsSpinning(true);
    setHasSpun(true);
    
    // Spin animation
    let spins = 0;
    const maxSpins = 15 + Math.floor(Math.random() * 10); // 15-25 spins
    
    const spinInterval = setInterval(() => {
      setCurrentOption((prev) => (prev + 1) % 3);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        
        // Select the final result
        const finalChoice = rpsOptions[currentOption].value;
        selectRPS(playerId, finalChoice);
      }
    }, 100); // Spin every 100ms
  };

  // If player already selected, show result
  if (player?.rpsChoice) {
    const selectedOption = rpsOptions.find(opt => opt.value === player.rpsChoice);
    return (
      <Card className="bg-black/50 border-green-500/50">
        <CardContent className="p-3 text-center">
          <h3 className="text-sm font-bold text-white mb-1">{playerName}</h3>
          <p className="text-green-300 text-xs mb-2">Attack: {selectedAttack}</p>
          <div className="text-3xl mb-1">
            {selectedOption?.emoji}
          </div>
          <p className="text-green-300 font-semibold text-xs">
            {selectedOption?.name} Selected!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-yellow-500/50">
      <CardContent className="p-3">
        <div className="text-center mb-2">
          <h3 className="text-sm font-bold text-white mb-1">{playerName}</h3>
          <p className="text-yellow-300 text-xs mb-2">Attack: {selectedAttack}</p>
          {isSpinning ? (
            <p className="text-yellow-300 font-semibold text-xs">🎲 Spinning Roulette...</p>
          ) : (
            <p className="text-yellow-300 font-semibold text-xs">🎯 Ready to spin!</p>
          )}
        </div>
        
        {/* Roulette Display */}
        <div className="relative">
          <div className={`text-center transition-all duration-100 ${isSpinning ? 'scale-110' : 'scale-100'}`}>
            <div className="text-4xl mb-1 transform transition-transform duration-100">
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
        
        {/* Start button if not spinning and hasn't spun */}
        {!isSpinning && !hasSpun && (
          <div className="mt-2">
            <button
              onClick={startRoulette}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-all hover:scale-105"
            >
              🎰 Start Roulette
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};