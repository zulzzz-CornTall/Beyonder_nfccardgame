import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFighting } from '@/lib/stores/useFighting';
import { useAudio } from '@/lib/stores/useAudio';

interface DialogueDisplayProps {
  type: 'intro' | 'battle1' | 'battle2' | 'win' | 'lose';
  onComplete?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const DialogueDisplay: React.FC<DialogueDisplayProps> = ({
  type,
  onComplete,
  autoHide = true,
  duration = 3000
}) => {
  const { battleState, showDialogue, aiOpponent } = useFighting();
  const { playClick } = useAudio();
  const [isVisible, setIsVisible] = useState(true);
  
  const dialogue = showDialogue(type);
  const opponent = battleState.players.find(p => p.aiOpponent)?.aiOpponent || aiOpponent;
  
  useEffect(() => {
    if (autoHide && dialogue) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [dialogue, autoHide, duration, onComplete]);
  
  if (!dialogue || !opponent || !isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <Card 
        className="max-w-2xl w-full bg-black/95 border-2 border-emerald-500/70 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-500"
        onClick={() => {
          playClick();
          setIsVisible(false);
          onComplete?.();
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Character Image */}
            <div className="w-16 h-16 rounded-full border-2 border-emerald-400 overflow-hidden bg-gray-800 flex-shrink-0">
              <img
                src={opponent.imageUrl}
                alt={opponent.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/textures/sand.jpg';
                }}
              />
            </div>
            
            {/* Dialogue Content */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h4 className="text-lg font-bold text-emerald-400">
                  {opponent.name}
                </h4>
                <div className="ml-auto text-xs text-gray-500">
                  Click to dismiss
                </div>
              </div>
              
              <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/30">
                <p className="text-white text-lg font-medium leading-relaxed">
                  "{dialogue}"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};