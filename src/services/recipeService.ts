import { Recipe, RecipeIngredient } from '../types/recipe';
import { CURATED_RECIPES } from '../data/curatedRecipes';

export interface CommonIngredientItem {
  name: string;
  category: 'frescos' | 'proteinas' | 'granos' | 'lacteos' | 'despensa';
  icon?: string;
}

export const COMMON_INGREDIENTS: CommonIngredientItem[] = [
  { name: 'Huevo', category: 'proteinas' },
  { name: 'Tomate', category: 'frescos' },
  { name: 'Cebolla', category: 'frescos' },
  { name: 'Ajo', category: 'frescos' },
  { name: 'Patatas', category: 'frescos' },
  { name: 'Arroz', category: 'granos' },
  { name: 'Pasta', category: 'granos' },
  { name: 'Queso', category: 'lacteos' },
  { name: 'Leche', category: 'lacteos' },
  { name: 'Espinacas', category: 'frescos' },
  { name: 'Aguacate', category: 'frescos' },
  { name: 'Garbanzos', category: 'granos' },
  { name: 'Atún en lata', category: 'proteinas' },
  { name: 'Pollo', category: 'proteinas' },
  { name: 'Tortillas de trigo', category: 'granos' },
  { name: 'Pan', category: 'granos' },
  { name: 'Champiñones', category: 'frescos' },
  { name: 'Zanahoria', category: 'frescos' },
];

export class RecipeService {
  private static FAVORITES_KEY = 'kulinaria_favorites_v1';
  private static PANTRY_KEY = 'kulinaria_pantry_v1';

  // Normalize string for fuzzy matching (remove accents, lowercase)
  public static normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  // Calculate matching score for a recipe given the user's ingredients
  public static scoreRecipe(recipe: Recipe, userIngredients: string[]): Recipe {
    if (userIngredients.length === 0) {
      return {
        ...recipe,
        matchScore: 100,
        missingIngredients: [],
      };
    }

    const normalizedUser = userIngredients.map(this.normalize);

    // Filter ingredients that are not pure pantry staples (salt, water, pepper)
    const significantIngredients = recipe.ingredients.filter(
      (ing) => !ing.isPantryStaple
    );

    if (significantIngredients.length === 0) {
      return { ...recipe, matchScore: 100, missingIngredients: [] };
    }

    let matchedCount = 0;
    const missing: string[] = [];

    significantIngredients.forEach((ing) => {
      const normIng = this.normalize(ing.name);
      const isMatched = normalizedUser.some(
        (userIng) => normIng.includes(userIng) || userIng.includes(normIng)
      );

      if (isMatched) {
        matchedCount++;
      } else {
        missing.push(ing.name);
      }
    });

    const matchScore = Math.round((matchedCount / significantIngredients.length) * 100);

    return {
      ...recipe,
      matchScore,
      missingIngredients: missing,
    };
  }

