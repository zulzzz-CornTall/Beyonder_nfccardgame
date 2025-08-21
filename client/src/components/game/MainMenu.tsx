import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { Sword, Info, Settings, Zap } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startPreparation, setGamePhase } = useFighting();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-md bg-black/80 border-yellow-500/50">
        <CardHeader className="text-center space-y-4">
          {/* Logo Image */}
          <div className="flex justify-center mb-4">
            <img 
              src="/title-logo.png" 
              alt="Game Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-lg"
              onError={(e) => {
                console.log('Logo failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            🔥 BATTLE ARENA 🔥
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Choose your warrior and enter the ultimate combat challenge!
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button 
            onClick={startPreparation}
            className="w-full h-12 font-semibold transition-all bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 hover:scale-105 text-white"
          >
            <Sword className="mr-2 h-5 w-5" />
            Start Battle
          </Button>

          <Button 
            variant="outline"
            onClick={() => setGamePhase('rules')}
            className="w-full h-12 font-semibold border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:scale-105 transition-all"
          >
            <Info className="mr-2 h-5 w-5" />
            Game Rules
          </Button>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-center text-gray-500">
              Powered by NFC Card Technology ⚡
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};