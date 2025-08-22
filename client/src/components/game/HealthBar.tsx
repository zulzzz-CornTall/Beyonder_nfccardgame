import React from 'react';
import { Progress } from '@/components/ui/progress';

interface HealthBarProps {
  health: number;
  maxHealth: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ health, maxHealth }) => {
  const healthPercentage = (health / maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">HP</span>
        <span className="text-sm font-bold text-white">
          {health}/{maxHealth}
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={healthPercentage} 
          className="h-3 bg-gray-700"
        />
        <div 
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getHealthColor()}`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      {health <= 0 && (
        <div className="text-center">
          <span className="text-red-400 font-bold text-sm animate-pulse">
            DEFEATED
          </span>
        </div>
      )}
    </div>
  );
};
