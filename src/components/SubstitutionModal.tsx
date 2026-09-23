import React, { useState, useEffect } from 'react';
import { X, Sparkles, HelpCircle, ArrowRight, Check } from 'lucide-react';
import { RecipeService } from '../services/recipeService';

interface SubstitutionModalProps {
  ingredientName: string | null;
  onClose: () => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  ingredientName,
  onClose,
}) => {
  const [substitutions, setSubstitutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ingredientName) return;

    let isMounted = true;
    setLoading(true);

    RecipeService.getSubstitutions(ingredientName).then((subs) => {
      if (isMounted) {
        setSubstitutions(subs);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [ingredientName]);

  if (!ingredientName) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sub-title"
      className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg bg-white border border-[#E5E5E0] rounded-sm shadow-xl p-6">
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E0]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E85D36] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Asistente Culinario de Despensa</span>
            </div>
            <h3 id="sub-title" className="text-xl font-bold text-[#141413]">
              Sustitutos para: <span className="underline decoration-[#E85D36]">{ingredientName}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#73726E] hover:text-[#141413] rounded-sm transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6">
          {loading ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-[#141413] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#73726E]">
                Consultando alternativas prácticas de cocina casera...
              </p>
            </div>
          ) : substitutions.length > 0 ? (
            <ul className="space-y-3">
              {substitutions.map((sub, idx) => (
                <li
                  key={idx}
                  className="p-3.5 bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-xs sm:text-sm text-[#141413] flex items-start gap-3 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#141413] text-white text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>{sub}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 bg-[#FBFBF9] border border-[#E5E5E0] rounded-sm text-xs text-[#73726E]">
              No encontramos una sustitución directa exacta, pero puedes omitirlo o usar un vegetal o especia afín.
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E5E5E0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#141413] hover:bg-[#2B2A27] rounded-sm transition-colors"
          >
            Entendido, volver a la receta
          </button>
        </div>
      </div>
    </div>
  );
};
