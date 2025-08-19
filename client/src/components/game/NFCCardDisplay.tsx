import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const { scanNFCCard } = useFighting();

  if (!card) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-400 mb-4">No NFC Card Detected</p>
        <Button 
          onClick={() => scanNFCCard(playerId)}
          variant="outline"
          className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
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

        {/* Card Image Placeholder */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              Attack
            </span>
            <span className="text-white font-bold">{card.attack}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Defense
            </span>
            <span className="text-white font-bold">{card.defense}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Element</span>
            <span className="text-white font-bold">{getAttackName(card.element)}</span>
          </div>
        </div>

        {/* Rescan Button */}
        <Button 
          onClick={() => scanNFCCard(playerId)}
          variant="outline"
          size="sm"
          className="w-full mt-4 border-white/30 text-white hover:bg-white/10"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Rescan Card
        </Button>
      </CardContent>
    </Card>
  );
};
