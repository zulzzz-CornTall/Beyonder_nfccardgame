import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BattleResult } from '@/types/game';
import { getAttackName, getEffectivenessText, getWinReason } from '@/lib/gameLogic';

interface BattleResultsProps {
  result: BattleResult;
}

export const BattleResults: React.FC<BattleResultsProps> = ({ result }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-purple-900 to-indigo-900 border-yellow-500/50 animate-in fade-in-0 zoom-in-95 duration-300">
        <CardContent className="p-8 text-center">
          {/* Winner Announcement */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              🎯 {result.attacker.name} Wins!
            </h2>
            <p className="text-white text-lg">
              {getWinReason(result.attacker.selectedAttack!, result.defender.selectedAttack!)}
            </p>
          </div>

          {/* Attack Details */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-black/30 rounded-lg">
              <p className="text-purple-300 text-sm mb-1">Attack Used</p>
              <p className="text-white font-bold text-xl">
                {getAttackName(result.attacker.selectedAttack!)}
              </p>
            </div>

            <div className="p-4 bg-black/30 rounded-lg">
              <p className="text-purple-300 text-sm mb-1">Effectiveness</p>
              <p className={`font-bold text-lg ${
                result.wasEffective ? 'text-green-400' : 'text-gray-300'
              }`}>
                {getEffectivenessText(
                  result.attacker.selectedAttack!,
                  result.defender.selectedAttack!
                )}
              </p>
            </div>

            {/* Damage Display */}
            <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/30">
              <p className="text-red-300 text-sm mb-1">Damage Dealt</p>
              <p className="text-red-400 font-bold text-3xl animate-pulse">
                -{result.damage}
              </p>
              {result.wasEffective && (
                <p className="text-green-400 text-xs mt-1">
                  ★ CRITICAL HIT! ★
                </p>
              )}
            </div>
          </div>

          {/* Auto-continue message */}
          <p className="text-purple-300 text-sm animate-pulse">
            Continuing in 3 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
