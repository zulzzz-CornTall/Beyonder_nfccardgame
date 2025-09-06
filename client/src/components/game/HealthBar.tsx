
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface HealthBarProps {
  health?: number;
  maxHealth?: number;
  current?: number;
  max?: number;
  compact?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({ 
  health, 
  maxHealth, 
  current, 
  max, 
  compact = false 
}) => {
  // Support both prop naming conventions
  const currentHealth = health ?? current ?? 0;
  const maxHealthValue = maxHealth ?? max ?? 100;
  const healthPercentage = (currentHealth / maxHealthValue) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-medium text-white whitespace-nowrap">HP</span>
        <div className="flex-1 min-w-[60px]">
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${getHealthColor()}`}
              style={{ width: `${Math.max(0, healthPercentage)}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-bold text-white whitespace-nowrap">
          {currentHealth}/{maxHealthValue}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">HP</span>
        <span className="text-sm font-bold text-white">
          {currentHealth}/{maxHealthValue}
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={healthPercentage} 
          className="h-3 bg-gray-700"
        />
        <div 
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getHealthColor()}`}
          style={{ width: `${Math.max(0, healthPercentage)}%` }}
        />
      </div>
      
      {currentHealth <= 0 && (
        <div className="text-center">
          <span className="text-red-400 font-bold text-sm animate-pulse">
            DEFEATED
          </span>
        </div>
      )}
    </div>
  );
};
