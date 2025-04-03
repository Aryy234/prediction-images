import React, { useCallback, useState, useRef, useEffect } from 'react';
import { X, ImageIcon, CameraIcon, ClipboardIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected,
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelected(file);
    }
  }, [onImageSelected]);

  // Manejo de la cámara (movido aquí arriba para resolver el problema de hoisting)
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      // Primero asegurarse de detener cualquier cámara activa anterior
      stopCamera();
      
      if (videoRef.current) {
        // Solicitar permisos explícitamente
        toast?.success('Solicitando acceso a la cámara...');
        
        const constraints = { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Asegurarse de que el componente no se ha desmontado
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsCameraActive(true);
                })
                .catch(err => {
                  console.error("Error reproduciendo video:", err);
                  stopCamera();
                  toast?.error('Error al iniciar la cámara');
                });
            }
          };
        } else {
          // El componente se desmontó mientras esperaba
          stream.getTracks().forEach(track => track.stop());
        }
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      toast?.error('No se pudo acceder a la cámara');
      setIsCameraActive(false);
    }
  }, [stopCamera]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Configurar dimensiones del canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujar el frame del video en el canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir a archivo
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            handleFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  }, [handleFile, stopCamera]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    // Si había una cámara activa, la cerramos
    stopCamera();
  }, [previewUrl, stopCamera]);

  // Manejo del portapapeles
  const handlePaste = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], 'clipboard-image.png', { type });
            handleFile(file);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Error al acceder al portapapeles:', err);
      // Intenta el método alternativo para compatibilidad con más navegadores
      try {
        const items = await navigator.clipboard.readText();
        console.log('Solo texto disponible en portapapeles');
      } catch (textErr) {
        console.error('No se pudo acceder al portapapeles:', textErr);
      }
    }
  }, [handleFile]);

  // También capturamos el evento de pegado en el documento
  useEffect(() => {
    const pasteHandler = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault();
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFile(file);
        }
      }
    };

    document.addEventListener('paste', pasteHandler);
    return () => {
      document.removeEventListener('paste', pasteHandler);
    };
  }, [handleFile]);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div 
      className={cn(
        "relative w-full h-64 transition-all duration-200 flex flex-col items-center justify-center overflow-hidden",
        dragActive ? "bg-slate-50 dark:bg-slate-900" : "",
        className
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain" 
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 border-none shadow-sm"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : isCameraActive ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 flex gap-2">
            <Button 
              variant="outline" 
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
              onClick={capturePhoto}
            >
              Capturar
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
              onClick={stopCamera}
            >
              Cancelar
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="p-2 text-slate-400 dark:text-slate-500">
              <ImageIcon className="h-8 w-8" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Arrastra tu imagen aquí o usa las opciones
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-xs flex items-center gap-1.5" 
                onClick={handleBrowseClick}
                size="sm"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Explorar
              </Button>
              <Button 
                variant="outline" 
                className="text-xs flex items-center gap-1.5" 
                onClick={handlePaste}
                size="sm"
              >
                <ClipboardIcon className="h-3.5 w-3.5" />
                Pegar
              </Button>
              <Button 
                variant="outline" 
                className="text-xs flex items-center gap-1.5" 
                onClick={startCamera}
                size="sm"
              >
                <CameraIcon className="h-3.5 w-3.5" />
                Cámara
              </Button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
};

export default ImageUploader;
