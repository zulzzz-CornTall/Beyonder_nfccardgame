import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { useAudio } from '@/lib/stores/useAudio';
import { useLanguage } from '@/lib/stores/useLanguage';
import { parseAztecCode, scanAztecFromCamera, uploadImageForAztecScan } from '@/lib/aztec';
import { ArrowLeft, Camera, Upload, Loader2 } from 'lucide-react';
import { AIOpponent } from '@/types/game';

export const CharacterBattleScreen: React.FC = () => {
  const { setGamePhase, startPreparation, setAIOpponent } = useFighting();
  const { playClick } = useAudio();
  const { t } = useLanguage();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scannedOpponent, setScannedOpponent] = useState<AIOpponent | null>(null);
  const [error, setError] = useState<string>('');

  const handleCameraScan = async () => {
    setIsScanning(true);
    setError('');
    
    try {
      const aztecData = await scanAztecFromCamera();
      if (aztecData) {
        const opponent = parseAztecCode(aztecData);
        if (opponent) {
          setScannedOpponent(opponent);
          playClick();
        } else {
          setError('Failed to parse AZTEC code data');
        }
      } else {
        setError('No AZTEC code detected');
      }
    } catch (error) {
      setError('Camera scanning failed');
      console.error('Camera scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError('');
    
    try {
      const aztecData = await uploadImageForAztecScan(file);
      if (aztecData) {
        const opponent = parseAztecCode(aztecData);
        if (opponent) {
          setScannedOpponent(opponent);
          playClick();
        } else {
          setError('Failed to parse AZTEC code data');
        }
      } else {
        setError('No AZTEC code found in image');
      }
    } catch (error) {
      setError('Image processing failed');
      console.error('Image upload error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const startBattleWithOpponent = () => {
    if (scannedOpponent) {
      playClick();
      setAIOpponent(scannedOpponent);
      startPreparation('character-battle');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-teal-800 to-emerald-700 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-black/80 border-emerald-500/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => {
                playClick();
                setGamePhase('menu');
              }}
              variant="outline"
              size="sm"
              className="border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                🎴 Character Battle
              </CardTitle>
            </div>
            
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
          
          <p className="text-gray-300 text-sm">
            Scan an AZTEC code to battle against a character opponent
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!scannedOpponent ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center mb-4">
                Scan AZTEC Code
              </h3>
              
              {/* Camera Scan Button */}
              <Button
                onClick={handleCameraScan}
                disabled={isScanning}
                className="w-full h-16 font-semibold transition-all bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:scale-105 text-white"
              >
                {isScanning ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-6 w-6" />
                )}
                {isScanning ? 'Scanning...' : 'Scan with Camera'}
              </Button>
              
              {/* Upload Image Button */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isScanning}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  disabled={isScanning}
                  className="w-full h-16 font-semibold transition-all bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 hover:scale-105 text-white"
                >
                  {isScanning ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-6 w-6" />
                  )}
                  {isScanning ? 'Processing...' : 'Upload Image'}
                </Button>
              </div>
              
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white text-center">
                Opponent Scanned Successfully!
              </h3>
              
              {/* Opponent Preview */}
              <Card className="bg-emerald-900/30 border-emerald-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Opponent Image */}
                    <div className="w-20 h-20 rounded-lg border-2 border-emerald-400 overflow-hidden bg-gray-800">
                      <img
                        src={scannedOpponent.imageUrl}
                        alt={scannedOpponent.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/textures/sand.jpg';
                        }}
                      />
                    </div>
                    
                    {/* Opponent Info */}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {scannedOpponent.name}
                      </h4>
                      <div className="text-sm text-emerald-300">
                        <p>Character: {scannedOpponent.character.name}</p>
                        <p>HP: {scannedOpponent.character.hp}</p>
                        <p className="text-emerald-200 italic">
                          "{scannedOpponent.dialogues.intro}"
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Start Battle Button */}
              <Button
                onClick={startBattleWithOpponent}
                className="w-full h-16 font-semibold transition-all bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-105 text-white text-lg"
              >
                ⚔️ START CHARACTER BATTLE
              </Button>
              
              {/* Scan Another Button */}
              <Button
                onClick={() => {
                  setScannedOpponent(null);
                  setError('');
                }}
                variant="outline"
                className="w-full h-12 font-semibold border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:scale-105 transition-all"
              >
                Scan Different Opponent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};