import React, { useState } from 'react';
import { X, Sparkles, Clock, Users, ChefHat, Check } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIngredients: string[];
  onGenerate: (params: {
    ingredients: string[];
    timeLimit: string;
    mealType: string;
    difficulty: string;
    dietary: string[];
    servings: number;
  }) => Promise<void>;
  isLoading: boolean;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentIngredients,
  onGenerate,
  isLoading,
}) => {
  const [timeLimit, setTimeLimit] = useState('15 minutos o menos');
  const [mealType, setMealType] = useState('Almuerzo o Cena');
  const [difficulty, setDifficulty] = useState('Muy Fácil');
  const [servings, setServings] = useState(2);
  const [dietary, setDietary] = useState<string[]>([]);
  const [customPromptIngredients, setCustomPromptIngredients] = useState(
    currentIngredients.join(', ')
  );

  if (!isOpen) return null;

  const handleToggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalIngredients = customPromptIngredients
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (finalIngredients.length === 0) return;

    await onGenerate({
      ingredients: finalIngredients,
      timeLimit,
      mealType,
      difficulty,
      dietary,
      servings,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-generator-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg bg-white border border-[#E5E5E0] shadow-2xl rounded-sm p-6 sm:p-8">
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E0]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E85D36] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Chef Inteligente Gemini</span>
            </div>
            <h2 id="ai-generator-title" className="text-xl sm:text-2xl font-bold text-[#141413]">
              Crear Recetas a Medida
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#73726E] hover:text-[#141413] rounded-sm transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Ingredients field */}
          <div>
            <label className="block text-xs font-semibold text-[#141413] mb-1.5">
              Ingredientes exactos que tienes:
            </label>
            <textarea
              rows={2}
              value={customPromptIngredients}
              onChange={(e) => setCustomPromptIngredients(e.target.value)}
              placeholder="ej: 3 huevos, 1 lata de atún, arroz cocido, tomate, un poco de queso..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-[#141413] focus:bg-white focus:outline-none focus:border-[#141413]"
              required
            />
            <p className="text-[11px] text-[#73726E] mt-1">
              El chef creará opciones deliciosas sin requerir ingredientes raros adicionales.
            </p>
          </div>

          {/* Time & Servings row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#575653] mb-1.5">
                Tiempo disponible:
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-[#141413]"
              >
                <option value="15 minutos o menos">Express (≤ 15 min)</option>
                <option value="30 minutos">Estándar (≤ 30 min)</option>
                <option value="Cualquiera">Sin prisa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#575653] mb-1.5">
                Porciones deseadas:
              </label>
              <select
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-[#141413]"
              >
                <option value={1}>1 persona</option>
                <option value={2}>2 personas</option>
                <option value={4}>4 personas (Familia)</option>
                <option value={6}>6 personas</option>
              </select>
            </div>
          </div>

          {/* Dietary options */}
          <div>
            <label className="block text-xs font-medium text-[#575653] mb-1.5">
              Etiquetas o estilo dietético (opcional):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Vegetariano',
                'Sin Gluten',
                'Bajo en Calorías',
                'Alto en Proteína',
                'En 1 Sola Sartén',
              ].map((item) => {
                const selected = dietary.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleToggleDietary(item)}
                    className={`px-2.5 py-1 text-xs rounded-sm border transition-colors ${
                      selected
                        ? 'bg-[#141413] text-white border-[#141413]'
                        : 'bg-[#FBFBF9] text-[#575653] border-[#E5E5E0] hover:border-[#141413]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#E5E5E0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#575653] hover:text-[#141413]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading || !customPromptIngredients.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#E85D36] hover:bg-[#D44E28] disabled:bg-[#D4D3CF] rounded-sm transition-colors shadow-xs"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creando recetas mágicas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar con Chef IA</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
