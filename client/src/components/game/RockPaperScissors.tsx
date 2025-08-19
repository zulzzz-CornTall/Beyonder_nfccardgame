import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AttackType } from '@/types/game';
import { getAttackColor } from '@/lib/gameLogic';
import { Zap, Shield, Sword } from 'lucide-react';

interface RockPaperScissorsProps {
  playerId: 1 | 2;
  selectedAttack?: AttackType;
  isResolving: boolean;
}

const ATTACK_ICONS = {
  burst: Zap,
  guts: Shield,
  slash: Sword
};

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({
  playerId,
  selectedAttack,
  isResolving
}) => {
  if (!selectedAttack) return null;

  const Icon = ATTACK_ICONS[selectedAttack];
  const attackColor = getAttackColor(selectedAttack);

  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Choice</h3>
      
      {/* Attack Display */}
      <Card className={`mx-auto w-32 h-32 ${attackColor} border-4 border-white relative overflow-hidden`}>
        <CardContent className="p-0 flex flex-col items-center justify-center h-full">
          <Icon className="h-8 w-8 text-white mb-2" />
          <div className="text-lg font-bold text-white">
            {selectedAttack.charAt(0).toUpperCase() + selectedAttack.slice(1)}
          </div>
          
          {/* Resolving animation overlay */}
          {isResolving && (
            <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </CardContent>
      </Card>

      {/* Status Display */}
      {isResolving && (
        <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-300 text-sm animate-pulse">
            Determining winner...
          </p>
        </div>
      )}
    </div>
  );
};