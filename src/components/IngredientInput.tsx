import React, { useState } from 'react';
import { Plus, X, RotateCcw, Sparkles, Check, Refrigerator } from 'lucide-react';
import { COMMON_INGREDIENTS } from '../services/recipeService';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onClearIngredients: () => void;
  onGenerateRecipes: () => void;
  isLoading: boolean;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
  onGenerateRecipes,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Support comma-separated inputs e.g. "huevo, tomate, arroz"
    const items = inputValue
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    items.forEach((item) => {
      onAddIngredient(item);
    });

    setInputValue('');
  };

  const isAlreadyAdded = (name: string) => {
    const norm = name.toLowerCase().trim();
    return ingredients.some((i) => i.toLowerCase().trim() === norm);
  };

  const handleToggleCommon = (name: string) => {
    if (isAlreadyAdded(name)) {
      onRemoveIngredient(name);
    } else {
      onAddIngredient(name);
    }
  };

  return (
    <section id="ingredientes-section" className="bg-white border border-[#E5E5E0] p-6 lg:p-8 rounded-sm shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E0]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#73726E] mb-1">
            <Refrigerator className="w-4 h-4 text-[#E85D36]" />
            <span>Despensa & Refrigerador</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#141413]">
            ¿Qué ingredientes tienes a mano?
          </h2>
          <p className="text-sm text-[#575653] mt-1">
            Ingresa lo que tienes en casa y Kulinaria calculará recetas deliciosas sin que tengas que salir a comprar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {ingredients.length > 0 && (
            <button
              onClick={onClearIngredients}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#73726E] hover:text-[#141413] border border-[#E5E5E0] hover:border-[#CCCCCC] bg-transparent rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#E85D36]"
              title="Borrar todos los ingredientes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
          )}

          <button
            onClick={onGenerateRecipes}
            disabled={ingredients.length === 0 || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E85D36] hover:bg-[#D44E28] disabled:bg-[#D4D3CF] disabled:cursor-not-allowed rounded-sm transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-[#141413] whitespace-nowrap"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Buscando recetas...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generar Recetas ({ingredients.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="ingredient-input" className="block text-xs font-medium text-[#575653] mb-1.5">
          Escribe un ingrediente (o varios separados por comas):
        </label>
        <div className="flex gap-2">
          <input
            id="ingredient-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ej: Huevo, Tomate, Arroz, Patatas..."
            className="flex-1 px-4 py-2.5 text-sm bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-[#141413] placeholder-[#9E9D98] focus:bg-white focus:outline-none focus:border-[#141413] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-[#141413] bg-[#F0EFEB] hover:bg-[#E5E4DE] disabled:opacity-50 disabled:hover:bg-[#F0EFEB] rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      </form>

      {/* Selected Ingredients List */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-[#73726E] mb-2 font-mono">
          <span>Ingredientes seleccionados ({ingredients.length})</span>
          {ingredients.length === 0 && <span>Ninguno aún</span>}
        </div>

        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {ingredients.map((ing) => (
              <div
                key={ing}
                className="group inline-flex items-center gap-2 px-3 py-1.5 bg-[#141413] text-white rounded-sm text-xs font-medium transition-all"
              >
                <span>{ing}</span>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(ing)}
                  aria-label={`Eliminar ${ing}`}
                  className="text-white/60 hover:text-white transition-colors focus-visible:outline-1 focus-visible:outline-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 px-3 bg-[#FBFBF9] border border-dashed border-[#E5E5E0] rounded-sm text-center">
            <p className="text-xs text-[#73726E]">
              Haz clic en los ingredientes habituales abajo o escribe arriba para comenzar tu búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Quick Select Pantry Staples */}
      <div className="mt-6 pt-5 border-t border-[#E5E5E0]">
        <span className="block text-xs font-medium text-[#575653] mb-2.5">
          Sugerencias rápidas para agregar en un clic:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_INGREDIENTS.map((item) => {
            const added = isAlreadyAdded(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleToggleCommon(item.name)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border transition-colors ${
                  added
                    ? 'bg-[#141413] text-white border-[#141413]'
                    : 'bg-[#FBFBF9] text-[#575653] border-[#E5E5E0] hover:border-[#141413] hover:text-[#141413]'
                }`}
              >
                {added ? (
                  <Check className="w-3 h-3 text-[#E85D36]" />
                ) : (
                  <Plus className="w-3 h-3 text-[#9E9D98]" />
                )}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
