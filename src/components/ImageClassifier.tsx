import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ImageUploader from './ImageUploader';
import PredictionResults from './PredictionResults';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import { imageClassifierService } from '@/services/imageClassifierService';

interface Prediction {
  label: string;
  score: number;
}

const ImageClassifier: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string>('');
  const [showAbout, setShowAbout] = useState(false);

  const loadModel = async () => {
    setIsModelLoading(true);
    setModelLoadError(false);
    try {
      await imageClassifierService.getClassifier();
      setModelName(imageClassifierService.getModelName());
      setIsModelLoading(false);
      toast.success(`Modelo cargado correctamente`);
    } catch (error) {
      console.error('Error loading model:', error);
      setIsModelLoading(false);
      setModelLoadError(true);
      toast.error('Error al cargar el modelo. Inténtalo de nuevo.');
    }
  };

  // Initialize model on component mount
  useEffect(() => {
    loadModel();
  }, []);

  const handleImageSelected = async (file: File) => {
    try {
      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setCurrentImageUrl(imageUrl);
      setPredictions([]);
      setIsAnalyzing(true);

      // If model isn't loaded, try loading it again
      if (modelLoadError) {
        await loadModel();
      }
      const results = await imageClassifierService.classifyImage(file);
      setPredictions(results);
      toast.success('Análisis completado');
    } catch (error) {
      toast.error('Error al analizar la imagen');
      console.error('Error classifying image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto">
        <div className="flex justify-between mb-3">
          <ThemeToggle className="h-8 w-8 rounded-full" />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowAbout(!showAbout)}
                  className="h-8 w-8 rounded-full"
                >
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Acerca de</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showAbout ? (
          <Card className="mb-6 border border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 pt-4 text-sm">
              <h2 className="text-lg font-medium mb-3">Acerca del clasificador</h2>
              <p className="mb-3 text-slate-600 dark:text-slate-400">
                Esta aplicación utiliza un modelo de IA pre-entrenado ({modelName || 'ViT'}) para clasificar imágenes en diferentes categorías.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                El procesamiento se realiza en el navegador, por lo que el primer análisis puede tardar mientras se carga el modelo.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden">
            <CardContent className="p-0">
              {modelLoadError ? (
                <div className="text-center py-8 px-4">
                  <p className="text-red-500 mb-4">Error al cargar el modelo de IA</p>
                  <Button variant="outline" onClick={loadModel} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reintentar
                  </Button>
                </div>
              ) : (
                <ImageUploader onImageSelected={handleImageSelected} />
              )}
              {isModelLoading && (
                <div className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400 animate-pulse">
                  Cargando modelo de IA...
                </div>
              )}
            </CardContent>
          </Card>

          {(predictions.length > 0 || isAnalyzing) && (
            <Card className="border border-slate-200 dark:border-slate-800">
              <PredictionResults predictions={predictions} isLoading={isAnalyzing} />
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImageClassifier;