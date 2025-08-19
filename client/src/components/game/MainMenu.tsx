import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { Sword, Info, Settings, Zap } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { setGamePhase } = useFighting();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/70 backdrop-blur-sm border-purple-500/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <Zap className="h-8 w-8 text-black" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            NFC Fighter
          </CardTitle>
          <p className="text-gray-300 text-sm mt-2">
            Roulette-Based Combat Arena
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setGamePhase('battle')}
            className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
          >
            <Sword className="h-5 w-5 mr-2" />
            Battle Test
          </Button>
          
          <Button 
            onClick={() => setGamePhase('rules')}
            variant="outline"
            className="w-full h-12 border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
          >
            <Info className="h-5 w-5 mr-2" />
            Game Rules
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-12 border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
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
