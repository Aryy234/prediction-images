
import { useState, useEffect } from 'react';
import ImageClassifier from '@/components/ImageClassifier';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="w-full py-6 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent gradient-bg inline-block">
          Clasificador de Imágenes con IA
        </h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Sube una imagen y el sistema predecirá la categoría a la que pertenece
        </p>
      </header>

      <main className="container py-6 px-4 mb-20">
        <ImageClassifier />
      </main>
      
      <footer className="fixed bottom-0 w-full py-4 bg-white/80 backdrop-blur-sm border-t">
        <div className="container text-center text-sm text-muted-foreground">
          Usando un modelo pre-entrenado para reconocer clases de imágenes | Procesamiento realizado en el navegador
        </div>
      </footer>
    </div>
  );
};

export default Index;
