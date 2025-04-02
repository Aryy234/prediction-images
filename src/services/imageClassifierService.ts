
import { pipeline, env } from '@huggingface/transformers';

// Set the backend to WASM to run in browser
// @ts-ignore - Using undocumented property that exists in runtime
env.backendType = 'wasm';

class ImageClassifierService {
  private classifier: any = null;
  private isLoading: boolean = false;
  private loadingPromise: Promise<void> | null = null;
  private modelId: string = 'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'; // Modelo compatible con transformers.js

  async getClassifier() {
    if (this.classifier) {
      return this.classifier;
    }

    if (this.loadingPromise) {
      await this.loadingPromise;
      return this.classifier;
    }

    this.isLoading = true;
    this.loadingPromise = this.initClassifier();
    await this.loadingPromise;
    this.isLoading = false;
    return this.classifier;
  }

  private async initClassifier() {
    try {
      console.log(`Cargando modelo de clasificación de imágenes: ${this.modelId}...`);
      
      this.classifier = await pipeline(
        'image-classification',
        this.modelId
      );
      
      console.log('Modelo cargado exitosamente');
    } catch (error) {
      console.error('Error al cargar el modelo:', error);
      
      // Fallback a otro modelo en caso de error
      try {
        console.log('Intentando cargar modelo alternativo...');
        this.modelId = 'Xenova/clip-vit-base-patch16';
        
        this.classifier = await pipeline(
          'image-classification',
          this.modelId
        );
        console.log('Modelo alternativo cargado exitosamente');
      } catch (fallbackError) {
        console.error('Error al cargar modelo alternativo:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async classifyImage(imageFile: File | string): Promise<Array<{ label: string; score: number }>> {
    const classifier = await this.getClassifier();
    
    try {
      const results = await classifier(imageFile, {
        topk: 10, // Obtener las 10 predicciones más probables
      });
      
      // Mejorar las etiquetas para que sean más legibles
      return results.map((result: any) => {
        return {
          label: this.cleanLabel(result.label),
          score: result.score
        };
      });
    } catch (error) {
      console.error('Error al clasificar imagen:', error);
      throw error;
    }
  }

  // Función para limpiar y mejorar las etiquetas del modelo
  private cleanLabel(label: string): string {
    // Eliminar códigos numéricos que algunos modelos incluyen
    label = label.replace(/^n\d+\s/, '');
    
    // Remover texto después de la primera coma si existe
    if (label.includes(',')) {
      label = label.split(',')[0];
    }
    
    return label;
  }

  isModelLoading() {
    return this.isLoading;
  }
  
  getModelName() {
    return this.modelId.split('/').pop() || this.modelId;
  }
}

// Singleton instance
export const imageClassifierService = new ImageClassifierService();
