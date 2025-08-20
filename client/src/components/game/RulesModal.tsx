import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { ArrowLeft, Zap, Shield, Sword } from 'lucide-react';

export const RulesModal: React.FC = () => {
  const { setGamePhase } = useFighting();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <Button 
            onClick={() => setGamePhase('menu')}
            variant="outline" 
            size="sm"
            className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Back to Menu</span>
          </Button>
        </div>

        <Card className="bg-black/70 backdrop-blur-sm border-purple-500/30 mb-4">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Game Rules
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6 lg:space-y-8 text-white pb-6">
            {/* Basic Gameplay */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">📋 Basic Gameplay</h2>
              <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                <p>• NFC Fighter is a simultaneous combat game where both players act at the same time</p>
                <p>• Each round, both players secretly select an attack type</p>
                <p>• After selection, the winner is determined by rock-paper-scissors rules</p>
                <p>• The player with the superior attack type gets to deal damage</p>
                <p>• Combat continues until one player reaches 0 HP</p>
              </div>
            </section>

            {/* Attack Types */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">⚔️ Attack Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-red-900/30 rounded-lg border border-red-500/30">
                  <div className="flex items-center mb-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2" />
                    <span className="font-bold text-red-400 text-sm sm:text-base">BURST</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Explosive energy attack that overwhelms defensive techniques
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                  <div className="flex items-center mb-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
                    <span className="font-bold text-green-400 text-sm sm:text-base">GUTS</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Defensive power strike that counters swift attacks
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 bg-blue-900/30 rounded-lg border border-blue-500/30 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center mb-2">
                    <Sword className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2" />
                    <span className="font-bold text-blue-400 text-sm sm:text-base">SLASH</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Swift cutting attack that pierces through energy barriers
                  </p>
                </div>
              </div>
            </section>

            {/* Type Effectiveness */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">🔄 Type Effectiveness</h2>
              <div className="bg-gray-900/50 p-3 sm:p-4 lg:p-6 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-blue-400 font-bold text-sm sm:text-base">SLASH</div>
                    <div className="text-gray-400 text-xs sm:text-sm">defeats</div>
                    <div className="text-red-400 font-bold text-sm sm:text-base">BURST</div>
                    <div className="text-green-400 text-xs sm:text-sm">2x Damage!</div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-red-400 font-bold text-sm sm:text-base">BURST</div>
                    <div className="text-gray-400 text-xs sm:text-sm">defeats</div>
                    <div className="text-green-400 font-bold text-sm sm:text-base">GUTS</div>
                    <div className="text-green-400 text-xs sm:text-sm">2x Damage!</div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-green-400 font-bold text-sm sm:text-base">GUTS</div>
                    <div className="text-gray-400 text-xs sm:text-sm">defeats</div>
                    <div className="text-blue-400 font-bold text-sm sm:text-base">SLASH</div>
                    <div className="text-green-400 text-xs sm:text-sm">2x Damage!</div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-300 text-xs sm:text-sm text-center">
                    💡 <strong>Strategy Tip:</strong> Try to predict your opponent's attack choice and counter it for maximum damage!
                  </p>
                </div>
              </div>
            </section>

            {/* Rock-Paper-Scissors System */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">✂️ Rock-Paper-Scissors System</h2>
              <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                <p>• After both players select attacks, they play Rock-Paper-Scissors to determine who becomes the attacker</p>
                <p>• Rock beats Scissors, Paper beats Rock, Scissors beats Paper</p>
                <p>• The RPS winner becomes the attacker and deals damage using their selected attack type</p>
                <p>• If both players choose the same RPS option, the attacker is determined randomly</p>
                <p>• Attack types (Burst/Guts/Slash) still determine damage effectiveness, but RPS determines who attacks!</p>
              </div>
            </section>

            {/* Victory Conditions */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">🏆 Victory Conditions</h2>
              <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                <p>• Each player starts with 100 HP</p>
                <p>• Base attack damage is 25 HP</p>
                <p>• Super effective attacks deal 50 HP damage (2x multiplier)</p>
                <p>• First player to reach 0 HP loses the match</p>
                <p>• Matches typically last 2-4 rounds</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
