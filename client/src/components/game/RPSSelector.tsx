
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RPSChoice } from '@/types/game';
import { useFighting } from '@/lib/stores/useFighting';

interface RPSSelectorProps {
  playerId: 1 | 2;
  selectedChoice?: RPSChoice;
  disabled?: boolean;
}

const RPS_ICONS = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️'
};

const RPS_DESCRIPTIONS = {
  rock: 'Crushes Scissors',
  paper: 'Covers Rock',
  scissors: 'Cuts Paper'
};

export const RPSSelector: React.FC<RPSSelectorProps> = ({
  playerId,
  selectedChoice,
  disabled = false
}) => {
  const { selectRPSChoice } = useFighting();

  const handleChoiceSelect = (choice: RPSChoice) => {
    if (!disabled) {
      selectRPSChoice(playerId, choice);
    }
  };

  const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white text-center">Rock Paper Scissors</h3>
      <div className="grid gap-3">
        {choices.map((choice) => {
          const isSelected = selectedChoice === choice;
          
          return (
            <Button
              key={choice}
              onClick={() => handleChoiceSelect(choice)}
              disabled={disabled}
              variant={isSelected ? "default" : "outline"}
              className={`
                h-16 p-4 flex flex-col items-center justify-center transition-all
                ${isSelected 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'border-purple-500/50 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              <span className="text-2xl mb-1">{RPS_ICONS[choice]}</span>
              <span className="font-semibold">
                {choice.charAt(0).toUpperCase() + choice.slice(1)}
              </span>
              {!isSelected && (
                <span className="text-xs opacity-75 mt-1 text-center leading-tight">
                  {RPS_DESCRIPTIONS[choice]}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      
      {selectedChoice && (
        <div className="text-center p-3 bg-green-900/30 rounded-lg border border-green-500/30">
          <p className="text-green-300 text-sm">
            ✓ Choice selected: <span className="font-semibold text-green-200">
              {selectedChoice.charAt(0).toUpperCase() + selectedChoice.slice(1)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
