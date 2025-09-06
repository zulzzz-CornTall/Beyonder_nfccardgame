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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const BattleTest: React.FC = () => {
  const { battleState, setGamePhase, resolveRound, resetBattle, startBattle, makeRobotDecision, getCurrentTurnPlayer, getPlayerTurnOrder } = useFighting();
  const { playHit, playClick, playAttack, playSuccess } = useAudio();
  const { t } = useLanguage();
  const [currentAttackEffect, setCurrentAttackEffect] = useState<string | null>(null);
  const [showingDialogue, setShowingDialogue] = useState<'intro' | 'battle1' | 'battle2' | 'win' | 'lose' | null>(null);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [attackingPlayer, setAttackingPlayer] = useState<number | null>(null);
  const [attackAnimation, setAttackAnimation] = useState<'idle' | 'attacking' | 'hit'>('idle');

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
      // Show attack animation sequence
      if (battleState.lastBattleResult.winner) {
        const winnerPlayer = battleState.players.find(p => p.id === battleState.lastBattleResult?.winner);
        if (winnerPlayer?.selectedAttack) {
          console.log('Starting attack sequence:', winnerPlayer.selectedAttack);
          setAttackingPlayer(winnerPlayer.id);
          setAttackAnimation('attacking');

          // Play dash sound immediately
          playClick(); // Dash sound

          // Play attack-specific sound and show effects
          setTimeout(() => {
            // Play different sound based on attack type
            switch(winnerPlayer.selectedAttack) {
              case 'burst':
                playAttack(); // Explosive sound
                break;
              case 'guts':
                playHit(); // Impact sound  
                break;
              case 'slash':
                playSuccess(); // Sharp sound
                break;
              default:
                playHit();
            }
            setCurrentAttackEffect(winnerPlayer.selectedAttack);
            setAttackAnimation('hit');
          }, 500);

          // Return to idle position
          setTimeout(() => {
            setAttackAnimation('idle');
            setAttackingPlayer(null);
          }, 1500);
        }
      }
    }
  }, [battleState.lastBattleResult, playHit, battleState.players]);

  const allPlayersSelectedAttacks = battleState.players.every(p => p.selectedAttack);
  const turnOrder = getPlayerTurnOrder();
  const currentTurnPlayer = getCurrentTurnPlayer();

  const getPlayerDisplayName = (player: any) => {
    if (player.selectedCharacterCard && player.selectedCharacterCard.character.name) {
      return player.selectedCharacterCard.character.name;
    }
    return player.name;
  };

  const renderCharacterCard = (player: any, isPlayer2: boolean) => {
    const isAttacking = attackingPlayer === player.id && attackAnimation === 'attacking';
    const isBeingHit = attackingPlayer !== player.id && attackAnimation === 'hit';

    return (
      <div className={`relative transition-all duration-500 ${
        isPlayer2
          ? (isAttacking ? 'transform translate-x-20' : 'transform translate-x-0')
          : (isAttacking ? 'transform -translate-x-20' : 'transform translate-x-0')
      } ${isBeingHit ? 'animate-hit-impact' : ''}`}>
        {/* Character Image - Large and Prominent */}
        <div className={`relative ${
          isPlayer2 ? 'transform scale-x-[-1]' : ''
        }`}>
          <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-orange-600 to-red-700 shadow-2xl overflow-hidden ${
            isAttacking ? 'animate-battle-glow' : ''
          }`}>
            {player.selectedCharacterCard && (
              <img
                src={player.selectedCharacterCard.image}
                alt={player.selectedCharacterCard.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = '/textures/sand.jpg';
                }}
              />
            )}
          </div>

          {/* Attack Effect Overlay */}
          {isAttacking && (
            <>
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-radial from-yellow-400/40 via-orange-500/20 to-transparent rounded-full animate-power-surge"></div>
            </>
          )}

          {/* Character Info */}
          <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center ${
            isPlayer2 ? 'transform scale-x-[-1]' : ''
          }`}>
            <h3 className="text-lg font-bold text-white bg-black/70 px-2 py-1 rounded">
              {player.selectedCharacterCard?.name || player.name}
            </h3>
          </div>
        </div>

        {/* Health Bar - Prominent */}
        <div className="mt-12 mb-4">
          <div className="text-center mb-2">
            <span className="text-white font-bold text-lg">{player.name}</span>
          </div>
          <HealthBar health={player.health} maxHealth={player.maxHealth} />
        </div>
      </div>
    );
  };

  const renderControlPanel = (player: any) => (
    <Card className="bg-black/70 backdrop-blur-sm border-yellow-400/50">
      <CardContent className="p-4">
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

        {/* Battle Phase Status */}
        {player.selectedAttack && (
          <div className="text-center mt-2">
            <p className="text-sm text-yellow-300">
              <span className="font-semibold text-white text-lg">
                {player.selectedAttack.charAt(0).toUpperCase() + player.selectedAttack.slice(1)} Attack!
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex flex-col overflow-hidden">
      {/* Header with round info and controls - Compact */}
      <div className="flex justify-between items-center p-3 bg-black/30 flex-shrink-0">
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
          <h1 className="text-xl font-bold text-white">{t.round} {battleState.currentRound}</h1>
          <p className="text-yellow-300 text-sm">
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

      {/* Enhanced Attack Effects */}
      <AttackEffects
        attack={currentAttackEffect as any}
        onComplete={() => setCurrentAttackEffect(null)}
      />

      {/* Additional Visual Effects */}
      {attackAnimation !== 'idle' && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent animate-ping"></div>
        </div>
      )}

      {/* Main Battle Area - 16:9 Desktop Optimized Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Characters Section - Upper Half */}
        <div className="flex-1 grid grid-cols-2 gap-8 p-6">
          {/* Player 1 Character */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Character Info Header */}
            <div className="text-center bg-purple-900/30 p-3 rounded border border-purple-500/30 w-full max-w-xs">
              <p className="text-purple-200 text-sm">{getPlayerDisplayName(battleState.players.find(p => p.id === 1))}</p>
              {battleState.players.find(p => p.id === 1)?.selectedCharacterCard && (
                <>
                  <p className="text-white font-semibold">{battleState.players.find(p => p.id === 1)?.selectedCharacterCard.character.name}</p>
                  {battleState.players.find(p => p.id === 1)?.selectedPowerCard && (
                    <p className="text-blue-300 text-sm">{t.power}: {battleState.players.find(p => p.id === 1)?.selectedPowerCard.power.name}</p>
                  )}
                </>
              )}
            </div>

            {/* Health Bar */}
            <div className="w-full max-w-xs">
              <HealthBar
                currentHP={battleState.players.find(p => p.id === 1)?.currentHP}
                maxHP={battleState.players.find(p => p.id === 1)?.maxHP}
                playerName={getPlayerDisplayName(battleState.players.find(p => p.id === 1))}
                isActive={battleState.phase === 'selecting' && currentTurnPlayer?.id === 1}
              />
            </div>

            {/* Character Display */}
            <div className="flex-1 bg-purple-900/20 rounded-lg border border-purple-500/30 flex items-center justify-center w-full max-w-xs h-48 relative overflow-hidden">
              {battleState.players.find(p => p.id === 1)?.selectedCharacterCard?.character.image ? (
                <img
                  src={battleState.players.find(p => p.id === 1)?.selectedCharacterCard.character.image}
                  alt={battleState.players.find(p => p.id === 1)?.selectedCharacterCard.character.name}
                  className={`max-w-full max-h-full object-contain transition-all duration-500 ${
                    attackAnimation === 'player1-attack' ? 'scale-110 animate-pulse' : ''
                  }`}
                />
              ) : (
                <div className="text-8xl">👤</div>
              )}

              {/* Attack Effect Overlay */}
              {currentAttackEffect === 'player1' && (
                <div className="absolute inset-0 bg-gradient-radial from-red-500/50 via-orange-500/30 to-transparent animate-ping"></div>
              )}
            </div>
          </div>

          {/* Player 2 Character */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Character Info Header */}
            <div className="text-center bg-blue-900/30 p-3 rounded border border-blue-500/30 w-full max-w-xs">
              <p className="text-blue-200 text-sm">{getPlayerDisplayName(battleState.players.find(p => p.id === 2))}</p>
              {battleState.players.find(p => p.id === 2)?.selectedCharacterCard && (
                <>
                  <p className="text-white font-semibold">{battleState.players.find(p => p.id === 2)?.selectedCharacterCard.character.name}</p>
                  {battleState.players.find(p => p.id === 2)?.selectedPowerCard && (
                    <p className="text-purple-300 text-sm">{t.power}: {battleState.players.find(p => p.id === 2)?.selectedPowerCard.power.name}</p>
                  )}
                </>
              )}
            </div>

            {/* Health Bar */}
            <div className="w-full max-w-xs">
              <HealthBar
                currentHP={battleState.players.find(p => p.id === 2)?.currentHP}
                maxHP={battleState.players.find(p => p.id === 2)?.maxHP}
                playerName={getPlayerDisplayName(battleState.players.find(p => p.id === 2))}
                isActive={battleState.phase === 'selecting' && currentTurnPlayer?.id === 2}
              />
            </div>

            {/* Character Display */}
            <div className="flex-1 bg-blue-900/20 rounded-lg border border-blue-500/30 flex items-center justify-center w-full max-w-xs h-48 relative overflow-hidden">
              {battleState.players.find(p => p.id === 2)?.selectedCharacterCard?.character.image ? (
                <img
                  src={battleState.players.find(p => p.id === 2)?.selectedCharacterCard.character.image}
                  alt={battleState.players.find(p => p.id === 2)?.selectedCharacterCard.character.name}
                  className={`max-w-full max-h-full object-contain transition-all duration-500 ${
                    attackAnimation === 'player2-attack' ? 'scale-110 animate-pulse' : ''
                  }`}
                />
              ) : battleState.players.find(p => p.id === 2)?.isRobot ? (
                <div className="text-8xl">🤖</div>
              ) : (
                <div className="text-8xl">👤</div>
              )}

              {/* Attack Effect Overlay */}
              {currentAttackEffect === 'player2' && (
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/50 via-cyan-500/30 to-transparent animate-ping"></div>
              )}
            </div>
          </div>
        </div>

        {/* Attack Selectors Section - Lower Half */}
        <div className="h-80 grid grid-cols-2 gap-8 px-6 pb-6 flex-shrink-0">
          {/* Player 1 Attack Selector */}
          <div className="flex justify-center">
            {!battleState.players.find(p => p.id === 1)?.isRobot && (
              <div className="w-full max-w-xs">
                <AttackSelector
                  playerId={1}
                  selectedAttack={battleState.players.find(p => p.id === 1)?.selectedAttack}
                  disabled={battleState.phase !== 'selecting'}
                />
              </div>
            )}
          </div>

          {/* Player 2 Attack Selector */}
          <div className="flex justify-center">
            {!battleState.players.find(p => p.id === 2)?.isRobot && (
              <div className="w-full max-w-xs">
                <AttackSelector
                  playerId={2}
                  selectedAttack={battleState.players.find(p => p.id === 2)?.selectedAttack}
                  disabled={battleState.phase !== 'selecting'}
                />
              </div>
            )}
          </div>
        </div>
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