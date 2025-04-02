
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

  // Get a color based on score - from green (high) to red (low)
  const getColorClass = (score: number) => {
    if (score > 0.7) return 'bg-green-500';
    if (score > 0.4) return 'bg-blue-500';
    if (score > 0.2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className={cn("p-6", className)}>
        <h3 className="text-lg font-medium mb-4">Analizando imagen...</h3>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-3 animate-pulse">
            <div className="h-5 bg-muted rounded mb-1 w-1/3"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!predictions.length) {
    return null;
  }

  return (
    <div className={cn("p-6", className)}>
      <h3 className="text-lg font-medium mb-4">Resultados de la predicción</h3>
      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{formatLabel(prediction.label)}</span>
              <span className="text-sm font-mono">
                {(prediction.score * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={prediction.score * 100} 
              className={cn("h-2", getColorClass(prediction.score))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionResults;
