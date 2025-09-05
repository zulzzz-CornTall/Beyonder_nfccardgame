import React, { useEffect } from "react";
import { useFighting } from "@/lib/stores/useFighting";
import { useAudio } from "@/lib/stores/useAudio";
import { useLanguage } from "@/lib/stores/useLanguage";
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
  const { t } = useLanguage();

  useEffect(() => {
    playSuccess();
    announceWinner(); // Announce the winner when the component is mounted
  }, [playSuccess]);

  const winner = battleState.players.find(p => p.health > 0);
  const loser = battleState.players.find(p => p.health <= 0);

  const announceWinner = () => {
    // Text-to-speech disabled
    // if (winner) {
    //   const speech = new SpeechSynthesisUtterance(`${winner.name} ${t.wins}`);
    //   window.speechSynthesis.speak(speech);
    // }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex items-center justify-center p-2 sm:p-4">
      <div className="text-center space-y-4 sm:space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-6xl font-bold text-red-400 animate-bounce">
            🏆 {t.victory} 🏆
          </h1>
          <h2 className="text-xl sm:text-3xl font-bold text-white">
            {winner?.name} {t.wins}
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4 text-white">
          <div className="p-4 sm:p-6 bg-black/50 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t.finalStats}</h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-green-400 font-bold text-base sm:text-lg">{winner?.name}</p>
                <p className="text-xs sm:text-sm">{t.hpRemaining}: {winner?.health}</p>
                <p className="text-xs sm:text-sm">{t.card}: {winner?.selectedCharacterCard?.name}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-red-400 font-bold text-base sm:text-lg">{loser?.name}</p>
                <p className="text-xs sm:text-sm">{t.hpRemaining}: {loser?.health}</p>
                <p className="text-xs sm:text-sm">{t.card}: {loser?.selectedCharacterCard?.name}</p>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-lg">{t.battleLasted} {battleState.currentRound - 1} {t.rounds}</p>
        </div>

        <button
          onClick={resetBattle}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-black font-semibold rounded-lg text-base sm:text-lg transition-all hover:scale-105 w-full sm:w-auto"
        >
          {t.playAgain}
        </button>
      </div>
    </div>
  );
};

// Main App component
function App() {
  const { gamePhase } = useFighting();
  const { 
    setBackgroundMusic, 
    setMainTheme,
    setHitSound, 
    setSuccessSound,
    setClickSound
  } = useAudio();

  // Initialize audio and set up user interaction for autoplay
  useEffect(() => {
    const { setBackgroundMusic, setMainTheme, setHitSound, setSuccessSound, setClickSound } = useAudio.getState();

    const backgroundMusic = new Audio('/attached_assets/Raise your cards, the battle\'s near,_1757069968911.mp3');
    const mainTheme = new Audio('/sounds/main-theme.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    const clickSound = new Audio('/sounds/hit.mp3'); // Using hit sound as click sound

    // Preload the main theme
    mainTheme.preload = 'auto';

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    setBackgroundMusic(backgroundMusic);
    setMainTheme(mainTheme);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    setClickSound(clickSound); // Set the click sound

    // Handle user interaction for autoplay
    const handleFirstUserInteraction = () => {
      console.log('User interaction detected, starting main theme...');
      useAudio.getState().playMainTheme();

      // Remove the event listeners after first interaction
      document.removeEventListener('click', handleFirstUserInteraction);
      document.removeEventListener('keydown', handleFirstUserInteraction);
      document.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleFirstUserInteraction);
    document.addEventListener('keydown', handleFirstUserInteraction);
    document.addEventListener('touchstart', handleFirstUserInteraction);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('click', handleFirstUserInteraction);
      document.removeEventListener('keydown', handleFirstUserInteraction);
      document.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, []);

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