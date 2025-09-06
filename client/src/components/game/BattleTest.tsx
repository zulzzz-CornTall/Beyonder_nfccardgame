import React, { useEffect, useState } from 'react';
import { useFighting } from '@/lib/stores/useFighting';
import { useAudio } from '@/lib/stores/useAudio';
import { useLanguage } from '@/lib/stores/useLanguage';
import { AttackSelector } from './AttackSelector';
import { HealthBar } from './HealthBar';
import { BattleResults } from './BattleResults';
import { NFCCardDisplay } from './NFCCardDisplay';
import { RouletteRPS } from './RouletteRPS';
import { AttackEffects } from './AttackEffects';
import { DialogueDisplay } from './DialogueDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const BattleTest: React.FC = () => {
  const { battleState, setGamePhase, resolveRound, resetBattle, startBattle, makeRobotDecision } = useFighting();
  const { playHit, playClick } = useAudio();
  const { t } = useLanguage();
  const [currentAttackEffect, setCurrentAttackEffect] = useState<string | null>(null);
  const [showingDialogue, setShowingDialogue] = useState<'intro' | 'battle1' | 'battle2' | 'win' | 'lose' | null>(null);
  const [dialogueStep, setDialogueStep] = useState(0);

  // Show intro dialogue when battle starts
  useEffect(() => {
    if (battleState.phase === 'selecting' && dialogueStep === 0) {
      const aiPlayer = battleState.players.find(p => p.aiOpponent);
      if (aiPlayer?.aiOpponent) {
        setShowingDialogue('intro');
        setDialogueStep(1);
      }
    }
  }, [battleState.phase, dialogueStep]);

  // Show battle dialogues during combat
  useEffect(() => {
    if (battleState.phase === 'rps' && dialogueStep === 1) {
      const aiPlayer = battleState.players.find(p => p.aiOpponent);
      if (aiPlayer?.aiOpponent) {
        setTimeout(() => {
          setShowingDialogue('battle1');
          setDialogueStep(2);
        }, 1000);
      }
    }
  }, [battleState.phase, dialogueStep]);

  // Handle robot decisions
  useEffect(() => {
    battleState.players.forEach(player => {
      if (player.isRobot) {
        makeRobotDecision(player.id);
      }
    });
  }, [battleState.phase, battleState.players.map(p => p.selectedAttack).join(','), battleState.players.map(p => p.rpsChoice).join(','), makeRobotDecision]);

  useEffect(() => {
    if (battleState.lastBattleResult) {
      // Show attack effect first
      if (battleState.lastBattleResult.winner) {
        const winnerPlayer = battleState.players.find(p => p.id === battleState.lastBattleResult?.winner);
        if (winnerPlayer?.selectedAttack) {
          console.log('Setting attack effect:', winnerPlayer.selectedAttack);
          setCurrentAttackEffect(winnerPlayer.selectedAttack);
          playHit();
        }
      }
    }
  }, [battleState.lastBattleResult, playHit, battleState.players]);

  const allPlayersSelectedAttacks = battleState.players.every(p => p.selectedAttack);
  const { getCurrentTurnPlayer, getPlayerTurnOrder } = useFighting();
  const turnOrder = getPlayerTurnOrder();
  const currentTurnPlayer = getCurrentTurnPlayer();

  const renderPlayerCard = (player: any, isRotated: boolean) => (
    <Card className="bg-black/50 backdrop-blur-sm border-black/50 h-full">
      <CardContent className={`p-1 h-full ${isRotated ? 'transform rotate-180' : ''}`}>
        {/* Compact Player Info - Single Line */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1">
            <h2 className="text-xs font-bold text-white truncate">{player.name}</h2>
            <HealthBar health={player.health} maxHealth={player.maxHealth} />
          </div>

          {/* Character Image - Very Compact */}
          {player.selectedCharacterCard && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-8 h-8 rounded border border-yellow-400/50 bg-gray-800 overflow-hidden flex-shrink-0">
                <img
                  src={player.selectedCharacterCard.image}
                  alt={player.selectedCharacterCard.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/textures/sand.jpg';
                  }}
                />
              </div>
              <div className="text-xs">
                <p className="text-white font-semibold leading-none">{player.selectedCharacterCard.name}</p>
                <p className="text-yellow-400 leading-none capitalize">{player.selectedCharacterCard.element}</p>
              </div>
            </div>
          )}
        </div>

        {/* Compact Action Area */}
        <div className="space-y-1">
          {/* Attack Selection */}
          {battleState.phase === 'selecting' && (
            <AttackSelector
              playerId={player.id}
              selectedAttack={player.selectedAttack}
              disabled={battleState.phase !== 'selecting'}
            />
          )}

          {/* Rock-Paper-Scissors Roulette */}
          {battleState.phase === 'rps' && player.selectedAttack && (
            <RouletteRPS
              playerId={player.id}
              playerName={player.name}
              selectedAttack={player.selectedAttack}
            />
          )}

          {/* Battle Phase Status - Compact */}
          {player.selectedAttack && (
            <p className="text-xs text-yellow-300 text-center">
              <span className="font-semibold text-white">
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
          onClick={() => {
            playClick();
            setGamePhase('menu');
          }}
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
          onClick={() => {
            playClick();
            resetBattle();
          }}
          variant="outline"
          size="sm"
          className="border-black/50 text-yellow-200 hover:bg-black/20"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {t.reset}
        </Button>
      </div>

      {/* Attack Effects */}
      <AttackEffects
        attack={currentAttackEffect as any}
        onComplete={() => setCurrentAttackEffect(null)}
      />

      {/* Main Battle Area - Optimized Layout */}
      <div className="flex flex-col gap-2 max-w-4xl mx-auto h-[calc(100vh-160px)] min-h-[500px]">
        {/* Player 2 - Top (Rotated 180 degrees) */}
        {battleState.players.filter(p => p.id === 2).map((player) => (
          <div key={player.id} className="h-[48%]">
            <Card className="bg-black/50 backdrop-blur-sm border-black/50 h-full">
              <CardContent className={`p-2 h-full transform rotate-180`}>
                <div className="flex h-full">
                  {/* Left: Character Image - Large and Prominent */}
                  <div className="flex-shrink-0 w-32 flex flex-col items-center justify-center mr-4">
                    {player.selectedCharacterCard && (
                      <>
                        <div className="w-20 h-20 rounded-lg border-2 border-yellow-400/80 bg-gray-800 overflow-hidden shadow-lg mb-2">
                          <img
                            src={player.selectedCharacterCard.image}
                            alt={player.selectedCharacterCard.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/textures/sand.jpg';
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold text-xs">{player.selectedCharacterCard.name}</p>
                          <p className="text-yellow-400 text-xs capitalize">{player.selectedCharacterCard.element}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right: Player Info and Actions */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Player Name and Health */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          {player.name} {player.isRobot && '🤖'}
                        </h3>
                        <HealthBar
                          current={player.health}
                          max={player.maxHealth}
                          compact={true}
                        />
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                      {/* Attack Selection */}
                      {battleState.phase === 'selecting' && (
                        <div className="max-h-32 overflow-hidden">
                          <AttackSelector
                            playerId={player.id}
                            selectedAttack={player.selectedAttack}
                            disabled={battleState.phase !== 'selecting'}
                          />
                        </div>
                      )}
                      {/* Rock-Paper-Scissors Roulette */}
                      {battleState.phase === 'rps' && player.selectedAttack && (
                        <div className="flex justify-center">
                          <RouletteRPS
                            playerId={player.id}
                            playerName={player.name}
                            selectedAttack={player.selectedAttack}
                          />
                        </div>
                      )}

                      {/* Battle Phase Status */}
                      {player.selectedAttack && (
                        <p className="text-xs text-yellow-300 text-center">
                          <span className="font-semibold text-white">
                            {player.selectedAttack.charAt(0).toUpperCase() + player.selectedAttack.slice(1)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Player 1 - Bottom */}
        {battleState.players.filter(p => p.id === 1).map((player) => (
          <div key={player.id} className="h-[48%]">
            <Card className="bg-black/50 backdrop-blur-sm border-black/50 h-full">
              <CardContent className={`p-2 h-full`}>
                <div className="flex h-full">
                  {/* Left: Character Image - Large and Prominent */}
                  <div className="flex-shrink-0 w-32 flex flex-col items-center justify-center mr-4">
                    {player.selectedCharacterCard && (
                      <>
                        <div className="w-20 h-20 rounded-lg border-2 border-yellow-400/80 bg-gray-800 overflow-hidden shadow-lg mb-2">
                          <img
                            src={player.selectedCharacterCard.image}
                            alt={player.selectedCharacterCard.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/textures/sand.jpg';
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold text-xs">{player.selectedCharacterCard.name}</p>
                          <p className="text-yellow-400 text-xs capitalize">{player.selectedCharacterCard.element}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right: Player Info and Actions */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Player Name and Health */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          {player.name} {player.isRobot && '🤖'}
                        </h3>
                        <HealthBar
                          current={player.health}
                          max={player.maxHealth}
                          compact={true}
                        />
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                      {/* Attack Selection */}
                      {battleState.phase === 'selecting' && (
                        <div className="max-h-32 overflow-hidden">
                          <AttackSelector
                            playerId={player.id}
                            selectedAttack={player.selectedAttack}
                            disabled={battleState.phase !== 'selecting'}
                          />
                        </div>
                      )}
                      {/* Rock-Paper-Scissors Roulette */}
                      {battleState.phase === 'rps' && player.selectedAttack && (
                        <div className="flex justify-center">
                          <RouletteRPS
                            playerId={player.id}
                            playerName={player.name}
                            selectedAttack={player.selectedAttack}
                          />
                        </div>
                      )}

                      {/* Battle Phase Status */}
                      {player.selectedAttack && (
                        <p className="text-xs text-yellow-300 text-center">
                          <span className="font-semibold text-white">
                            {player.selectedAttack.charAt(0).toUpperCase() + player.selectedAttack.slice(1)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Auto-progress messages - Compact */}
      {battleState.phase === 'rps' && (
        <div className="text-center mt-2 px-2">
          <div className="p-2 bg-blue-900/30 rounded border border-blue-500/30">
            <p className="text-blue-300 text-sm font-semibold">
              🎯 {t.selectAttack}! {t.chooserps}
            </p>
          </div>
        </div>
      )}

      {battleState.phase === 'resolving' && (
        <div className="text-center mt-2 px-2">
          <div className="p-2 bg-yellow-900/30 rounded border border-yellow-500/30">
            <p className="text-yellow-300 text-sm font-semibold animate-pulse">
              ⚔️ {t.determiningWinner}
            </p>
          </div>
        </div>
      )}

      {/* AI Dialogue Display */}
      {showingDialogue && (
        <DialogueDisplay
          type={showingDialogue}
          onComplete={() => setShowingDialogue(null)}
          autoHide={true}
          duration={3000}
        />
      )}
    </div>
  );
};