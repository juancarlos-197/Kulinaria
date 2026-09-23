import React from 'react';
import { Clock, BarChart2, Users, CheckCircle2 } from 'lucide-react';
import { RecipeFilters } from '../types/recipe';

interface FiltersBarProps {
  filters: RecipeFilters;
  onChangeFilters: (newFilters: RecipeFilters) => void;
  totalResults: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChangeFilters,
  totalResults,
}) => {
  const updateFilter = <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => {
    onChangeFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white border border-[#E5E5E0] p-4 lg:p-6 rounded-sm shadow-xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E5E0]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#73726E]">
            Filtrar Resultados
          </span>
          <span className="text-xs text-[#73726E]">·</span>
          <span className="font-mono text-xs font-semibold text-[#141413] tabular-nums">
            {totalResults} {totalResults === 1 ? 'receta encontrada' : 'recetas encontradas'}
          </span>
        </div>

        {/* Toggle 100% Match */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[#141413]">
          <input
            type="checkbox"
            checked={filters.onlyFullMatch}
            onChange={(e) => updateFilter('onlyFullMatch', e.target.checked)}
            className="w-4 h-4 rounded-xs text-[#E85D36] border-[#CCCCCC] focus:ring-[#E85D36]"
          />
          <span>Solo 100% ingredientes disponibles</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* Tiempo */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#575653] mb-1.5">
            <Clock className="w-3.5 h-3.5 text-[#73726E]" />
            <span>Tiempo Máximo</span>
          </label>
          <div className="flex items-center gap-1 bg-[#FBFBF9] p-1 border border-[#E5E5E0] rounded-sm">
            {(['all', '15', '30', '45'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateFilter('timeLimit', t)}
                className={`flex-1 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap ${
                  filters.timeLimit === t
                    ? 'bg-[#141413] text-white'
                    : 'text-[#575653] hover:text-[#141413]'
                }`}
              >
                {t === 'all' ? 'Todos' : `< ${t}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Dificultad */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#575653] mb-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-[#73726E]" />
            <span>Dificultad</span>
          </label>
          <div className="flex items-center gap-1 bg-[#FBFBF9] p-1 border border-[#E5E5E0] rounded-sm">
            {(['all', 'Muy Fácil', 'Fácil'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => updateFilter('difficulty', d)}
                className={`flex-1 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap ${
                  filters.difficulty === d
                    ? 'bg-[#141413] text-white'
                    : 'text-[#575653] hover:text-[#141413]'
                }`}
              >
                {d === 'all' ? 'Todas' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría / Momento */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#575653] mb-1.5">
            <span>Momento del Día</span>
          </label>
          <div className="flex items-center gap-1 bg-[#FBFBF9] p-1 border border-[#E5E5E0] rounded-sm">
            {(['all', 'Almuerzo', 'Cena'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateFilter('category', c)}
                className={`flex-1 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap ${
                  filters.category === c
                    ? 'bg-[#141413] text-white'
                    : 'text-[#575653] hover:text-[#141413]'
                }`}
              >
                {c === 'all' ? 'Todos' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Porciones base */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#575653] mb-1.5">
            <Users className="w-3.5 h-3.5 text-[#73726E]" />
            <span>Porciones</span>
          </label>
          <div className="flex items-center gap-1 bg-[#FBFBF9] p-1 border border-[#E5E5E0] rounded-sm">
            {[1, 2, 4, 6].map((serv) => (
              <button
                key={serv}
                type="button"
                onClick={() => updateFilter('servings', serv)}
                className={`flex-1 py-1 text-xs font-mono font-medium rounded-xs transition-colors ${
                  filters.servings === serv
                    ? 'bg-[#141413] text-white'
                    : 'text-[#575653] hover:text-[#141413]'
                }`}
              >
                {serv} {serv === 1 ? 'p' : 'p'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
