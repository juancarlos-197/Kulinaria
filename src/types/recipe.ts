export interface RecipeIngredient {
  name: string;
  amount: string;
  unit?: string;
  isUserIngredient?: boolean;
  isPantryStaple?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  durationMinutes?: number;
}

export interface RecipeNutrition {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'Muy Fácil' | 'Fácil' | 'Media';
  category: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Postre';
  description: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition?: RecipeNutrition;
  tags: string[];
  chefTips: string[];
  equipment: string[];
  imageUrl?: string;
  isAIGenerated?: boolean;
  matchScore?: number; // percentage of ingredients matched (0-100)
  missingIngredients?: string[];
}

export interface RecipeFilters {
  timeLimit: 'all' | '15' | '30' | '45';
  difficulty: 'all' | 'Muy Fácil' | 'Fácil' | 'Media';
  category: 'all' | 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  dietary: string[];
  servings: number;
  onlyFullMatch: boolean;
}
