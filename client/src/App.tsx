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
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex items-center justify-center p-2 sm:p-4">
      <div className="text-center space-y-4 sm:space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-6xl font-bold text-red-400 animate-bounce">
            🏆 VICTORY! 🏆
          </h1>
          <h2 className="text-xl sm:text-3xl font-bold text-white">
            {winner?.name} Wins!
          </h2>
        </div>
        
        <div className="space-y-3 sm:space-y-4 text-white">
          <div className="p-4 sm:p-6 bg-black/50 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Final Stats</h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-green-400 font-bold text-base sm:text-lg">{winner?.name}</p>
                <p className="text-xs sm:text-sm">HP Remaining: {winner?.health}</p>
                <p className="text-xs sm:text-sm">Card: {winner?.selectedCharacterCard?.name}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-red-400 font-bold text-base sm:text-lg">{loser?.name}</p>
                <p className="text-xs sm:text-sm">HP Remaining: {loser?.health}</p>
                <p className="text-xs sm:text-sm">Card: {loser?.selectedCharacterCard?.name}</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm sm:text-lg">Battle lasted {battleState.currentRound - 1} rounds</p>
        </div>
        
        <button
          onClick={resetBattle}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-black font-semibold rounded-lg text-base sm:text-lg transition-all hover:scale-105 w-full sm:w-auto"
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
    <div className="w-full min-h-screen overflow-x-hidden">
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
