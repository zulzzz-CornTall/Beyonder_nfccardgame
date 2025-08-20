import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NFCCard } from '@/types/game';
import { useFighting } from '@/lib/stores/useFighting';
import { getAttackColor, getAttackName } from '@/lib/gameLogic';
import { RefreshCw, Zap, Shield, Loader2 } from 'lucide-react';

interface NFCCardDisplayProps {
  card?: NFCCard;
  playerId: 1 | 2;
}

export const NFCCardDisplay: React.FC<NFCCardDisplayProps> = ({ card, playerId }) => {
  const { scanNFCCard, gamePhase } = useFighting();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Reset image loading state when card changes
  useEffect(() => {
    if (card?.imageUrl) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [card?.imageUrl]);

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
          {card.imageUrl && (
            <p className="text-xs text-blue-300 truncate mt-1" title={card.imageUrl}>
              🔗 Image: {card.imageUrl.length > 30 ? `${card.imageUrl.substring(0, 30)}...` : card.imageUrl}
            </p>
          )}
        </div>

        {/* Card Image */}
        <div className="w-32 h-32 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-600 relative">
          {card.imageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                </div>
              )}
              <img
                src={card.imageUrl}
                alt={`${card.name} character image`}
                className={`w-full h-full object-cover rounded transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => {
                  console.log(`Successfully loaded image for ${card.name}:`, card.imageUrl);
                  setImageLoading(false);
                  setImageError(false);
                }}
                onError={(e) => {
                  console.error(`Failed to load image for ${card.name}:`, card.imageUrl);
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            </>
          ) : (
            <div className="text-center">
              <div className="text-4xl text-yellow-400 mb-1">🎴</div>
              <div className="text-xs text-gray-400">
                {imageError ? 'Image failed' : 'No image'}
              </div>
            </div>
          )}
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