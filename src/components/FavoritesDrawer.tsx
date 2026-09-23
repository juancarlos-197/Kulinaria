import React from 'react';
import { X, Bookmark, ArrowRight, Clock, Trash2, Utensils } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Recipe[];
  onRemoveFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectRecipe,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-md bg-white border-l border-[#E5E5E0] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#E85D36]" fill="#E85D36" />
            <h2 id="favorites-title" className="text-base font-bold text-[#141413]">
              Mis Recetas Guardadas ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#73726E] hover:text-[#141413] rounded-sm transition-colors"
            aria-label="Cerrar favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {favorites.length > 0 ? (
            favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="group p-4 bg-[#FBFBF9] border border-[#E5E5E0] hover:border-[#141413] rounded-sm transition-colors flex gap-4 items-start"
              >
                {/* Small thumbnail */}
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-16 h-16 object-cover rounded-xs shrink-0 border border-[#E5E5E0]"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#EFEFEA] rounded-xs flex items-center justify-center shrink-0 text-[#9E9D98]">
                    <Utensils className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#73726E] mb-1">
                    <span>{recipe.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {recipe.totalTimeMinutes}m
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#141413] truncate group-hover:text-[#E85D36] transition-colors">
                    {recipe.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectRecipe(recipe);
                      }}
                      className="text-xs font-semibold text-[#141413] hover:underline flex items-center gap-1"
                    >
                      <span>Ver receta</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onRemoveFavorite(recipe.id)}
                      className="p-1 text-[#9E9D98] hover:text-rose-600 transition-colors"
                      title="Eliminar de guardados"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-[#CCCCCC] mx-auto" />
              <h3 className="text-sm font-bold text-[#141413]">Aún no tienes recetas guardadas</h3>
              <p className="text-xs text-[#73726E] max-w-xs mx-auto">
                Guarda tus platos preferidos haciendo clic en el icono del marcador en cualquier receta para consultarlos cuando quieras.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E5E5E0] bg-[#FBFBF9]">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-[#141413] bg-white border border-[#E5E5E0] hover:border-[#141413] rounded-sm transition-colors"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    </div>
  );
};
