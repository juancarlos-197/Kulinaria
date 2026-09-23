import React from 'react';
import { Clock, Bookmark, Sparkles, ArrowRight, Utensils } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  const matchScore = recipe.matchScore ?? 100;
  const isFullMatch = matchScore >= 95;
  const missingCount = recipe.missingIngredients?.length ?? 0;

  return (
    <article className="group relative bg-white border border-[#E5E5E0] hover:border-[#141413] rounded-sm transition-all duration-200 flex flex-col overflow-hidden shadow-xs hover:-translate-y-0.5">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-[#F0EFEB] overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            onError={(e) => {
              // Fallback if image path fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F4F0] text-[#73726E] p-4 text-center">
            <Utensils className="w-8 h-8 text-[#9E9D98] mb-2" />
            <span className="text-xs font-medium">{recipe.category}</span>
          </div>
        )}

        {/* Top-right Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-sm backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-[#141413] text-[#E85D36]'
              : 'bg-white/90 text-[#141413] hover:bg-white'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Bookmark className="w-4 h-4" fill={isFavorite ? '#E85D36' : 'none'} />
        </button>

        {/* Match status kicker */}
        <div className="absolute bottom-3 left-3">
          {isFullMatch ? (
            <div className="bg-[#141413]/90 backdrop-blur-sm text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>100% disponible</span>
            </div>
          ) : (
            <div className="bg-[#141413]/90 backdrop-blur-sm text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Falta {missingCount} {missingCount === 1 ? 'ingrediente' : 'ingredientes'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata with separators */}
          <div className="flex items-center gap-2 text-xs text-[#73726E] mb-2 font-mono">
            <span className="text-[#141413] font-semibold">{recipe.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{recipe.totalTimeMinutes} min</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
          </div>

          <h3 className="text-lg font-bold text-[#141413] leading-snug tracking-tight mb-1.5 group-hover:text-[#E85D36] transition-colors">
            {recipe.title}
          </h3>

          <p className="text-xs text-[#575653] line-clamp-2 leading-relaxed mb-4">
            {recipe.subtitle || recipe.description}
          </p>

          {/* Missing Ingredients Preview if any */}
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div className="text-[11px] text-[#73726E] mb-4 bg-[#FBFBF9] p-2 rounded-xs border border-[#E5E5E0]">
              <span className="font-semibold text-[#141413]">Te faltaría: </span>
              <span>{recipe.missingIngredients.slice(0, 2).join(', ')}</span>
              {recipe.missingIngredients.length > 2 && (
                <span> +{recipe.missingIngredients.length - 2} más</span>
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-[#E5E5E0] flex items-center justify-between">
          <div className="text-xs text-[#73726E]">
            <span>{recipe.ingredients.length} ingredientes</span>
          </div>

          <button
            onClick={() => onSelectRecipe(recipe)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141413] hover:text-[#E85D36] transition-colors py-1 group/btn"
          >
            <span>Ver preparación</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
};
