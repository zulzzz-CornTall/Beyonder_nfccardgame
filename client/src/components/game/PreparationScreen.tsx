import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { NFCCardDisplay } from './NFCCardDisplay';
import { ArrowLeft, Play } from 'lucide-react';

export const PreparationScreen: React.FC = () => {
  const { battleState, setGamePhase, startCharacterSelection, startBattle } = useFighting();

  const bothPlayersHaveCards = battleState.players.every(p => p.scannedCards.length > 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setGamePhase('menu')}
          variant="outline" 
          className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Preparation Phase</h1>
          <p className="text-purple-300 text-sm">
            Both players must scan their NFC cards before battle
          </p>
        </div>

        <Button 
          onClick={() => {
            startBattle();
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Battle
        </Button>
      </div>

      {/* Status indicator */}
      <div className="text-center mb-6">
        <div className={`p-4 rounded-lg border ${
          bothPlayersHaveCards 
            ? 'bg-green-900/30 border-green-500/30' 
            : 'bg-yellow-900/30 border-yellow-500/30'
        }`}>
          <p className={`text-lg font-semibold ${
            bothPlayersHaveCards ? 'text-green-300' : 'text-yellow-300'
          }`}>
            {bothPlayersHaveCards 
              ? '✅ Both players ready - Click Start Battle!' 
              : '⏳ Waiting for both players to scan their NFC cards (up to 3 each)'
            }
          </p>
        </div>
      </div>

      {/* Player cards setup area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {battleState.players.map((player) => (
          <Card key={player.id} className="bg-black/50 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              {/* Player Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{player.name}</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  player.scannedCards.length > 0 
                    ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                    : 'bg-red-900/30 text-red-300 border border-red-500/30'
                }`}>
                  {player.scannedCards.length > 0 ? `✅ ${player.scannedCards.length} Cards Scanned` : '❌ No Cards'}
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
              {player.scannedCards.length === 0 && (
                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm text-center">
                    🔵 Scan your NFC cards and click Start Battle when ready
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
              <p>1. Each player can scan up to 3 NFC cards using the "Scan NFC Card" button</p>
              <p>2. Once both players have at least 1 card, the "Start Battle" button will become active</p>
              <p>3. You'll then select which character you want to use in battle</p>
              <p>4. Each card contains HP, Burst (B), Guts (G), and Slash (S) attack values</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};