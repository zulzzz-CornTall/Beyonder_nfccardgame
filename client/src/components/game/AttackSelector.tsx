import React from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { Button } from '@/components/ui/button';
import { AttackType } from '@/types/game';
import { getAttackColor } from '@/lib/gameLogic';
import { Zap, Shield, Sword } from 'lucide-react';

interface AttackSelectorProps {
  playerId: 1 | 2;
  selectedAttack?: AttackType;
  disabled?: boolean;
}

const ATTACK_ICONS = {
  burst: Zap,
  guts: Shield,
  slash: Sword
};

const ATTACK_DESCRIPTIONS = {
  burst: 'Explosive energy attack - Strong vs Guts',
  guts: 'Defensive power strike - Strong vs Slash', 
  slash: 'Swift cutting attack - Strong vs Burst'
};

export const AttackSelector: React.FC<AttackSelectorProps> = ({
  playerId,
  selectedAttack,
  disabled = false
}) => {
  const { selectAttack } = useFighting();

  const handleAttackSelect = (attack: AttackType) => {
    if (!disabled) {
      selectAttack(playerId, attack);
    }
  };

  const attacks: AttackType[] = ['burst', 'guts', 'slash'];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white text-center">Choose Your Attack</h3>
      <div className="grid gap-3">
        {attacks.map((attack) => {
          const Icon = ATTACK_ICONS[attack];
          const isSelected = selectedAttack === attack;
          const baseColor = getAttackColor(attack);
          
          return (
            <Button
              key={attack}
              onClick={() => handleAttackSelect(attack)}
              disabled={disabled}
              variant={isSelected ? "default" : "outline"}
              className={`
                h-16 p-4 flex flex-col items-center justify-center transition-all
                ${isSelected 
                  ? `${baseColor} text-white hover:opacity-90` 
                  : 'border-purple-500/50 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="font-semibold">
                {attack.charAt(0).toUpperCase() + attack.slice(1)}
              </span>
              {!isSelected && (
                <span className="text-xs opacity-75 mt-1 text-center leading-tight">
                  {ATTACK_DESCRIPTIONS[attack]}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      
      {selectedAttack && (
        <div className="text-center p-3 bg-green-900/30 rounded-lg border border-green-500/30">
          <p className="text-green-300 text-sm">
            ✓ Attack selected: <span className="font-semibold text-green-200">
              {selectedAttack.charAt(0).toUpperCase() + selectedAttack.slice(1)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
