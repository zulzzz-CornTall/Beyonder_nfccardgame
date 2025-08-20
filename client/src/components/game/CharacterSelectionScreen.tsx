import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { NFCCard } from '@/types/game';
import { getAttackColor, getAttackName } from '@/lib/gameLogic';
import { ArrowLeft, Play, Shield } from 'lucide-react';

export const CharacterSelectionScreen: React.FC = () => {
  const { battleState, setGamePhase, startBattle, selectCharacter } = useFighting();
  
  const bothPlayersSelectedCharacters = battleState.players.every(p => p.selectedCard);

  const renderCard = (card: NFCCard, index: number, playerId: 1 | 2, isSelected: boolean) => {
    const elementColor = getAttackColor(card.element);
    
    return (
      <div 
        key={card.id}
        className={`cursor-pointer transform transition-all duration-200 hover:scale-105 ${
          isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''
        }`}
        onClick={() => selectCharacter(playerId, index)}
      >
        <Card className={`${elementColor} bg-opacity-20 border-2 border-current ${
          isSelected ? 'border-yellow-400' : ''
        }`}>
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white text-lg">{card.name}</h3>
              <p className="text-xs text-gray-300">Card {index + 1}</p>
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
                <span className="text-white font-bold">{card.hp}</span>
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
                <span className="text-white text-xs">{getAttackName(card.element)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setGamePhase('preparation')}
          variant="outline" 
          className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Preparation
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Character Selection</h1>
          <p className="text-purple-300 text-sm">
            Each player must choose their character for battle
          </p>
        </div>
        
        <Button 
          onClick={startBattle}
          disabled={!bothPlayersSelectedCharacters}
          className={`${
            bothPlayersSelectedCharacters 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          Start Battle
        </Button>
      </div>

      {/* Status indicator */}
      <div className="text-center mb-6">
        <div className={`p-4 rounded-lg border ${
          bothPlayersSelectedCharacters 
            ? 'bg-green-900/30 border-green-500/30' 
            : 'bg-yellow-900/30 border-yellow-500/30'
        }`}>
          <p className={`text-lg font-semibold ${
            bothPlayersSelectedCharacters ? 'text-green-300' : 'text-yellow-300'
          }`}>
            {bothPlayersSelectedCharacters 
              ? '✅ Both players ready - Click Start Battle!' 
              : '⏳ Waiting for both players to select their characters'
            }
          </p>
        </div>
      </div>

      {/* Player character selection areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {battleState.players.map((player) => (
          <Card key={player.id} className="bg-black/50 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              {/* Player Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{player.name}</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  player.selectedCard 
                    ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                    : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {player.selectedCard ? '✅ Character Selected' : '🔄 Choose Character'}
                </div>
              </div>

              {/* Character Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {player.scannedCards.map((card, index) => 
                  renderCard(card, index, player.id, player.selectedCard?.id === card.id)
                )}
              </div>

              {/* Instructions */}
              {!player.selectedCard && (
                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm text-center">
                    🔵 Click on a card above to select your character for battle
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 max-w-4xl mx-auto">
        <Card className="bg-black/30 border-purple-500/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-3">Character Selection:</h3>
            <div className="space-y-2 text-purple-200">
              <p>1. Each player must choose one character from their scanned cards</p>
              <p>2. Your character's HP will become your health in battle</p>
              <p>3. Consider the attack values (Burst, Guts, Slash) when choosing</p>
              <p>4. Once both players select, the battle will begin!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};