  // Get curated recipes scored against user's ingredients
  public static getCuratedRecipes(userIngredients: string[]): Recipe[] {
    return CURATED_RECIPES.map((recipe) => this.scoreRecipe(recipe, userIngredients))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  // Request AI Generated Recipes
  public static async generateRecipesWithAI(params: {
    ingredients: string[];
    timeLimit?: string;
    mealType?: string;
    difficulty?: string;
    dietary?: string[];
    servings?: number;
  }): Promise<{ recipes: Recipe[]; isAIGenerated: boolean }> {
    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Error en servidor: ${response.status}`);
      }

      const data = await response.json();
      const scored = (data.recipes || []).map((r: Recipe) =>
        this.scoreRecipe(r, params.ingredients)
      );

      return {
        recipes: scored,
        isAIGenerated: data.isAIGenerated ?? true,
      };
    } catch (error) {
      console.warn('API error, falling back to client scoring of local database', error);
      const scored = this.getCuratedRecipes(params.ingredients);
      return {
        recipes: scored,
        isAIGenerated: false,
      };
    }
  }

  // Get substitutions for an ingredient
  public static async getSubstitutions(ingredient: string): Promise<string[]> {
    try {
      const response = await fetch('/api/recipes/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.substitutions) && data.substitutions.length > 0) {
          return data.substitutions;
        }
      }
    } catch (err) {
      console.error('Error fetching substitutions:', err);
    }

    // High quality local fallback substitutions
    const norm = this.normalize(ingredient);
    if (norm.includes('huevo')) {
      return [
        'Semillas de lino o chía: 1 cda molida + 3 cdas de agua (ideal para ligar masas).',
        'Puré de manzana o plátano maduro machacado (para postres o tortitas).',
        'Tofu sedoso triturado (para revueltos y consistencias suaves).'
      ];
    }
    if (norm.includes('leche')) {
      return [
        'Bebida vegetal de avena, soja o almendras.',
        'Yogur natural diluido con un par de cucharadas de agua.',
        'Agua tibia con una cucharadita de mantequilla o aceite de oliva.'
      ];
    }
    if (norm.includes('mantequilla')) {
      return [
        'Aceite de oliva virgen extra (usa un 15% menos de cantidad).',
        'Aceite de coco virgen o puré de aguacate en tostadas.'
      ];
    }
    if (norm.includes('queso')) {
      return [
        'Levadura nutricional para sabor umami similar al queso curado.',
        'Tofu sazonado con sal, ajo y limón.',
        'Frutos secos picados (nueces o anacardos tostados) para textura crujiente.'
      ];
    }
    if (norm.includes('cebolla') || norm.includes('ajo')) {
      return [
        'Cebollino o puerro picado en láminas finas.',
        'Ajo o cebolla en polvo (1/4 cdta equivale a 1 diente/cebolla mediana).'
      ];
    }

    return [
      `Puedes omitir ${ingredient} o reemplazarlo por una verdura o condimento de textura similar que tengas a mano.`,
      `Agrega una pizca de especias aromáticas (orégano, pimienta o pimentón) para compensar el sabor.`
    ];
  }

  // Scale recipe quantities based on target servings
  public static scaleRecipeIngredients(
    ingredients: RecipeIngredient[],
    baseServings: number,
    targetServings: number
  ): RecipeIngredient[] {
    if (baseServings <= 0 || targetServings <= 0 || baseServings === targetServings) {
      return ingredients;
    }

    const factor = targetServings / baseServings;

    return ingredients.map((ing) => {
      const amountStr = ing.amount;
      // Match number at beginning of amount
      const match = amountStr.match(/^([\d.,/]+)\s*(.*)$/);
      if (!match) return ing;

      const numPart = match[1];
      const rest = match[2];

      let val = parseFloat(numPart.replace(',', '.'));
      if (isNaN(val)) return ing;

      const scaledVal = val * factor;
      // Format cleanly (e.g. 1.5, 2, 0.5)
      const formattedNum = Number.isInteger(scaledVal)
        ? scaledVal.toString()
        : scaledVal.toFixed(1).replace(/\.0$/, '');

      return {
        ...ing,
        amount: `${formattedNum} ${rest}`.trim(),
      };
    });
  }

  // Favorites Management
  public static getFavorites(): string[] {
    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static toggleFavorite(recipeId: string): boolean {
    try {
      const favs = this.getFavorites();
      const exists = favs.includes(recipeId);
      const updated = exists ? favs.filter((id) => id !== recipeId) : [...favs, recipeId];
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  }

  // Pantry Storage
  public static getSavedPantry(): string[] {
    try {
      const data = localStorage.getItem(this.PANTRY_KEY);
      return data ? JSON.parse(data) : ['Huevo', 'Tomate', 'Ajo', 'Arroz'];
    } catch {
      return ['Huevo', 'Tomate', 'Ajo', 'Arroz'];
    }
  }

  public static savePantry(ingredients: string[]): void {
    try {
      localStorage.setItem(this.PANTRY_KEY, JSON.stringify(ingredients));
    } catch (err) {
      console.error('Error saving pantry to local storage:', err);
    }
  }
}
