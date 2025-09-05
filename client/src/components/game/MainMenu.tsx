import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { Sword, Info, Settings, Zap, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/lib/stores/useAudio';
import { useLanguage } from '@/lib/stores/useLanguage';
import { LanguageSelector } from '@/components/game/LanguageSelector';

export const MainMenu: React.FC = () => {
  const { setGamePhase } = useFighting();
  const { t } = useLanguage();
  const { playClick, toggleMute, isMuted } = useAudio();

  const handleStartGame = () => {
    playClick();
    setGamePhase('preparation');
  };

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
            🔥 {t.mainTitle.split(' ')[0]} 🔥
          </CardTitle>
          <p className="text-gray-300 text-sm">
            {t.preparation}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={() => {
              playClick();
              setGamePhase('preparation');
            }}
            className="w-full h-12 font-semibold transition-all bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 hover:scale-105 text-white"
          >
            <Sword className="mr-2 h-5 w-5" />
            {t.startGame}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              playClick();
              setGamePhase('rules');
            }}
            className="w-full h-12 font-semibold border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:scale-105 transition-all"
          >
            <Info className="mr-2 h-5 w-5" />
            {t.howToPlay}
          </Button>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-center text-gray-500">
              Powered by NFC Card Technology ⚡
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Language Selector and Mute Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <LanguageSelector />
        <Button
          onClick={() => {
            playClick();
            toggleMute();
          }}
          variant="outline"
          size="icon"
          className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};