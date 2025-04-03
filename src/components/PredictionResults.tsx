import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Prediction {
  label: string;
  score: number;
}

interface PredictionResultsProps {
  predictions: Prediction[];
  isLoading: boolean;
  className?: string;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ 
  predictions,
  isLoading,
  className
}) => {
  // Format the label to be more readable
  const formatLabel = (label: string) => {
    // Remove any text after comma (like 'tiger, Panthera tigris' -> 'tiger')
    const cleanedLabel = label.split(',')[0];
    
    // Capitalize first letter of each word
    return cleanedLabel
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className={cn("p-4", className)}>
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Analizando imagen</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded mb-1 w-1/3"></div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!predictions.length) {
    return null;
  }

  return (
    <div className={cn("p-4", className)}>
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Resultados</h3>
      <div className="space-y-3">
        {predictions.slice(0, 5).map((prediction, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-800 dark:text-slate-200">{formatLabel(prediction.label)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {(prediction.score * 100).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={prediction.score * 100} 
              className="h-1 bg-slate-100 dark:bg-slate-800"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionResults;
