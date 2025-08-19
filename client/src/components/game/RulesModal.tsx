import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFighting } from '@/lib/stores/useFighting';
import { ArrowLeft, Zap, Shield, Sword } from 'lucide-react';

export const RulesModal: React.FC = () => {
  const { setGamePhase } = useFighting();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            onClick={() => setGamePhase('menu')}
            variant="outline" 
            className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
        </div>

        <Card className="bg-black/70 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Game Rules
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 text-white">
            {/* Basic Gameplay */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">📋 Basic Gameplay</h2>
              <div className="space-y-3 text-gray-300">
                <p>• NFC Fighter is a simultaneous combat game where both players act at the same time</p>
                <p>• Each round, both players secretly select an attack type</p>
                <p>• After selection, the winner is determined by rock-paper-scissors rules</p>
                <p>• The player with the superior attack type gets to deal damage</p>
                <p>• Combat continues until one player reaches 0 HP</p>
              </div>
            </section>

            {/* Attack Types */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">⚔️ Attack Types</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/30">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-red-400 mr-2" />
                    <span className="font-bold text-red-400">BURST</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Explosive energy attack that overwhelms defensive techniques
                  </p>
                </div>
                
                <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-green-400 mr-2" />
                    <span className="font-bold text-green-400">GUTS</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Defensive power strike that counters swift attacks
                  </p>
                </div>
                
                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <div className="flex items-center mb-2">
                    <Sword className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="font-bold text-blue-400">SLASH</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Swift cutting attack that pierces through energy barriers
                  </p>
                </div>
              </div>
            </section>

            {/* Type Effectiveness */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🔄 Type Effectiveness</h2>
              <div className="bg-gray-900/50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-blue-400 font-bold">SLASH</div>
                    <div className="text-gray-400">defeats</div>
                    <div className="text-red-400 font-bold">BURST</div>
                    <div className="text-green-400 text-sm">2x Damage!</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-red-400 font-bold">BURST</div>
                    <div className="text-gray-400">defeats</div>
                    <div className="text-green-400 font-bold">GUTS</div>
                    <div className="text-green-400 text-sm">2x Damage!</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-green-400 font-bold">GUTS</div>
                    <div className="text-gray-400">defeats</div>
                    <div className="text-blue-400 font-bold">SLASH</div>
                    <div className="text-green-400 text-sm">2x Damage!</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-300 text-sm text-center">
                    💡 <strong>Strategy Tip:</strong> Try to predict your opponent's attack choice and counter it for maximum damage!
                  </p>
                </div>
              </div>
            </section>

            {/* Rock-Paper-Scissors System */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">✂️ Rock-Paper-Scissors System</h2>
              <div className="space-y-3 text-gray-300">
                <p>• After both players select attacks, the winner is determined by attack type effectiveness</p>
                <p>• Each attack type beats one other type: Slash beats Burst, Burst beats Guts, Guts beats Slash</p>
                <p>• The player with the superior attack type wins the round and deals damage</p>
                <p>• If both players choose the same attack type, the winner is determined randomly</p>
                <p>• Strategy is key - try to predict your opponent's choice!</p>
              </div>
            </section>

            {/* Victory Conditions */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🏆 Victory Conditions</h2>
              <div className="space-y-3 text-gray-300">
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
