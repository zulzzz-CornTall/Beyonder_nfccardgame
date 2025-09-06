import React from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { useLanguage } from '@/lib/stores/useLanguage';
import { useAudio } from '@/lib/stores/useAudio';
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


export const AttackSelector: React.FC<AttackSelectorProps> = ({
  playerId,
  selectedAttack,
  disabled = false
}) => {
  const { selectAttack, battleState, getCurrentTurnPlayer, getPlayerTurnOrder } = useFighting();
  const { t } = useLanguage();
  const { playClick, playAttack } = useAudio();
  
  const player = battleState.players.find(p => p.id === playerId);
  const disabledAttacks = player?.disabledAttacks || [];
  const currentTurnPlayer = getCurrentTurnPlayer();
  const turnOrder = getPlayerTurnOrder();
  const isPlayerTurn = currentTurnPlayer?.id === playerId;
  const playerTurnIndex = turnOrder.findIndex(p => p.id === playerId) + 1;

  const getAttackDescription = (attack: AttackType) => {
    switch (attack) {
      case 'burst': return t.burstDescription;
      case 'guts': return t.gutsDescription;
      case 'slash': return t.slashDescription;
      default: return '';
    }
  };

  const getAttackName = (attack: AttackType) => {
    switch (attack) {
      case 'burst': return t.burst;
      case 'guts': return t.guts;
      case 'slash': return t.slash;
      default: return attack;
    }
  };

  const handleAttackSelect = (attack: AttackType) => {
    if (!disabled) {
      playClick();
      playAttack(); // Add attack sound effect
      selectAttack(playerId, attack);
    }
  };

  const attacks: AttackType[] = ['burst', 'guts', 'slash'];

  return (
    <div className="space-y-2">
      {/* Turn Status - Compact */}
      <div className="text-center">
        {currentTurnPlayer && (
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            isPlayerTurn 
              ? 'bg-green-600 text-white' 
              : currentTurnPlayer.isRobot
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300'
          }`}>
            {isPlayerTurn 
              ? `🎯 Your Turn` 
              : currentTurnPlayer.isRobot
              ? `🤖 AI is thinking...`
              : `⏳ Player ${currentTurnPlayer.id}'s Turn`
            }
          </div>
        )}
        {!currentTurnPlayer && battleState.phase === 'selecting' && (
          <div className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
            ✅ Both attacks selected
          </div>
        )}
      </div>

      {/* Attack Buttons - Compact Grid */}
      <div className="grid gap-2">
        {attacks.map((attack) => {
          const Icon = ATTACK_ICONS[attack];
          const isSelected = selectedAttack === attack;
          const isDisabled = disabled || disabledAttacks.includes(attack) || !isPlayerTurn;
          const baseColor = getAttackColor(attack);

          return (
            <Button
              key={attack}
              onClick={() => handleAttackSelect(attack)}
              disabled={isDisabled}
              variant={isSelected ? "default" : "outline"}
              className={`
                h-12 p-3 flex items-center justify-center transition-all relative text-sm
                ${isSelected 
                  ? `${baseColor} text-white hover:opacity-90` 
                  : 'border-purple-500/50 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                ${disabledAttacks.includes(attack) ? 'border-red-500/50 bg-red-900/20' : ''}
              `}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="font-semibold">
                {getAttackName(attack)}
              </span>
              {disabledAttacks.includes(attack) && (
                <span className="text-xs text-red-300 ml-2">
                  🚫
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Selected Attack Confirmation - Compact */}
      {selectedAttack && (
        <div className="text-center p-2 bg-green-900/30 rounded border border-green-500/30">
          <p className="text-green-300 text-xs">
            ✓ <span className="font-semibold text-green-200">
              {getAttackName(selectedAttack)}
            </span> selected
          </p>
        </div>
      )}
    </div>
  );
};