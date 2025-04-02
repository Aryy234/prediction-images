
import { pipeline, env } from '@huggingface/transformers';

// Set the backend to WASM to run in browser
// @ts-ignore - Using undocumented property that exists in runtime
env.backendType = 'wasm';

class ImageClassifierService {
  private classifier: any = null;
  private isLoading: boolean = false;
  private loadingPromise: Promise<void> | null = null;

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
      console.log('Loading image classification model...');
      // Using a small and fast model for image classification
      this.classifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'
      );
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async classifyImage(imageFile: File | string): Promise<Array<{ label: string; score: number }>> {
    const classifier = await this.getClassifier();
    
    try {
      const results = await classifier(imageFile);
      // Return top 10 results or all if less than 10
      return results.slice(0, 10);
    } catch (error) {
      console.error('Error classifying image:', error);
      throw error;
    }
  }

  isModelLoading() {
    return this.isLoading;
  }
}

// Singleton instance
export const imageClassifierService = new ImageClassifierService();
