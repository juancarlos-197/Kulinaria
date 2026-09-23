import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 3000;
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  subtitle: string;
  cookTimeMinutes: number;
  prepTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'Muy Fácil' | 'Fácil' | 'Media';
  category: string;
  description: string;
  matchedIngredientsCount: number;
  ingredients: {
    name: string;
    amount: string;
    isUserIngredient: boolean;
    isPantryStaple: boolean;
  }[];
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    tip?: string;
    durationMinutes?: number;
  }[];
  nutrition?: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  tags: string[];
  chefTips: string[];
  equipment: string[];
}

// Endpoint to generate smart recipes based on ingredients
app.post('/api/recipes/generate', async (req, res) => {
  try {
    const {
      ingredients = [],
      timeLimit = 'Cualquiera',
      mealType = 'Cualquiera',
      difficulty = 'Fácil',
      dietary = [],
      servings = 2,
    } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Por favor proporciona al menos un ingrediente.' });
    }

    if (!ai) {
      // Offline / Keyless fallback generator
      const fallbackRecipes = generateFallbackRecipes(ingredients, servings, timeLimit);
      return res.json({ recipes: fallbackRecipes, isAIGenerated: false });
    }

    const prompt = `Eres un chef profesional especializado en cocina casera, rápida, accesible y sin complicaciones.
El usuario tiene en su casa estos ingredientes disponibles: ${ingredients.join(', ')}.
Condiciones del usuario:
- Tiempo estimado deseado: ${timeLimit}
- Tipo de comida: ${mealType}
- Dificultad deseada: ${difficulty}
- Preferencias / Dietas: ${dietary.length > 0 ? dietary.join(', ') : 'Sin restricciones especiales'}
- Porciones base: ${servings}

Genera 2 o 3 recetas distintas, deliciosas, 100% realistas y fáciles de cocinar que aprovechen al máximo los ingredientes que tiene el usuario.
Solo puedes añadir condimentos o básicos comunes de despensa (sal, pimienta, aceite, agua, ajo, vinagre o un toque de mantequilla) si es estrictamente necesario, indicando claramente cuáles son básicos de despensa.

Responde ÚNICAMENTE con un JSON válido con el siguiente esquema:
{
  "recipes": [
    {
      "id": "cadena-unica-corta",
      "title": "Nombre de la receta en español",
      "subtitle": "Breve frase descriptiva y apetitosa (1 línea)",
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "totalTimeMinutes": 25,
      "servings": ${servings},
      "difficulty": "Muy Fácil" | "Fácil" | "Media",
      "category": "Almuerzo" | "Cena" | "Desayuno" | "Snack",
      "description": "Descripción clara del plato y por qué funciona bien con estos ingredientes.",
      "ingredients": [
        {
          "name": "Nombre del ingrediente",
          "amount": "Cantidad (ej: 2 unidades, 1 taza, 1 cda)",
          "isUserIngredient": true/false (true si proviene de los ingredientes que el usuario ingresó),
          "isPantryStaple": true/false (true si es sal, aceite, pimienta o agua)
        }
      ],
      "steps": [
        {
          "stepNumber": 1,
          "title": "Título corto del paso",
          "instruction": "Instrucción clara, precisa y a prueba de errores para principiantes.",
          "tip": "Consejo opcional del chef para este paso",
          "durationMinutes": 5
        }
      ],
      "nutrition": {
        "calories": 380,
        "proteinGrams": 18,
        "carbsGrams": 40,
        "fatGrams": 14
      },
      "tags": ["Rápido", "Económico", "Saludable"],
      "chefTips": [
        "Consejo de sustitución o truco para mejorar el sabor"
      ],
      "equipment": ["Sartén", "Cuchillo", "Tabla de cortar"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const rawText = response.text || '';
    let parsedData: { recipes: GeneratedRecipe[] };

    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Strip markdown code block if present
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Enhance and validate
    const enrichedRecipes = (parsedData.recipes || []).map((r, index) => {
      const userIngredientsMatch = r.ingredients.filter((ing) => ing.isUserIngredient).length;
      return {
        ...r,
        id: r.id || `receta-gen-${Date.now()}-${index}`,
        matchedIngredientsCount: userIngredientsMatch,
        totalTimeMinutes: r.totalTimeMinutes || (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0),
      };
    });

    return res.json({
      recipes: enrichedRecipes,
      isAIGenerated: true,
    });
  } catch (error: any) {
    console.error('Error generating recipes with Gemini:', error);
    // Graceful fallback to guarantee the user always receives recipes
    const { ingredients = [], servings = 2, timeLimit = 'Cualquiera' } = req.body || {};
    const fallbackRecipes = generateFallbackRecipes(ingredients, servings, timeLimit);
    return res.json({
      recipes: fallbackRecipes,
      isAIGenerated: false,
      notice: 'Modo sin conexión activo: sugerencias creadas con el motor culinario local.',
    });
  }
});

// Endpoint to find ingredient substitutions
app.post('/api/recipes/substitute', async (req, res) => {
  try {
    const { ingredient = '' } = req.body;
    if (!ingredient.trim()) {
      return res.status(400).json({ error: 'Ingrediente no especificado' });
    }

    if (!ai) {
      return res.json({
        substitutions: [
          `Alternativa común para ${ingredient}: verifica tu despensa o especias equivalentes.`,
        ],
      });
    }

    const prompt = `Proporciona 3 alternativas o sustitutos cotidianos y fáciles para el ingrediente "${ingredient}" en cocina casera.
Responde estrictamente en JSON con la propiedad "substitutions" como un arreglo de cadenas explicativas de 1 o 2 oraciones en español.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{"substitutions":[]}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in substitution API:', err);
    res.json({
      substitutions: [
        `Puedes omitirlo o probar con un aceite vegetal, hierba aromática o condimento afín según la preparación.`,
      ],
    });
  }
});

