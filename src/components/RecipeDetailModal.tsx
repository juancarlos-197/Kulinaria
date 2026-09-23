import React, { useState } from 'react';
import {
  X,
  Clock,
  Users,
  Bookmark,
  Sparkles,
  ChefHat,
  Play,
  Check,
  Copy,
  CheckCircle2,
  HelpCircle,
  Share2,
  Flame,
} from 'lucide-react';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../services/recipeService';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onStartCookingMode: (recipe: Recipe, servings: number) => void;
  onOpenSubstitution: (ingredientName: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isFavorite,
  onToggleFavorite,
  onStartCookingMode,
  onOpenSubstitution,
}) => {
  if (!recipe) return null;

  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copiedList, setCopiedList] = useState(false);

  // Scaled ingredients
  const scaledIngredients = RecipeService.scaleRecipeIngredients(
    recipe.ingredients,
    recipe.servings || 2,
    currentServings
  );

  const toggleCheckIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyMissingList = () => {
    const missing = recipe.missingIngredients || [];
    const textToCopy =
      missing.length > 0
        ? `Ingredientes necesarios para ${recipe.title}:\n- ${missing.join('\n- ')}`
        : `Ingredientes para ${recipe.title} (${currentServings} porciones):\n${scaledIngredients
            .map((i) => `- ${i.amount} ${i.name}`)
            .join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white border border-[#E5E5E0] shadow-xl rounded-sm overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E5E5E0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#73726E]">
              {recipe.category}
            </span>
            <span className="text-xs text-[#CCCCCC]">·</span>
            <span className="text-xs text-[#575653] font-mono">{recipe.difficulty}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={`p-2 rounded-sm border transition-colors ${
                isFavorite
                  ? 'bg-[#141413] text-[#E85D36] border-[#141413]'
                  : 'bg-white text-[#575653] border-[#E5E5E0] hover:border-[#141413]'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Bookmark className="w-4 h-4" fill={isFavorite ? '#E85D36' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#73726E] hover:text-[#141413] hover:bg-[#F0EFEB] rounded-sm transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Hero section */}
          <div>
            <h2
              id="recipe-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] mb-2"
            >
              {recipe.title}
            </h2>
            <p className="text-base text-[#575653] leading-relaxed max-w-2xl">
              {recipe.subtitle || recipe.description}
            </p>

            {/* Timing & Servings Meta strip */}
            <div className="flex flex-wrap items-center gap-6 mt-6 py-3 px-4 bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-xs font-mono text-[#575653]">
              <div>
                <span className="text-[#9E9D98] uppercase block text-[10px]">Preparación</span>
                <span className="font-semibold text-[#141413] text-sm tabular-nums">
                  {recipe.prepTimeMinutes} min
                </span>
              </div>
              <div className="w-px h-6 bg-[#E5E5E0]" />
              <div>
                <span className="text-[#9E9D98] uppercase block text-[10px]">Cocción</span>
                <span className="font-semibold text-[#141413] text-sm tabular-nums">
                  {recipe.cookTimeMinutes} min
                </span>
              </div>
              <div className="w-px h-6 bg-[#E5E5E0]" />
              <div>
                <span className="text-[#9E9D98] uppercase block text-[10px]">Tiempo Total</span>
                <span className="font-semibold text-[#E85D36] text-sm tabular-nums">
                  {recipe.totalTimeMinutes} min
                </span>
              </div>
              <div className="w-px h-6 bg-[#E5E5E0]" />
              <div>
                <span className="text-[#9E9D98] uppercase block text-[10px]">Dificultad</span>
                <span className="font-semibold text-[#141413] text-sm">{recipe.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Hero Image if available */}
          {recipe.imageUrl && (
            <div className="relative aspect-16/9 w-full rounded-sm overflow-hidden bg-[#F0EFEB] border border-[#E5E5E0]">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Grid: Ingredients (Left) vs Steps (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            {/* Ingredients Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E0]">
                <h3 className="text-base font-bold text-[#141413]">Ingredientes</h3>

                {/* Scalable Servings Counter */}
                <div className="flex items-center gap-1.5 bg-[#FBFBF9] border border-[#E5E5E0] px-2 py-1 rounded-sm text-xs font-mono">
                  <span className="text-[#73726E]">Porciones:</span>
                  <button
                    onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                    disabled={currentServings <= 1}
                    className="w-5 h-5 flex items-center justify-center font-bold text-[#141413] hover:bg-[#E5E4DE] disabled:opacity-30 rounded-xs"
                    aria-label="Disminuir porción"
                  >
                    -
                  </button>
                  <span className="font-bold text-[#141413] px-1">{currentServings}</span>
                  <button
                    onClick={() => setCurrentServings((s) => s + 1)}
                    className="w-5 h-5 flex items-center justify-center font-bold text-[#141413] hover:bg-[#E5E4DE] rounded-xs"
                    aria-label="Aumentar porción"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#73726E]">
                Marca los que ya tienes listos en tu mesa de trabajo:
              </p>

              <ul className="space-y-2.5">
                {scaledIngredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  return (
                    <li
                      key={idx}
                      className={`flex items-start justify-between p-2.5 rounded-sm border transition-colors ${
                        isChecked
                          ? 'bg-[#FBFBF9] border-[#E5E5E0] opacity-60'
                          : 'bg-white border-[#E5E5E0] hover:border-[#CCCCCC]'
                      }`}
                    >
                      <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheckIngredient(idx)}
                          className="mt-0.5 w-4 h-4 rounded-xs text-[#E85D36] border-[#CCCCCC] focus:ring-[#E85D36]"
                        />
                        <div className="text-xs">
                          <span
                            className={`font-semibold text-[#141413] block ${
                              isChecked ? 'line-through text-[#9E9D98]' : ''
                            }`}
                          >
                            {ing.amount} {ing.name}
                          </span>
                          {ing.isPantryStaple && (
                            <span className="text-[10px] text-[#73726E] font-mono">
                              Básico común de despensa
                            </span>
                          )}
                        </div>
                      </label>

                      {/* Substitution Quick Query */}
                      <button
                        type="button"
                        onClick={() => onOpenSubstitution(ing.name)}
                        className="ml-2 px-2 py-0.5 text-[10px] font-medium text-[#73726E] hover:text-[#141413] hover:bg-[#F0EFEB] rounded-xs transition-colors whitespace-nowrap"
                        title="¿No tienes este ingrediente? Busca un sustituto"
                      >
                        Sustituir
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={handleCopyMissingList}
                className="w-full mt-3 py-2 px-3 text-xs font-medium text-[#575653] hover:text-[#141413] border border-[#E5E5E0] hover:border-[#141413] rounded-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedList ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>¡Lista copiada al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar lista de ingredientes</span>
                  </>
                )}
              </button>

              {/* Nutrition breakdown if available */}
              {recipe.nutrition && (
                <div className="mt-6 pt-4 border-t border-[#E5E5E0]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#73726E] mb-2.5">
                    Información Nutricional (por porción)
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xs">
                      <span className="text-[10px] text-[#73726E] block">Calorías</span>
                      <span className="font-bold text-[#141413] tabular-nums">
                        {recipe.nutrition.calories} kcal
                      </span>
                    </div>
                    <div className="p-2 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xs">
                      <span className="text-[10px] text-[#73726E] block">Proteína</span>
                      <span className="font-bold text-[#141413] tabular-nums">
                        {recipe.nutrition.proteinGrams}g
                      </span>
                    </div>
                    <div className="p-2 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xs">
                      <span className="text-[10px] text-[#73726E] block">Carbos</span>
                      <span className="font-bold text-[#141413] tabular-nums">
                        {recipe.nutrition.carbsGrams}g
                      </span>
                    </div>
                    <div className="p-2 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xs">
                      <span className="text-[10px] text-[#73726E] block">Grasas</span>
                      <span className="font-bold text-[#141413] tabular-nums">
                        {recipe.nutrition.fatGrams}g
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Equipment needed */}
              {recipe.equipment && recipe.equipment.length > 0 && (
                <div className="pt-2 text-xs text-[#73726E]">
                  <span className="font-semibold text-[#141413]">Utensilios recomendados: </span>
                  <span>{recipe.equipment.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Steps Column */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E0]">
                <h3 className="text-base font-bold text-[#141413]">Pasos de Preparación</h3>
                <span className="text-xs text-[#73726E] font-mono">
                  {recipe.steps.length} pasos claros
                </span>
              </div>

              <div className="space-y-6">
                {recipe.steps.map((step) => (
                  <div key={step.stepNumber} className="relative pl-8 border-l-2 border-[#E5E5E0] pb-2">
                    <span className="absolute -left-[11px] top-0 w-5 h-5 bg-[#141413] text-white text-[11px] font-mono font-bold rounded-full flex items-center justify-center">
                      {step.stepNumber}
                    </span>

                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#141413]">{step.title}</h4>
                      {step.durationMinutes && (
                        <span className="text-xs text-[#73726E] font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{step.durationMinutes} min</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#575653] leading-relaxed">
                      {step.instruction}
                    </p>

                    {step.tip && (
                      <div className="mt-2 text-xs bg-[#FBFBF9] border border-[#E5E5E0] p-2.5 rounded-xs text-[#73726E]">
                        <span className="font-semibold text-[#E85D36]">Consejo del chef: </span>
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chef Tips summary */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <div className="mt-6 p-4 bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm">
                  <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-[#E85D36]" />
                    <span>Trucos y Consejos Clave</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#575653]">
                    {recipe.chefTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#E85D36] font-bold">·</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions bar */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-[#E5E5E0] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#73726E]">
            <span>Ideal para principiantes y preparaciones cotidianas.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-[#575653] hover:text-[#141413] border border-[#E5E5E0] rounded-sm transition-colors"
            >
              Volver al catálogo
            </button>

            <button
              onClick={() => onStartCookingMode(recipe, currentServings)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#E85D36] hover:bg-[#D44E28] rounded-sm shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#141413] whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Modo Cocina Paso a Paso</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
