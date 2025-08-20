import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NFCCard } from '@/types/game';
import { useFighting } from '@/lib/stores/useFighting';
import { getAttackColor, getAttackName } from '@/lib/gameLogic';
import { RefreshCw, Zap, Shield } from 'lucide-react';

interface NFCCardDisplayProps {
  card?: NFCCard;
  playerId: 1 | 2;
}

export const NFCCardDisplay: React.FC<NFCCardDisplayProps> = ({ card, playerId }) => {
  const { scanNFCCard, gamePhase } = useFighting();

  // Debug logging
  console.log(`NFCCardDisplay for Player ${playerId}:`, card);

  // Disable scanning during battle
  const canScan = gamePhase !== 'battle';

  if (!card) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-400 mb-4">No NFC Card Detected</p>
        <Button
          onClick={async () => {
            if (!canScan) {
              alert('Cannot scan cards during battle! Please wait until the battle ends.');
              return;
            }
            try {
              console.log(`Starting NFC scan for Player ${playerId}`);
              await scanNFCCard(playerId);
              console.log(`NFC scan completed for Player ${playerId}`);
            } catch (error) {
              console.error(`NFC scan error for Player ${playerId}:`, error);
            }
          }}
          disabled={!canScan}
          variant="outline"
          className={`${canScan
            ? 'border-purple-500/50 text-purple-200 hover:bg-purple-500/10'
            : 'border-gray-500/30 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Scan NFC Card
        </Button>
      </div>
    );
  }

  const elementColor = getAttackColor(card.element);

  return (
    <Card className={`${elementColor} bg-opacity-20 border-2 border-current`}>
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <h3 className="font-bold text-white text-lg">{card.name}</h3>
          <p className="text-xs text-gray-300">NFC Card #{card.id.slice(-6)}</p>
        </div>

        {/* Card Image */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.setAttribute('style', 'display: block');
              }}
            />
          ) : null}
          <span className="text-2xl" style={{ display: card.imageUrl ? 'none' : 'block' }}>⚡</span>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              HP
            </span>
            <span className="text-white font-bold">{card.hp}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">B (Burst)</span>
            <span className="text-red-400 font-bold">{card.burst}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">G (Guts)</span>
            <span className="text-green-400 font-bold">{card.guts}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">S (Slash)</span>
            <span className="text-blue-400 font-bold">{card.slash}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Element</span>
            <span className="text-white font-bold">{getAttackName(card.element)}</span>
          </div>
        </div>

        {/* Rescan Button */}
        <Button
          onClick={async () => {
            if (!canScan) {
              alert('Cannot scan cards during battle! Please wait until the battle ends.');
              return;
            }
            try {
              console.log(`Starting NFC rescan for Player ${playerId}`);
              await scanNFCCard(playerId);
              console.log(`NFC rescan completed for Player ${playerId}`);
            } catch (error) {
              console.error(`NFC rescan error for Player ${playerId}:`, error);
            }
          }}
          disabled={!canScan}
          variant="outline"
          size="sm"
          className={`w-full mt-4 ${canScan
            ? 'border-white/30 text-white hover:bg-white/10'
            : 'border-gray-500/30 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Rescan Card
        </Button>
      </CardContent>
    </Card>
  );
};