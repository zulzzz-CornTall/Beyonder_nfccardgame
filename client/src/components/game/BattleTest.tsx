import React, { useEffect, useState } from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { useAudio } from '@/lib/stores/useAudio';
import { AttackSelector } from './AttackSelector';
import { HealthBar } from './HealthBar';
import { BattleResults } from './BattleResults';
import { NFCCardDisplay } from './NFCCardDisplay';
import { RockPaperScissors } from './RockPaperScissors';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const BattleTest: React.FC = () => {
  const { battleState, setGamePhase, resolveRound, resetBattle, startBattle } = useFighting();
  const { playHit } = useAudio();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    startBattle();
  }, [startBattle]);

  useEffect(() => {
    if (battleState.lastBattleResult) {
      setShowResults(true);
      playHit();
      
      const timer = setTimeout(() => {
        setShowResults(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [battleState.lastBattleResult, playHit]);

  const allPlayersSelectedAttacks = battleState.players.every(p => p.selectedAttack);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setGamePhase('menu')}
          variant="outline" 
          className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Round {battleState.currentRound}</h1>
          <p className="text-purple-300 text-sm">
            {battleState.phase === 'selecting' && 'Select your attacks'}
            {battleState.phase === 'resolving' && 'Determining winner...'}
            {battleState.phase === 'ended' && 'Battle Complete!'}
          </p>
        </div>
        
        <Button 
          onClick={resetBattle}
          variant="outline" 
          className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Battle Results Overlay */}
      {showResults && battleState.lastBattleResult && (
        <BattleResults result={battleState.lastBattleResult} />
      )}

      {/* Main Battle Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {battleState.players.map((player) => (
          <Card key={player.id} className="bg-black/50 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              {/* Player Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{player.name}</h2>
                <HealthBar health={player.health} maxHealth={player.maxHealth} />
              </div>

              {/* NFC Card Display */}
              <NFCCardDisplay 
                card={player.nfcCard}
                playerId={player.id}
              />

              {/* Attack Selection */}
              {battleState.phase === 'selecting' && (
                <div className="mt-6">
                  <AttackSelector 
                    playerId={player.id}
                    selectedAttack={player.selectedAttack}
                    disabled={battleState.phase !== 'selecting'}
                  />
                </div>
              )}


              {/* Rock-Paper-Scissors Display */}
              {battleState.phase === 'resolving' && player.selectedAttack && (
                <div className="mt-6">
                  <RockPaperScissors 
                    playerId={player.id}
                    selectedAttack={player.selectedAttack}
                    isResolving={true}
                  />
                </div>
              )}

              {/* Battle Phase Status */}
              <div className="mt-4 text-center">
                {player.selectedAttack && (
                  <p className="text-sm text-purple-300">
                    Selected: <span className="font-semibold text-white">
                      {player.selectedAttack.charAt(0).toUpperCase() + player.selectedAttack.slice(1)}
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RPS selection interface */}

      {/* Auto-resolving message when both players selected */}
      {battleState.phase === 'resolving' && (
        <div className="text-center mt-6">
          <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-300 text-lg font-semibold animate-pulse">
              ⚔️ Determining Winner via Rock-Paper-Scissors...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
