import React, { useState, useEffect } from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AttackType } from '@/types/game';
import { getAttackColor } from '@/lib/gameLogic';

interface RouletteProps {
  playerId: 1 | 2;
  value?: number;
  isActive: boolean;
  selectedAttack?: AttackType;
}

export const Roulette: React.FC<RouletteProps> = ({
  playerId,
  value,
  isActive,
  selectedAttack
}) => {
  // const { spinRoulette } = useFighting(); // Removed roulette functionality
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  const handleSpin = async () => {
    // Roulette functionality has been replaced with rock-paper-scissors
    console.log('Roulette no longer used - using rock-paper-scissors instead');
  };

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value);
    }
  }, [value]);

  const attackColor = selectedAttack ? getAttackColor(selectedAttack) : 'bg-gray-500';

  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold text-white">Roulette Spin</h3>
      
      {/* Roulette Display */}
      <Card className={`mx-auto w-32 h-32 ${attackColor} border-4 border-white relative overflow-hidden`}>
        <CardContent className="p-0 flex items-center justify-center h-full">
          <div 
            className={`
              text-4xl font-bold text-white transition-all duration-75
              ${isSpinning ? 'animate-pulse scale-110' : 'scale-100'}
            `}
          >
            {displayValue || '?'}
          </div>
          
          {/* Spinning animation overlay */}
          {isSpinning && (
            <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </CardContent>
      </Card>

      {/* Spin Button */}
      {isActive && value === undefined && !isSpinning && (
        <Button
          onClick={handleSpin}
          disabled={isSpinning || !isActive || value !== undefined}
          className="w-full h-12 font-semibold transition-all bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105 text-white"
        >
          SPIN!
        </Button>
      )}

      {/* Spinning State */}
      {isSpinning && (
        <div className="w-full h-12 flex items-center justify-center bg-gray-600 rounded text-white font-semibold">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Spinning...
        </div>
      )}

      {/* Result Display */}
      {value && (
        <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-300 text-sm">
            Final Result: <span className="font-bold text-yellow-400 text-lg">{value}</span>
          </p>
        </div>
      )}
    </div>
  );
};