// Helper for local fallback generation
function generateFallbackRecipes(userIngredients: string[], servings: number, timeLimit: string): GeneratedRecipe[] {
  const ingListLower = userIngredients.map((i) => i.toLowerCase().trim());
  const mainIng = ingListLower.slice(0, 3).join(', ');

  return [
    {
      id: `fallback-revuelto-${Date.now()}`,
      title: `Salteado Rápido Dorado con ${userIngredients[0] || 'Ingredientes Frescos'}`,
      subtitle: 'Una preparación sabrosa en una sola sartén lista en 15 minutos',
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      totalTimeMinutes: 15,
      servings,
      difficulty: 'Muy Fácil',
      category: 'Almuerzo / Cena',
      description: `Un plato reconfortante y versátil que aprovecha ${mainIng || 'lo que tienes a mano'}, salteado con un toque de ajo y especias.`,
      matchedIngredientsCount: userIngredients.length,
      ingredients: [
        ...userIngredients.map((ing) => ({
          name: ing,
          amount: 'Al gusto o porción moderada',
          isUserIngredient: true,
          isPantryStaple: false,
        })),
        {
          name: 'Aceite de oliva o vegetal',
          amount: '1 cucharada',
          isUserIngredient: false,
          isPantryStaple: true,
        },
        {
          name: 'Sal y pimienta negra',
          amount: 'Al gusto',
          isUserIngredient: false,
          isPantryStaple: true,
        },
        {
          name: 'Diente de ajo picado',
          amount: '1 unidad',
          isUserIngredient: false,
          isPantryStaple: true,
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Alistar y cortar',
          instruction: `Lava y corta ${mainIng} en bocados homogéneos para que se cocinen al mismo tiempo.`,
          durationMinutes: 4,
          tip: 'Cuanto más uniformes sean los cortes, mejor se dorarán.',
        },
        {
          stepNumber: 2,
          title: 'Calentar la sartén y aromatizar',
          instruction: 'Pon una sartén a fuego medio-alto con la cucharada de aceite. Añade el ajo y deja que perfume el aceite durante 30 segundos sin que se queme.',
          durationMinutes: 1,
        },
        {
          stepNumber: 3,
          title: 'Saltear los ingredientes principales',
          instruction: `Incorpora ${mainIng}. Saltea removiendo constantemente de 5 a 7 minutos hasta que estén tiernos y ligeramente dorados.`,
          durationMinutes: 6,
          tip: 'No satures la sartén para que doren en vez de hervirse.',
        },
        {
          stepNumber: 4,
          title: 'Sazonar y servir',
          instruction: 'Añade una pizca de sal, pimienta molida y sirve de inmediato caliente.',
          durationMinutes: 1,
        },
      ],
      nutrition: {
        calories: 290,
        proteinGrams: 12,
        carbsGrams: 22,
        fatGrams: 16,
      },
      tags: ['15 Minutos', 'En Sartén', 'Fácil'],
      chefTips: [
        'Puedes añadir unas gotas de limón o salsa de soja al final para realzar los sabores.',
      ],
      equipment: ['Sartén antiadherente', 'Tabla de picar', 'Espátula'],
    },
    {
      id: `fallback-horno-${Date.now()}`,
      title: `Cazuela Rustica Express de ${userIngredients[0] || 'Despensa'}`,
      subtitle: 'Mezcla cremosa y gratinada o a la plancha de cocción sencilla',
      prepTimeMinutes: 8,
      cookTimeMinutes: 12,
      totalTimeMinutes: 20,
      servings,
      difficulty: 'Fácil',
      category: 'Cena',
      description: 'Aprovecha tus ingredientes combinándolos con una cocción suave que resalta su textura y sabor natural.',
      matchedIngredientsCount: userIngredients.length,
      ingredients: [
        ...userIngredients.map((ing) => ({
          name: ing,
          amount: 'Porción al gusto',
          isUserIngredient: true,
          isPantryStaple: false,
        })),
        {
          name: 'Aceite o mantequilla',
          amount: '1 cucharadita',
          isUserIngredient: false,
          isPantryStaple: true,
        },
        {
          name: 'Hierbas secas (orégano o tomillo)',
          amount: '1 pizca',
          isUserIngredient: false,
          isPantryStaple: true,
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Preparación base',
          instruction: 'Precalienta una sartén o plancha a fuego medio con la mantequilla o aceite.',
          durationMinutes: 2,
        },
        {
          stepNumber: 2,
          title: 'Cocción suave',
          instruction: `Añade tus ingredientes (${mainIng}) cortados en láminas o cubos. Tapa durante 6 minutos para que se cocinen con su propio vapor.`,
          durationMinutes: 6,
        },
        {
          stepNumber: 3,
          title: 'Toque final aromático',
          instruction: 'Destapa, espolvorea las hierbas secas, remueve 2 minutos para que doren y retira del fuego.',
          durationMinutes: 2,
        },
      ],
      nutrition: {
        calories: 320,
        proteinGrams: 14,
        carbsGrams: 28,
        fatGrams: 15,
      },
      tags: ['Saludable', 'Sencillo'],
      chefTips: ['Si tienes queso rallado o huevo, agrégalo en el último minuto para un acabado cremoso.'],
      equipment: ['Sartén con tapa', 'Cuchillo'],
    },
  ];
}

// Dev mode Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Kulinaria App server running on http://0.0.0.0:${port}`);
  });
}

startServer();
