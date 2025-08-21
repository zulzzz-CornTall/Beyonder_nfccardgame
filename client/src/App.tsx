import React, { useEffect } from "react";
import { useFighting } from "@/lib/stores/useFighting";
import { useAudio } from "@/lib/stores/useAudio";
import { MainMenu } from "@/components/game/MainMenu";
import { PreparationScreen } from "@/components/game/PreparationScreen";
import { CharacterSelectionScreen } from "@/components/game/CharacterSelectionScreen";
import { BattleTest } from "@/components/game/BattleTest";
import { RulesModal } from "@/components/game/RulesModal";
import "@fontsource/inter";

// Game results component
const GameResults: React.FC = () => {
  const { battleState, resetBattle } = useFighting();
  const { playSuccess } = useAudio();
  
  useEffect(() => {
    playSuccess();
  }, [playSuccess]);

  const winner = battleState.players.find(p => p.health > 0);
  const loser = battleState.players.find(p => p.health <= 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-red-400 animate-bounce">
            🏆 VICTORY! 🏆
          </h1>
          <h2 className="text-3xl font-bold text-white">
            {winner?.name} Wins!
          </h2>
        </div>
        
        <div className="space-y-4 text-white">
          <div className="p-6 bg-black/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Final Stats</h3>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-green-400 font-bold text-lg">{winner?.name}</p>
                <p className="text-sm">HP Remaining: {winner?.health}</p>
                <p className="text-sm">Card: {winner?.selectedCharacterCard?.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-red-400 font-bold text-lg">{loser?.name}</p>
                <p className="text-sm">HP Remaining: {loser?.health}</p>
                <p className="text-sm">Card: {loser?.selectedCharacterCard?.name}</p>
              </div>
            </div>
          </div>
          
          <p className="text-lg">Battle lasted {battleState.currentRound - 1} rounds</p>
        </div>
        
        <button
          onClick={resetBattle}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-black font-semibold rounded-lg text-lg transition-all hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

// Main App component
function App() {
  const { gamePhase } = useFighting();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Initialize audio on app start
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {gamePhase === 'menu' && <MainMenu />}
      {gamePhase === 'preparation' && <PreparationScreen />}
      {gamePhase === 'character-selection' && <CharacterSelectionScreen />}
      {gamePhase === 'battle' && <BattleTest />}
      {gamePhase === 'results' && <GameResults />}
      {gamePhase === 'rules' && <RulesModal />}
    </div>
  );
}

export default App;
