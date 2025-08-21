import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { Sword, Info, Settings, Zap } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startPreparation } = useFighting();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md bg-black/80 backdrop-blur-sm border-black/50">
        <CardHeader className="text-center pb-4 sm:pb-6">
          {/* Logo Display Section */}
          <div className="mx-auto mb-3 sm:mb-4">
            <div className="p-3 rounded-lg bg-black/20 border border-black/30">
              <img 
                src="/logo.png" 
                alt="BEYOND! Game Logo"
                className="w-full max-w-xs mx-auto h-auto"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            NFC Fighter
          </CardTitle>
          <p className="text-yellow-300 text-xs sm:text-sm mt-2">
            Roulette-Based Combat Arena
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <Button 
            onClick={startPreparation}
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-black font-semibold text-sm sm:text-base"
          >
            <Sword className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Start Battle
          </Button>
          
          <Button 
            onClick={() => useFighting.getState().setGamePhase('rules')}
            variant="outline"
            className="w-full h-10 sm:h-12 border-black/50 text-yellow-200 hover:bg-black/20 text-sm sm:text-base"
          >
            <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Game Rules
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-12 border-black/50 text-yellow-200 hover:bg-black/20"
            disabled
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
