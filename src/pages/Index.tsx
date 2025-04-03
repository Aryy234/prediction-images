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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="w-full pt-10 pb-6 px-4 text-center">
        <h1 className="text-3xl font-medium text-slate-900 dark:text-slate-100">
          Clasificador de Imágenes
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
          Sube una imagen y el sistema predecirá su categoría
        </p>
      </header>

      <main className="container py-6 px-4 mb-16">
        <ImageClassifier />
      </main>
      
      <footer className="fixed bottom-0 w-full py-3 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
        <div className="container text-center text-xs text-slate-400 dark:text-slate-500">
          Usando modelo pre-entrenado | Procesamiento en navegador
        </div>
      </footer>
    </div>
  );
};

export default Index;
