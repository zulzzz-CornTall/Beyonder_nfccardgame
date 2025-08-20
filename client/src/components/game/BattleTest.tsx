import React, { useEffect, useState } from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { useAudio } from '@/lib/stores/useAudio';
import { AttackSelector } from './AttackSelector';
import { HealthBar } from './HealthBar';
import { BattleResults } from './BattleResults';
import { NFCCardDisplay } from './NFCCardDisplay';
import { InteractiveRPS } from './InteractiveRPS';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const BattleTest: React.FC = () => {
  const { battleState, setGamePhase, resolveRound, resetBattle, startBattle } = useFighting();
  const { playHit } = useAudio();
  const [showResults, setShowResults] = useState(false);

  

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
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 p-2 sm:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <Button 
          onClick={() => setGamePhase('menu')}
          variant="outline" 
          size="sm"
          className="border-black/50 text-yellow-200 hover:bg-black/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Round {battleState.currentRound}</h1>
          <p className="text-yellow-300 text-xs sm:text-sm">
            {battleState.phase === 'selecting' && 'Select your attacks'}
            {battleState.phase === 'rps' && 'Choose Rock, Paper, or Scissors!'}
            {battleState.phase === 'resolving' && 'Determining winner...'}
            {battleState.phase === 'ended' && 'Battle Complete!'}
          </p>
        </div>

        <Button 
          onClick={resetBattle}
          variant="outline" 
          size="sm"
          className="border-black/50 text-yellow-200 hover:bg-black/20"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {battleState.players.map((player) => (
          <Card key={player.id} className="bg-black/50 backdrop-blur-sm border-black/50">
            <CardContent className="p-4 sm:p-6">
              {/* Player Header */}
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{player.name}</h2>
                <HealthBar health={player.health} maxHealth={player.maxHealth} />
              </div>

              {/* NFC Card Display */}
              <NFCCardDisplay 
                scannedCardsCount={player.scannedCards.length}
                playerId={player.id}
              />

              {/* Attack Selection */}
              {battleState.phase === 'selecting' && (
                <div className="mt-4 sm:mt-6">
                  <AttackSelector 
                    playerId={player.id}
                    selectedAttack={player.selectedAttack}
                    disabled={battleState.phase !== 'selecting'}
                  />
                </div>
              )}


              {/* Rock-Paper-Scissors Selection */}
              {battleState.phase === 'rps' && player.selectedAttack && (
                <div className="mt-4 sm:mt-6">
                  <InteractiveRPS 
                    playerId={player.id}
                    playerName={player.name}
                    selectedAttack={player.selectedAttack}
                  />
                </div>
              )}

              {/* Battle Phase Status */}
              <div className="mt-3 sm:mt-4 text-center">
                {player.selectedAttack && (
                  <p className="text-xs sm:text-sm text-yellow-300">
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

      {/* Auto-progress messages */}
      {battleState.phase === 'rps' && (
        <div className="text-center mt-4 sm:mt-6 px-2">
          <div className="p-3 sm:p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <p className="text-blue-300 text-base sm:text-lg font-semibold">
              🎯 Both attacks selected! Now choose Rock, Paper, or Scissors above.
            </p>
          </div>
        </div>
      )}

      {battleState.phase === 'resolving' && (
        <div className="text-center mt-4 sm:mt-6 px-2">
          <div className="p-3 sm:p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-300 text-base sm:text-lg font-semibold animate-pulse">
              ⚔️ Determining Winner via Rock-Paper-Scissors...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};