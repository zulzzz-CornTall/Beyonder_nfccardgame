import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { useLanguage } from '@/lib/stores/useLanguage';
import { useAudio } from '@/lib/stores/useAudio';
import { NFCCardDisplay } from './NFCCardDisplay';
import { ArrowLeft, Play } from 'lucide-react';

export const PreparationScreen: React.FC = () => {
  const { battleState, setGamePhase, startCharacterSelection, startBattle } = useFighting();
  const { t } = useLanguage();
  const { playClick } = useAudio();

  const bothPlayersHaveCharacterCards = battleState.players.every(p => 
    p.scannedCards.some(card => card.type === 'character')
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 p-2 sm:p-4">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <Button 
          onClick={() => {
            playClick();
            setGamePhase('menu');
          }}
          variant="outline" 
          className="border-black/50 text-yellow-200 hover:bg-black/20 order-1 sm:order-1"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToMenu}
        </Button>

        <div className="text-center order-2 sm:order-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t.preparationPhase}</h1>
          <p className="text-yellow-300 text-xs sm:text-sm">
            {t.bothPlayersMustScan}
          </p>
        </div>

        <Button 
          onClick={() => {
            if (bothPlayersHaveCharacterCards) {
              playClick();
              startBattle();
            }
          }}
          disabled={!bothPlayersHaveCharacterCards}
          className={`order-3 sm:order-3 ${
            bothPlayersHaveCharacterCards 
              ? 'bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-black' 
              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t.clickStartBattle}</span>
          <span className="sm:hidden">{t.battle}</span>
        </Button>
      </div>

      {/* Status indicator */}
      <div className="text-center mb-4 sm:mb-6">
        <div className={`p-3 sm:p-4 rounded-lg border ${
          bothPlayersHaveCharacterCards 
            ? 'bg-black/30 border-red-500/50' 
            : 'bg-black/20 border-yellow-500/50'
        }`}>
          <p className={`text-sm sm:text-lg font-semibold ${
            bothPlayersHaveCharacterCards ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {bothPlayersHaveCharacterCards 
              ? `⚔️ ${t.bothPlayersReady}` 
              : `⏳ ${t.waitingForPlayers}`
            }
          </p>
        </div>
      </div>

      {/* Player cards setup area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
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
                    ? `✅ ${player.scannedCards.length} ${t.cardsReady}` 
                    : player.scannedCards.length > 0 
                      ? `⚠️ ${player.scannedCards.length} ${t.needCharacter}` 
                      : `❌ ${t.noCards}`
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
                    <p className="text-gray-400 mb-4">{t.noCardsScanned}</p>
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
                    🔵 {t.eachPlayerMustScan}
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
            <h3 className="text-lg font-bold text-white mb-3">{t.howToPrepare}</h3>
            <div className="space-y-2 text-purple-200">
              <p>1. {t.eachPlayerMustScan}</p>
              <p>2. {t.youCanScanUpTo}</p>
              <p>3. {t.onceBothPlayersHave}</p>
              <p>4. {t.yourFirstScanned}</p>
              <p>5. {t.battleWillBegin}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};