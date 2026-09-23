import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Utensils,
  ArrowRight,
  Bookmark,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  ChefHat,
  RotateCcw,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { Recipe, RecipeFilters } from './types/recipe';
import { RecipeService } from './services/recipeService';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { FiltersBar } from './components/FiltersBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CookingModeModal } from './components/CookingModeModal';
import { SubstitutionModal } from './components/SubstitutionModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AIGeneratorModal } from './components/AIGeneratorModal';

export default function App() {
  // Saved pantry ingredients
  const [ingredients, setIngredients] = useState<string[]>(() =>
    RecipeService.getSavedPantry()
  );

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    RecipeService.getFavorites()
  );

  // Recipes list (curated + AI generated)
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    RecipeService.getCuratedRecipes(RecipeService.getSavedPantry())
  );

  // UI Modals & Drawers
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingModeRecipe, setCookingModeRecipe] = useState<{
    recipe: Recipe;
    servings: number;
  } | null>(null);
  const [substitutionTarget, setSubstitutionTarget] = useState<string | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeSection, setActiveSection] = useState<'catalog' | 'favorites' | 'generator'>('catalog');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<RecipeFilters>({
    timeLimit: 'all',
    difficulty: 'all',
    category: 'all',
    dietary: [],
    servings: 2,
    onlyFullMatch: false,
  });

  // Re-score recipes when user ingredients change
  useEffect(() => {
    RecipeService.savePantry(ingredients);
    setRecipes((prev) =>
      prev.map((r) => RecipeService.scoreRecipe(r, ingredients)).sort(
        (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
      )
    );
  }, [ingredients]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = ingredients.some(
      (i) => i.toLowerCase().trim() === trimmed.toLowerCase()
    );
    if (!exists) {
      setIngredients((prev) => [...prev, trimmed]);
    }
  };

  const handleRemoveIngredient = (name: string) => {
    setIngredients((prev) =>
      prev.filter((i) => i.toLowerCase().trim() !== name.toLowerCase().trim())
    );
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  const handleToggleFavorite = (recipeId: string) => {
    const isNowFav = RecipeService.toggleFavorite(recipeId);
    setFavoriteIds(RecipeService.getFavorites());
    showToast(
      isNowFav ? 'Receta guardada en tus favoritos' : 'Receta removida de favoritos'
    );
  };

  // Trigger recipe generation with AI
  const handleGenerateRecipes = async (customParams?: {
    ingredients: string[];
    timeLimit: string;
    mealType: string;
    difficulty: string;
    dietary: string[];
    servings: number;
  }) => {
    const targetIngredients = customParams?.ingredients || ingredients;
    if (targetIngredients.length === 0) {
      showToast('Ingresa al menos un ingrediente para generar recetas.');
      return;
    }

    setIsLoadingAI(true);
    try {
      const result = await RecipeService.generateRecipesWithAI({
        ingredients: targetIngredients,
        timeLimit: customParams?.timeLimit || 'Cualquiera',
        mealType: customParams?.mealType || 'Cualquiera',
        difficulty: customParams?.difficulty || 'Fácil',
        dietary: customParams?.dietary || [],
        servings: customParams?.servings || filters.servings,
      });

      if (result.recipes && result.recipes.length > 0) {
        // Prepend newly generated recipes to list and eliminate duplicate IDs
        setRecipes((prev) => {
          const newIds = new Set(result.recipes.map((r) => r.id));
          const filteredOld = prev.filter((r) => !newIds.has(r.id));
          return [...result.recipes, ...filteredOld];
        });

        showToast(
          result.isAIGenerated
            ? `¡Se generaron ${result.recipes.length} nuevas recetas basadas en tus ingredientes!`
            : '¡Recetas actualizadas según tus ingredientes disponibles!'
        );

        // Scroll smoothly to catalog
        const catalogEl = document.getElementById('recetas-catalogo');
        catalogEl?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      showToast('Error al conectar con el servidor de recetas. Intenta nuevamente.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // 100% match filter
      if (filters.onlyFullMatch && (recipe.matchScore ?? 0) < 95) {
        return false;
      }

      // Time filter
      if (filters.timeLimit !== 'all') {
        const maxTime = parseInt(filters.timeLimit, 10);
        if (recipe.totalTimeMinutes > maxTime) return false;
      }

      // Difficulty filter
      if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && recipe.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [recipes, filters]);

  // Favorite recipes objects
  const favoriteRecipes = useMemo(() => {
    return recipes.filter((r) => favoriteIds.includes(r.id));
  }, [recipes, favoriteIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#141413]">
      {/* Accessibility Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 z-50 px-4 py-2 bg-[#141413] text-white text-xs font-semibold rounded-sm"
      >
        Saltar al contenido principal
      </a>

      {/* Top Bar Header */}
      <Header
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onGenerateAI={() => setIsAIGeneratorOpen(true)}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          if (sec === 'favorites') {
            setIsFavoritesOpen(true);
          }
        }}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Editorial Hero Intro */}
        <section className="pt-4 pb-2 border-b border-[#E5E5E0]">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E85D36] block mb-2 font-mono">
              Cocina Inteligente & Sin Desperdicio
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#141413] leading-tight mb-3">
              Cocina fácil con lo que ya tienes en casa.
            </h1>
            <p className="text-sm sm:text-base text-[#575653] leading-relaxed">
              Dile adiós a preguntarte <em>¿qué cocino hoy?</em>. Selecciona tus ingredientes, descubre recetas a prueba de fallos y cocina paso a paso con asistente por voz.
            </p>
          </div>
        </section>

        {/* Section 1: Ingredient Manager */}
        <IngredientInput
          ingredients={ingredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onClearIngredients={handleClearIngredients}
          onGenerateRecipes={() => handleGenerateRecipes()}
          isLoading={isLoadingAI}
        />

        {/* Section 2: Recipe Catalog & Filter Controls */}
        <section id="recetas-catalogo" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#73726E] font-mono">
                Catálogo Adaptativo
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#141413]">
                Recetas ordenadas por disponibilidad
              </h2>
            </div>

            <button
              onClick={() => setIsAIGeneratorOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#141413] hover:text-[#E85D36] border border-[#E5E5E0] hover:border-[#141413] rounded-sm transition-colors self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E85D36]" />
              <span>Personalizar parámetros con IA</span>
            </button>
          </div>

          {/* Filters Bar */}
          <FiltersBar
            filters={filters}
            onChangeFilters={setFilters}
            totalResults={filteredRecipes.length}
          />

          {/* Recipe Grid */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favoriteIds.includes(recipe.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectRecipe={(r) => setSelectedRecipe(r)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 px-6 bg-white border border-[#E5E5E0] rounded-sm text-center space-y-4">
              <Utensils className="w-10 h-10 text-[#CCCCCC] mx-auto" />
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-[#141413]">
                  No hay recetas que coincidan con estos filtros
                </h3>
                <p className="text-xs text-[#73726E] leading-relaxed">
                  Prueba desactivar la casilla de &quot;Solo 100% de ingredientes&quot; o agrega ingredientes básicos como huevo, patatas o tomate en la despensa.
                </p>
              </div>
              <button
                onClick={() =>
                  setFilters({
                    timeLimit: 'all',
                    difficulty: 'all',
                    category: 'all',
                    dietary: [],
                    servings: 2,
                    onlyFullMatch: false,
                  })
                }
                className="px-4 py-2 text-xs font-semibold text-[#141413] bg-[#F0EFEB] hover:bg-[#E5E4DE] rounded-sm transition-colors"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </section>

        {/* Informative Zero-Waste Culinary Philosophy */}
        <section className="p-8 bg-[#F0EFEB]/70 border border-[#E5E5E0] rounded-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#E85D36]">01. Cero Desperdicio</span>
            <h3 className="text-sm font-bold text-[#141413]">Aprovecha lo que ya compraste</h3>
            <p className="text-xs text-[#575653] leading-relaxed">
              El 30% de los alimentos en casa se descartan por no saber combinarlos. Kulinaria prioriza tus sobras y vegetales de temporada.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#E85D36]">02. Cocina Accesible</span>
            <h3 className="text-sm font-bold text-[#141413]">Sin términos complejos</h3>
            <p className="text-xs text-[#575653] leading-relaxed">
              Pasos numerados claros, tiempos reales y un asistente por voz para cocinar con las manos ocupadas sin manchar la pantalla.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#E85D36]">03. Sustituciones Prácticas</span>
            <h3 className="text-sm font-bold text-[#141413]">Flexibilidad absoluta</h3>
            <p className="text-xs text-[#575653] leading-relaxed">
              ¿Falta nata o huevos? Nuestro motor sugiere alternativas cotidianas de despensa para que nada te impida cocinar hoy.
            </p>
          </div>
        </section>
      </main>

      {/* Quiet Minimal Footer */}
      <footer className="mt-16 border-t border-[#E5E5E0] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#73726E]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#141413]">Kulinaria</span>
            <span>·</span>
            <span>Recetario inteligente de aprovechamiento culinario</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Diseño minimalista y accesible</span>
            <span>·</span>
            <span>100% responsivo</span>
          </div>
        </div>
      </footer>

      {/* Toast feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#141413] text-white text-xs font-medium px-4 py-3 rounded-sm shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-[#E85D36]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favoriteIds.includes(selectedRecipe.id)}
          onToggleFavorite={handleToggleFavorite}
          onStartCookingMode={(recipe, servings) => {
            setSelectedRecipe(null);
            setCookingModeRecipe({ recipe, servings });
          }}
          onOpenSubstitution={(ingredientName) => setSubstitutionTarget(ingredientName)}
        />
      )}

      {cookingModeRecipe && (
        <CookingModeModal
          recipe={cookingModeRecipe.recipe}
          servings={cookingModeRecipe.servings}
          onClose={() => setCookingModeRecipe(null)}
        />
      )}

      <SubstitutionModal
        ingredientName={substitutionTarget}
        onClose={() => setSubstitutionTarget(null)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteRecipes}
        onRemoveFavorite={handleToggleFavorite}
        onSelectRecipe={(r) => setSelectedRecipe(r)}
      />

      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        currentIngredients={ingredients}
        onGenerate={handleGenerateRecipes}
        isLoading={isLoadingAI}
      />
    </div>
  );
}
