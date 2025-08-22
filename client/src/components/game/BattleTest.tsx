import React, { useEffect, useState } from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { useAudio } from '@/lib/stores/useAudio';
import { useLanguage } from '@/lib/stores/useLanguage';
import { AttackSelector } from './AttackSelector';
import { HealthBar } from './HealthBar';
import { BattleResults } from './BattleResults';
import { NFCCardDisplay } from './NFCCardDisplay';
import { RouletteRPS } from './RouletteRPS';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const BattleTest: React.FC = () => {
  const { battleState, setGamePhase, resolveRound, resetBattle, startBattle } = useFighting();
  const { playHit } = useAudio();
  const { t } = useLanguage();
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

  const renderPlayerCard = (player: any, isRotated: boolean) => (
    <Card className="bg-black/50 backdrop-blur-sm border-black/50 h-full">
      <CardContent className={`p-1 sm:p-2 h-full ${isRotated ? 'transform rotate-180' : ''}`}>
        {/* Player Header */}
        <div className="text-center mb-1">
          <h2 className="text-xs sm:text-sm font-bold text-white mb-1">{player.name}</h2>
          <HealthBar health={player.health} maxHealth={player.maxHealth} />
        </div>

        {/* Character Image Display - Compact */}
        {player.selectedCharacterCard && (
          <div className="mb-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-1 rounded-lg overflow-hidden border border-yellow-400/50 bg-gray-800">
              <img 
                src={player.selectedCharacterCard.image} 
                alt={player.selectedCharacterCard.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = '/textures/sand.jpg';
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-xs">{player.selectedCharacterCard.name}</p>
              <p className="text-yellow-400 text-xs capitalize">{player.selectedCharacterCard.element}</p>
            </div>
          </div>
        )}

        {/* NFC Card Display */}
        <NFCCardDisplay 
          scannedCardsCount={player.scannedCards.length}
          playerId={player.id}
        />

        {/* Attack Selection */}
        {battleState.phase === 'selecting' && (
          <div className="mt-1">
            <AttackSelector 
              playerId={player.id}
              selectedAttack={player.selectedAttack}
              disabled={battleState.phase !== 'selecting'}
            />
          </div>
        )}

        {/* Rock-Paper-Scissors Roulette */}
        {battleState.phase === 'rps' && player.selectedAttack && (
          <div className="mt-1">
            <RouletteRPS 
              playerId={player.id}
              playerName={player.name}
              selectedAttack={player.selectedAttack}
            />
          </div>
        )}

        {/* Battle Phase Status */}
        <div className="mt-1 text-center">
          {player.selectedAttack && (
            <p className="text-xs text-yellow-300">
              {t.attack}: <span className="font-semibold text-white">
                {player.selectedAttack.charAt(0).toUpperCase() + player.selectedAttack.slice(1)}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 p-2 sm:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <Button 
          onClick={() => setGamePhase('menu')}
          variant="outline" 
          size="sm"
          className="border-black/50 text-yellow-200 hover:bg-black/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToMenu}
        </Button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t.round} {battleState.currentRound}</h1>
          <p className="text-yellow-300 text-xs sm:text-sm">
            {battleState.phase === 'selecting' && t.selectYourAttacks}
            {battleState.phase === 'rps' && t.chooserps}
            {battleState.phase === 'resolving' && t.determiningWinner}
            {battleState.phase === 'ended' && t.battleComplete}
          </p>
        </div>

        <Button 
          onClick={resetBattle}
          variant="outline" 
          size="sm"
          className="border-black/50 text-yellow-200 hover:bg-black/20"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {t.reset}
        </Button>
      </div>

      {/* Battle Results Overlay */}
      {showResults && battleState.lastBattleResult && (
        <BattleResults result={battleState.lastBattleResult} />
      )}

      {/* Main Battle Area - Vertical Layout with Player 1 Bottom, Player 2 Top */}
      <div className="flex flex-col gap-2 max-w-4xl mx-auto h-[50vh]">
        {/* Player 2 - Top (Rotated 180 degrees) */}
        {battleState.players.filter(p => p.id === 2).map((player) => (
          <div key={player.id} className="flex-1">
            {renderPlayerCard(player, true)}
          </div>
        ))}
        
        {/* Player 1 - Bottom */}
        {battleState.players.filter(p => p.id === 1).map((player) => (
          <div key={player.id} className="flex-1">
            {renderPlayerCard(player, false)}
          </div>
        ))}
      </div>

      {/* Auto-progress messages */}
      {battleState.phase === 'rps' && (
        <div className="text-center mt-4 sm:mt-6 px-2">
          <div className="p-3 sm:p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <p className="text-blue-300 text-base sm:text-lg font-semibold">
              🎯 {t.selectAttack}! {t.chooserps}
            </p>
          </div>
        </div>
      )}

      {battleState.phase === 'resolving' && (
        <div className="text-center mt-4 sm:mt-6 px-2">
          <div className="p-3 sm:p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-300 text-base sm:text-lg font-semibold animate-pulse">
              ⚔️ {t.determiningWinner}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};