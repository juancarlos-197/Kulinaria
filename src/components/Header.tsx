import React from 'react';
import { ChefHat, Bookmark, Sparkles, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onGenerateAI: () => void;
  activeSection: 'catalog' | 'favorites' | 'generator';
  onSelectSection: (section: 'catalog' | 'favorites' | 'generator') => void;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  onGenerateAI,
  activeSection,
  onSelectSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E5E5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectSection('catalog')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#E85D36] rounded-sm transition-opacity hover:opacity-85"
            aria-label="Kulinaria - Inicio"
          >
            <div className="w-8 h-8 rounded-sm bg-[#141413] text-white flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-[#E85D36]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-[#141413]">
              Kulinaria
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#575653]">
          <button
            onClick={() => onSelectSection('catalog')}
            className={`transition-colors hover:text-[#141413] focus-visible:outline-2 focus-visible:outline-[#E85D36] ${
              activeSection === 'catalog'
                ? 'text-[#141413] font-semibold underline underline-offset-8 decoration-2 decoration-[#E85D36]'
                : ''
            }`}
          >
            Explorar Recetas
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('ingredientes-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="transition-colors hover:text-[#141413] focus-visible:outline-2 focus-visible:outline-[#E85D36]"
          >
            Mis Ingredientes
          </button>
          <button
            onClick={onOpenFavorites}
            className={`transition-colors hover:text-[#141413] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#E85D36] ${
              activeSection === 'favorites' ? 'text-[#141413] font-semibold' : ''
            }`}
          >
            <span>Favoritos</span>
            {favoritesCount > 0 && (
              <span className="font-mono text-xs font-semibold px-1.5 py-0.2 bg-[#F0EFEB] text-[#141413] rounded-sm tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFavorites}
            className="md:hidden p-2 text-[#575653] hover:text-[#141413] relative"
            aria-label="Ver recetas favoritas"
          >
            <Bookmark className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#E85D36] text-white text-[10px] font-mono rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onGenerateAI}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#141413] hover:bg-[#2B2A27] rounded-sm shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#E85D36] whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E85D36]" />
            <span>Crear con IA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
