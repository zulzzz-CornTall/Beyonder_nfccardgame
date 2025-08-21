import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { CharacterCard, PowerCard } from '@/types/game';
import { getAttackColor, getAttackName } from '@/lib/gameLogic';
import { ArrowLeft, Play, Shield, Zap } from 'lucide-react';

export const CharacterSelectionScreen: React.FC = () => {
  const { battleState, setGamePhase, startBattle, selectCharacterCard, selectPowerCard } = useFighting();
  
  const bothPlayersReady = battleState.players.every(p => p.selectedCharacterCard && p.selectedPowerCard);

  // Auto-select cards and start battle if each player has exactly one character and one power card
  React.useEffect(() => {
    let allPlayersAutoSelected = true;
    
    battleState.players.forEach(player => {
      const characterCards = player.scannedCards.filter(card => card.type === 'character');
      const powerCards = player.scannedCards.filter(card => card.type === 'power');
      
      // Auto-select character card if player has exactly one and hasn't selected yet
      if (characterCards.length === 1 && !player.selectedCharacterCard) {
        const cardIndex = player.scannedCards.findIndex(card => card.id === characterCards[0].id);
        selectCharacterCard(player.id, cardIndex);
      }
      
      // Auto-select power card if player has exactly one and hasn't selected yet
      if (powerCards.length === 1 && !player.selectedPowerCard) {
        const cardIndex = player.scannedCards.findIndex(card => card.id === powerCards[0].id);
        selectPowerCard(player.id, cardIndex);
      }
      
      // Check if this player can be auto-selected
      if (characterCards.length !== 1 || powerCards.length !== 1) {
        allPlayersAutoSelected = false;
      }
    });
    
    // If all players can be auto-selected and both are ready, start battle automatically
    if (allPlayersAutoSelected && bothPlayersReady) {
      const timer = setTimeout(() => {
        startBattle();
      }, 1000); // Small delay to show the selection
      
      return () => clearTimeout(timer);
    }
  }, [battleState.players, bothPlayersReady, selectCharacterCard, selectPowerCard, startBattle]);

  const renderCharacterCard = (card: CharacterCard, index: number, playerId: 1 | 2, isSelected: boolean) => {
    const elementColor = getAttackColor(card.element);
    
    return (
      <div 
        key={card.id}
        className={`cursor-pointer transform transition-all duration-200 hover:scale-105 ${
          isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''
        }`}
        onClick={() => selectCharacterCard(playerId, index)}
      >
        <Card className={`${elementColor} bg-opacity-20 border-2 border-current ${
          isSelected ? 'border-yellow-400' : ''
        }`}>
          <CardContent className="p-3 sm:p-4">
            <div className="text-center mb-2 sm:mb-3">
              <h3 className="font-bold text-white text-base sm:text-lg">{card.name}</h3>
              <p className="text-xs text-gray-300">Character Card</p>
              {card.currentHp < card.hp && (
                <p className="text-red-400 text-xs font-bold mt-1">🩹 DAMAGED</p>
              )}
              {isSelected && (
                <p className="text-yellow-400 text-sm font-bold mt-1">✅ SELECTED</p>
              )}
            </div>

            {/* Card Image Placeholder */}
            <div className="w-20 h-20 mx-auto mb-3 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-600">
              <div className="text-center">
                <div className="text-2xl text-yellow-400">🎴</div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  HP
                </span>
                <span className={`font-bold ${card.currentHp < card.hp ? 'text-red-400' : 'text-white'}`}>
                  {card.currentHp}/{card.hp}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">B</span>
                <span className="text-red-400 font-bold">{card.burst}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">G</span>
                <span className="text-green-400 font-bold">{card.guts}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">S</span>
                <span className="text-blue-400 font-bold">{card.slash}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Element</span>
                <span className={`${elementColor} text-white px-2 py-1 rounded text-xs font-bold`}>
                  {getAttackName(card.element)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPowerCard = (card: PowerCard, index: number, playerId: 1 | 2, isSelected: boolean) => {
    return (
      <div 
        key={card.id}
        className={`cursor-pointer transform transition-all duration-200 hover:scale-105 ${
          isSelected ? 'ring-4 ring-purple-400 scale-105' : ''
        }`}
        onClick={() => selectPowerCard(playerId, index)}
      >
        <Card className={`bg-black/30 border-2 border-black/50 ${
          isSelected ? 'border-red-400' : ''
        }`}>
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white text-lg">{card.name}</h3>
              <p className="text-xs text-gray-300">Power Card</p>
              {isSelected && (
                <p className="text-red-400 text-sm font-bold mt-1">✅ SELECTED</p>
              )}
            </div>

            {/* Power Card Icon */}
            <div className="w-20 h-20 mx-auto mb-3 bg-black rounded-lg flex items-center justify-center border-2 border-red-500">
              <div className="text-center">
                <Zap className="text-2xl text-red-400 h-8 w-8" />
              </div>
            </div>

            {/* Power Stats */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">HP Boost</span>
                <span className="text-red-400 font-bold">+{card.hp}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Rock</span>
                <span className="text-red-400 font-bold">x{card.rock}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Paper</span>
                <span className="text-green-400 font-bold">x{card.paper}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Scizor</span>
                <span className="text-blue-400 font-bold">x{card.scizor}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPlayerSection = (playerId: 1 | 2) => {
    const player = battleState.players.find(p => p.id === playerId);
    if (!player) return null;

    const characterCards = player.scannedCards.filter(card => card.type === 'character') as CharacterCard[];
    const powerCards = player.scannedCards.filter(card => card.type === 'power') as PowerCard[];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">
          Player {playerId}
        </h2>
        
        {/* Character Cards Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Character Cards ({characterCards.length})
          </h3>
          {characterCards.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No character cards scanned</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {characterCards.map((card, index) => {
                const originalIndex = player.scannedCards.findIndex(c => c.id === card.id);
                const isSelected = player.selectedCharacterCard?.id === card.id;
                return renderCharacterCard(card, originalIndex, playerId, isSelected);
              })}
            </div>
          )}
        </div>

        {/* Power Cards Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Power Cards ({powerCards.length})
          </h3>
          {powerCards.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No power cards scanned</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {powerCards.map((card, index) => {
                const originalIndex = player.scannedCards.findIndex(c => c.id === card.id);
                const isSelected = player.selectedPowerCard?.id === card.id;
                return renderPowerCard(card, originalIndex, playerId, isSelected);
              })}
            </div>
          )}
        </div>

        {/* Selection Status */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Selection Status:</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Character Card:</span>
              <span className={player.selectedCharacterCard ? 'text-green-400' : 'text-red-400'}>
                {player.selectedCharacterCard ? `✅ ${player.selectedCharacterCard.name}` : '❌ Not selected'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Power Card:</span>
              <span className={player.selectedPowerCard ? 'text-green-400' : 'text-red-400'}>
                {player.selectedPowerCard ? `✅ ${player.selectedPowerCard.name}` : '❌ Not selected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-8 gap-3 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setGamePhase('preparation')}
            className="text-white hover:text-gray-300 order-1 sm:order-1"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preparation
          </Button>
          
          <h1 className="text-xl sm:text-3xl font-bold text-white text-center order-2 sm:order-2">
            Select Your Cards
          </h1>
          
          <div className="hidden sm:block sm:w-32" /> {/* Spacer - Hidden on mobile */}
        </div>

        {/* Instructions */}
        <div className="text-center mb-4 sm:mb-8">
          <p className="text-gray-300 text-sm sm:text-lg px-2">
            Each player must select <strong>one character card</strong> and <strong>one power card</strong> to battle.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 px-2">
            Power cards will boost your character's attacks and HP during battle.
          </p>
        </div>

        {/* Player Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 mb-6 sm:mb-8">
          {renderPlayerSection(1)}
          {renderPlayerSection(2)}
        </div>

        {/* Battle Button */}
        <div className="text-center">
          <Button
            onClick={startBattle}
            disabled={!bothPlayersReady}
            className={`px-8 py-4 text-xl font-bold ${
              bothPlayersReady 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="h-6 w-6 mr-2" />
            {bothPlayersReady ? 'Start Battle!' : 'Select Cards to Continue'}
          </Button>
          {!bothPlayersReady && (
            <p className="text-gray-400 text-sm mt-2">
              Both players need to select a character card AND a power card
            </p>
          )}
        </div>
      </div>
    </div>
  );
};