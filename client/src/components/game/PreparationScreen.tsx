import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { NFCCardDisplay } from './NFCCardDisplay';
import { ArrowLeft, Play } from 'lucide-react';

export const PreparationScreen: React.FC = () => {
  const { battleState, setGamePhase, startCharacterSelection, startBattle } = useFighting();

  const bothPlayersHaveCharacterCards = battleState.players.every(p => 
    p.scannedCards.some(card => card.type === 'character')
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setGamePhase('menu')}
          variant="outline" 
          className="border-black/50 text-yellow-200 hover:bg-black/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Preparation Phase</h1>
          <p className="text-yellow-300 text-sm">
            Both players must scan their NFC cards before battle
          </p>
        </div>

        <Button 
          onClick={() => {
            if (bothPlayersHaveCharacterCards) {
              startCharacterSelection();
            }
          }}
          disabled={!bothPlayersHaveCharacterCards}
          className={`${
            bothPlayersHaveCharacterCards 
              ? 'bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-black' 
              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          Next: Character Selection
        </Button>
      </div>

      {/* Status indicator */}
      <div className="text-center mb-6">
        <div className={`p-4 rounded-lg border ${
          bothPlayersHaveCharacterCards 
            ? 'bg-black/30 border-red-500/50' 
            : 'bg-black/20 border-yellow-500/50'
        }`}>
          <p className={`text-lg font-semibold ${
            bothPlayersHaveCharacterCards ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {bothPlayersHaveCharacterCards 
              ? '✅ Both players have character cards - Click Next to select characters!' 
              : '⏳ Waiting for both players to scan at least one character card each'
            }
          </p>
        </div>
      </div>

      {/* Player cards setup area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {battleState.players.map((player) => (
          <Card key={player.id} className="bg-black/50 backdrop-blur-sm border-black/50">
            <CardContent className="p-6">
              {/* Player Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{player.name}</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  player.scannedCards.some(card => card.type === 'character')
                    ? 'bg-black/30 text-red-400 border border-red-500/50' 
                    : 'bg-black/20 text-yellow-400 border border-yellow-500/50'
                }`}>
                  {player.scannedCards.some(card => card.type === 'character') 
                    ? `✅ ${player.scannedCards.length} Cards (Character Ready)` 
                    : player.scannedCards.length > 0 
                      ? `⚠️ ${player.scannedCards.length} Cards (Need Character)` 
                      : '❌ No Cards'
                  }
                </div>
              </div>

              {/* Multiple Card Display */}
              <div className="space-y-4">
                {player.scannedCards.length > 0 ? (
                  <div className="grid gap-2">
                    {player.scannedCards.map((card, index) => (
                      <div key={card.id} className="border border-purple-400/50 rounded p-2">
                        <div className="text-center">
                          <h4 className="text-white font-medium">{card.name}</h4>
                          <p className="text-xs text-gray-400">Card {index + 1} - HP: {card.hp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-gray-600 rounded">
                    <p className="text-gray-400 mb-4">No Cards Scanned</p>
                  </div>
                )}

                {/* Scan button */}
                <NFCCardDisplay 
                  playerId={player.id}
                  scannedCardsCount={player.scannedCards.length}
                />
              </div>

              {/* Instructions */}
              {!player.scannedCards.some(card => card.type === 'character') && (
                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm text-center">
                    🔵 Scan at least one character card to proceed
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
            <h3 className="text-lg font-bold text-white mb-3">How to Prepare:</h3>
            <div className="space-y-2 text-purple-200">
              <p>1. Each player must scan at least one character card using the "Scan NFC Card" button</p>
              <p>2. You can scan up to 3 cards total (character and power cards)</p>
              <p>3. Once both players have character cards, proceed to character selection</p>
              <p>4. You'll choose which character to use in battle from your scanned cards</p>
              <p>5. Click the Start Battle button manually when both players are ready</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};