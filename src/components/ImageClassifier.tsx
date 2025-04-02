import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon, BrainIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUploader from './ImageUploader';
import PredictionResults from './PredictionResults';
import RecentImages from './RecentImages';
import { imageClassifierService } from '@/services/imageClassifierService';
interface Prediction {
  label: string;
  score: number;
}
interface ImageInfo {
  id: string;
  url: string;
  topPrediction: string;
  timestamp: number;
}
const MAX_RECENT_IMAGES = 10;
const ImageClassifier: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [recentImages, setRecentImages] = useState<ImageInfo[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string>('');
  const loadModel = async () => {
    setIsModelLoading(true);
    setModelLoadError(false);
    try {
      await imageClassifierService.getClassifier();
      setModelName(imageClassifierService.getModelName());
      setIsModelLoading(false);
      toast.success(`Modelo cargado: ${imageClassifierService.getModelName()}`);
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

      // Add to recent images
      const newImageInfo: ImageInfo = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        topPrediction: results[0]?.label || 'Unknown',
        timestamp: Date.now()
      };
      setRecentImages(prev => {
        const updatedImages = [newImageInfo, ...prev].slice(0, MAX_RECENT_IMAGES);
        return updatedImages;
      });
      toast.success('¡Análisis completado!');
    } catch (error) {
      toast.error('Error al analizar la imagen. Inténtalo de nuevo.');
      console.error('Error classifying image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleSelectRecentImage = (url: string) => {
    const imageInfo = recentImages.find(img => img.url === url);
    if (!imageInfo) return;

    // Fetch image as blob and convert to file for classification
    fetch(url).then(res => res.blob()).then(blob => {
      const file = new File([blob], 'image.jpg', {
        type: 'image/jpeg'
      });
      handleImageSelected(file);
    }).catch(err => {
      console.error('Error loading image:', err);
      toast.error('Error al cargar la imagen.');
    });
  };
  return <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="classifier" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="classifier" className="flex items-center gap-2">
            <BrainIcon className="h-4 w-4" />
            <span>Clasificador</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            <span>Acerca de</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classifier">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Subir imagen</h3>
                {modelLoadError ? <div className="text-center py-4">
                    <p className="text-destructive mb-4">Error al cargar el modelo de IA</p>
                    <Button variant="outline" onClick={loadModel} className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reintentar cargar modelo
                    </Button>
                  </div> : <ImageUploader onImageSelected={handleImageSelected} />}
                {isModelLoading && <div className="mt-4 text-center text-sm text-muted-foreground animate-pulse-light">
                    Cargando modelo de IA... esto puede tomar un momento
                  </div>}
                {modelName && !isModelLoading && !modelLoadError && <div className="mt-4 text-center text-xs text-muted-foreground">
                    Modelo: {modelName}
                  </div>}
              </CardContent>
            </Card>

            <Card>
              <PredictionResults predictions={predictions} isLoading={isAnalyzing} />
            </Card>
          </div>

          {recentImages.length > 0 && <Card className="mt-6">
              
            </Card>}
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Clasificador de Imágenes con IA</h2>
              <p className="mb-4">Esta aplicación utiliza un modelo de inteligencia artificial pre-entrenado para clasificar imágenes en diferentes categorías.</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Cómo funciona</h3>
              <p className="mb-4">
                El modelo utilizado es {modelName || 'ViT'}, entrenado para reconocer numerosas clases diferentes de objetos. La aplicación muestra las categorías más probables para cada imagen analizada.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Limitaciones</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>El procesamiento se realiza en el navegador, por lo que el primer análisis puede tardar mientras se carga el modelo.</li>
                <li>El modelo está optimizado para reconocer categorías generales de objetos, pero puede no ser preciso con imágenes muy específicas o atípicas.</li>
                <li>La calidad y el enfoque de las imágenes afectan significativamente los resultados de la predicción.</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Tecnologías utilizadas</h3>
              <p>
                React, Tailwind CSS, Hugging Face Transformers.js
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default ImageClassifier;