import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFighting } from '@/lib/stores/useFighting';
import { RPSChoice } from '@/types/game';

interface InteractiveRPSProps {
  playerId: 1 | 2;
  playerName: string;
  selectedAttack: string;
}

export const InteractiveRPS: React.FC<InteractiveRPSProps> = ({ 
  playerId, 
  playerName, 
  selectedAttack 
}) => {
  const { battleState, selectRPS } = useFighting();
  const player = battleState.players.find(p => p.id === playerId);
  
  const rpsOptions: { value: RPSChoice; emoji: string; name: string }[] = [
    { value: 'rock', emoji: '🪨', name: 'Rock' },
    { value: 'paper', emoji: '📄', name: 'Paper' },
    { value: 'scissors', emoji: '✂️', name: 'Scissors' }
  ];

  if (player?.rpsChoice) {
    return (
      <Card className="bg-black/50 border-green-500/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">{playerName}</h3>
          <p className="text-green-300 text-sm mb-4">Attack: {selectedAttack}</p>
          <div className="text-4xl mb-2">
            {rpsOptions.find(opt => opt.value === player.rpsChoice)?.emoji}
          </div>
          <p className="text-green-300 font-semibold">
            {rpsOptions.find(opt => opt.value === player.rpsChoice)?.name} Selected!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-yellow-500/50">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white mb-2">{playerName}</h3>
          <p className="text-yellow-300 text-sm mb-4">Attack: {selectedAttack}</p>
          <p className="text-yellow-300 font-semibold">Choose your move:</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {rpsOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => selectRPS(playerId, option.value)}
              className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 hover:border-purple-300 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-semibold">{option.name}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};