import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-xl mx-auto px-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          © {new Date().getFullYear()} Ariel Elizalde. Todos los derechos reservados.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <a 
            href="mailto:marcelo-elizalde@hotmail.com" 
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            marcelo-elizalde@hotmail.com
          </a>
          <span className="hidden sm:inline text-slate-400">•</span>
          <a 
            href="https://portfolioariel.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            Portfolio <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;