import React from 'react';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { useLanguage } from '@/lib/stores/useLanguage';
import { RefreshCw } from 'lucide-react';

interface NFCCardDisplayProps {
  playerId: 1 | 2;
  scannedCardsCount: number;
}

export const NFCCardDisplay: React.FC<NFCCardDisplayProps> = ({ playerId, scannedCardsCount }) => {
  const { scanNFCCard, gamePhase } = useFighting();
  const { t } = useLanguage();

  // Disable scanning during battle or when max cards reached
  const canScan = gamePhase !== 'battle' && scannedCardsCount < 3;

  return (
    <div className="text-center p-4">
      <p className="text-gray-400 mb-4">
        {scannedCardsCount === 0 && t.noCardsScanned}
        {scannedCardsCount > 0 && scannedCardsCount < 3 && `${scannedCardsCount}/3 ${t.cardsScanned}`}
        {scannedCardsCount === 3 && `3/3 ${t.maximumReached}`}
      </p>
      <Button
        onClick={async () => {
          if (!canScan) {
            if (gamePhase === 'battle') {
              alert(t.cannotScanDuringBattle);
            } else if (scannedCardsCount >= 3) {
              alert(t.maxCardsReached);
            }
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
        {scannedCardsCount === 0 ? t.scanFirstCard : scannedCardsCount < 3 ? t.scanAnotherCard : t.maxCardsReached}
      </Button>
    </div>
  );
};