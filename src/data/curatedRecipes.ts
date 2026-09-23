import { Recipe } from '../types/recipe';

export const CURATED_RECIPES: Recipe[] = [
  {
    id: 'pasta-aglio-pomodoro',
    title: 'Pasta al Ajo, Aceite y Tomatitos',
    subtitle: 'El clásico italiano más rápido y reconfortante en solo 15 minutos',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    servings: 2,
    difficulty: 'Muy Fácil',
    category: 'Almuerzo',
    description: 'Una receta legendaria de la cocina italiana que demuestra que con pocos ingredientes se logra la máxima elegancia. El ajo suavemente dorado en aceite de oliva y la frescura de los tomates crean una salsa sedosa y aromática.',
    imageUrl: '/src/assets/images/recipe_pasta_aglio_1790132041835.jpg',
    ingredients: [
      { name: 'Pasta (espaguetis o la que tengas)', amount: '200g', isPantryStaple: false },
      { name: 'Dientes de ajo', amount: '3 unidades laminadas', isPantryStaple: false },
      { name: 'Tomates cherry o tomate maduro', amount: '150g picados', isPantryStaple: false },
      { name: 'Aceite de oliva virgen extra', amount: '3 cucharadas', isPantryStaple: true },
      { name: 'Sal y pimienta', amount: 'Al gusto', isPantryStaple: true },
      { name: 'Albahaca fresca o perejil', amount: 'Unas hojas (opcional)', isPantryStaple: false },
      { name: 'Parmesano o queso rallado', amount: '2 cucharadas (opcional)', isPantryStaple: false }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Hervir la pasta',
        instruction: 'Pon a hervir abundante agua con una cucharada de sal en una olla. Cuando rompa a hervir, añade la pasta y cocina según el paquete (unos 8-9 minutos al dente). Reserva media taza del agua de cocción antes de escurrir.',
        durationMinutes: 9,
        tip: 'Guardar el agua con almidón de la pasta es el secreto para ligar la salsa.'
      },
      {
        stepNumber: 2,
        title: 'Dorar el ajo suavemente',
        instruction: 'Mientras hierve la pasta, calienta el aceite de oliva en una sartén amplia a fuego medio-bajo. Agrega el ajo laminado y cocina hasta que comience a dorarse ligeramente sin quemarse (unos 2 minutos).',
        durationMinutes: 2,
        tip: 'Si el ajo se quema amarga; mantén el fuego suave y retira momentáneamente si es necesario.'
      },
      {
        stepNumber: 3,
        title: 'Reventar los tomatitos',
        instruction: 'Agrega los tomates cortados a la mitad a la sartén. Sube a fuego medio y cocina durante 3 minutos aplastando suavemente algunos con la cuchara para que suelten su jugo.',
        durationMinutes: 3
      },
      {
        stepNumber: 4,
        title: 'Mantecar y servir',
        instruction: 'Agrega la pasta escurrida a la sartén junto con 3-4 cucharadas del agua de cocción reservada. Saltea todo junto durante 1 minuto a fuego vivo para emulsionar. Decora con albahaca y queso si tienes.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 420,
      proteinGrams: 12,
      carbsGrams: 64,
      fatGrams: 14
    },
    tags: ['Rápido', 'Vegetariano', 'Económico', '15 Min'],
    chefTips: [
      'Si te gusta el picante, añade una pizca de guindilla o chile seco al dorar el ajo.',
      'Puedes sustituir la albahaca por orégano seco o perejil picado.'
    ],
    equipment: ['Olla mediana', 'Sartén amplia', 'Colador', 'Cuchillo de cocina']
  },
  {
    id: 'tortilla-espanola-express',
    title: 'Tortilla de Patatas Fácil y Jugosa',
    subtitle: 'Dorada por fuera y cremosa por dentro, el pilar de la cocina de aprovechamiento',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 2,
    difficulty: 'Fácil',
    category: 'Cena',
    description: 'La reina indiscutible de las cenas sencillas y nutritivas. Con solo huevos, patatas y cebolla opcional, obtienes un plato completo y saciante que gusta a todo el mundo.',
    imageUrl: '/src/assets/images/recipe_tortilla_espanola_1790132059858.jpg',
    ingredients: [
      { name: 'Huevos', amount: '4 unidades', isPantryStaple: false },
      { name: 'Patatas medianas', amount: '2 unidades', isPantryStaple: false },
      { name: 'Cebolla', amount: '1/2 unidad (opcional)', isPantryStaple: false },
      { name: 'Aceite de oliva o vegetal', amount: '4 cucharadas', isPantryStaple: true },
      { name: 'Sal fina', amount: '1 cucharadita', isPantryStaple: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Cortar las patatas',
        instruction: 'Pela las patatas y córtalas en láminas finas e irregulares (panaderas). Pica la cebolla fina si decides usarla.',
        durationMinutes: 5,
        tip: 'Cortar las patatas finas acelera la cocción a menos de la mitad de tiempo.'
      },
      {
        stepNumber: 2,
        title: 'Pochar las patatas y cebolla',
        instruction: 'Calienta el aceite en una sartén antiadherente a fuego medio. Añade las patatas y la cebolla con un toque de sal. Tapa y cocina unos 10-12 minutos removiendo de vez en cuando hasta que estén tiernas.',
        durationMinutes: 11
      },
      {
        stepNumber: 3,
        title: 'Batir y reposar',
        instruction: 'Bate los 4 huevos con una pizca de sal en un bol grande. Escurre las patatas y agrégalas directamente al bol con el huevo batido. Deja reposar la mezcla 2 minutos para que se impregnen bien.',
        durationMinutes: 3,
        tip: 'El reposo de 2 minutos hace que la tortilla quede increíblemente jugosa y uniforme.'
      },
      {
        stepNumber: 4,
        title: 'Cuajar y dar la vuelta',
        instruction: 'Engrasa la sartén con unas gotas de aceite a fuego medio-alto. Vierte la mezcla. Con una espátula bordea los lados durante 2 minutos. Coloca un plato llano encima, dale la vuelta con decisión y cocina el otro lado durante 1 minuto más.',
        durationMinutes: 4
      }
    ],
    nutrition: {
      calories: 340,
      proteinGrams: 16,
      carbsGrams: 28,
      fatGrams: 19
    },
    tags: ['Sin Gluten', 'Vegetariano', 'Tradicional', 'Nutritivo'],
    chefTips: [
      'Si tienes prisa extrema, puedes usar patatas chips de bolsa ligeramente hidratadas con el huevo batido.',
      'Para un punto más cuajado, déjala 1 minuto extra a fuego suave.'
    ],
    equipment: ['Sartén antiadherente (20-22 cm)', 'Plato llano grande', 'Bol grande', 'Cuchillo']
  },
  {
    id: 'shakshuka-express',
    title: 'Shakshuka de Huevos en Sartén',
    subtitle: 'Huevos tiernos escalfados en salsa de tomate y especias con aroma mediterráneo',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    totalTimeMinutes: 17,
    servings: 2,
    difficulty: 'Muy Fácil',
    category: 'Cena',
    description: 'Un plato cálido, vibrante y visualmente espectacular que se prepara en una sola sartén. Los huevos se cocinan lentamente en el vapor de una salsa de tomate reducida con cebolla y pimentón.',
    imageUrl: '/src/assets/images/recipe_shakshuka_express_1790132069384.jpg',
    ingredients: [
      { name: 'Huevos', amount: '3 o 4 unidades', isPantryStaple: false },
      { name: 'Tomate frito o triturado', amount: '1 taza (250g)', isPantryStaple: false },
      { name: 'Cebolla', amount: '1/2 unidad picada', isPantryStaple: false },
      { name: 'Pimiento (rojo o verde)', amount: '1/2 unidad en tiras (opcional)', isPantryStaple: false },
      { name: 'Aceite de oliva', amount: '1 cucharada', isPantryStaple: true },
      { name: 'Pimentón dulce o comino', amount: '1/2 cucharadita', isPantryStaple: true },
      { name: 'Sal y pimienta', amount: 'Al gusto', isPantryStaple: true },
      { name: 'Pan para acompañar', amount: '2 rebanadas', isPantryStaple: false }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sofreír las verduras',
        instruction: 'Calienta el aceite en la sartén a fuego medio. Añade la cebolla y el pimiento con una pizca de sal. Cocina durante 4 minutos hasta que se ablanden.',
        durationMinutes: 4
      },
      {
        stepNumber: 2,
        title: 'Añadir el tomate y especias',
        instruction: 'Vierte el tomate triturado o frito, agrega el pimentón y una pizca de pimienta. Cocina a fuego lento durante 4 minutos para que espese y se concentren los aromas.',
        durationMinutes: 4
      },
      {
        stepNumber: 3,
        title: 'Hacer huecos y añadir huevos',
        instruction: 'Con una cuchara, haz 3 o 4 pequeños hoyos en la salsa. Rompe un huevo en cada hueco con cuidado de no romper la yema. Tapa la sartén y cocina a fuego suave durante 4-5 minutos hasta que la clara esté blanca y la yema aún tierna.',
        durationMinutes: 5,
        tip: 'Tapar la sartén es clave para que la clara cuaje con el calor del vapor sin endurecer la yema.'
      },
      {
        stepNumber: 4,
        title: 'Servir con pan crujiente',
        instruction: 'Retira del fuego, añade un poco de perejil picado o queso si tienes a mano, y sirve directamente en la sartén con pan tostado para mojar.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 310,
      proteinGrams: 18,
      carbsGrams: 22,
      fatGrams: 16
    },
    tags: ['En 1 Sartén', 'Vegetariano', 'Alto en Proteína', 'Cena Ligera'],
    chefTips: [
      'Si tienes queso feta, queso fresco o mozzarella, desmenuza un poco por encima al apagar el fuego.',
      'Es perfecta tanto para un desayuno tardío de fin de semana como para una cena reconfortante.'
    ],
    equipment: ['Sartén con tapa', 'Cuchara de madera']
  },
  {
    id: 'bowl-garbanzos-aguacate',
    title: 'Bowl Nutritivo de Garbanzos y Aguacate',
    subtitle: 'Comida fresca, saciante y sin encender el fuego en menos de 10 minutos',
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    totalTimeMinutes: 8,
    servings: 1,
    difficulty: 'Muy Fácil',
    category: 'Almuerzo',
    description: 'La opción ideal cuando quieres comer sano, rico y no tienes tiempo de cocinar ni ganas de limpiar ollas. Aprovecha los botes de legumbres cocidas que todos tenemos en la despensa.',
    imageUrl: '/src/assets/images/recipe_bowl_saludable_1790132083478.jpg',
    ingredients: [
      { name: 'Garbanzos cocidos (de bote)', amount: '1 taza (200g)', isPantryStaple: false },
      { name: 'Aguacate maduro', amount: '1/2 unidad en rodajas', isPantryStaple: false },
      { name: 'Espinacas frescas o lechuga', amount: '1 puñado abundante', isPantryStaple: false },
      { name: 'Tomate o pepino', amount: '1 unidad en cubos', isPantryStaple: false },
      { name: 'Aceite de oliva virgen extra', amount: '1 cucharada', isPantryStaple: true },
      { name: 'Limón o vinagre', amount: '1 cucharada', isPantryStaple: true },
      { name: 'Semillas o frutos secos', amount: '1 cucharadita (opcional)', isPantryStaple: false },
      { name: 'Sal marina', amount: 'Al gusto', isPantryStaple: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Enjuagar las legumbres',
        instruction: 'Abre el bote de garbanzos cocidos, vierte en un colador y enjuaga con agua fría del grifo durante 20 segundos para eliminar el líquido conservante. Deja escurrir.',
        durationMinutes: 2
      },
      {
        stepNumber: 2,
        title: 'Montar la base vegetal',
        instruction: 'Coloca en el fondo de tu plato hondo las espinacas frescas o la lechuga lavada. Agrega a un lado los garbanzos escurridos.',
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        title: 'Cortar los frescos',
        instruction: 'Corta el aguacate en láminas finas y el tomate en cubos limpios. Distribúyelos con armonía en el plato.',
        durationMinutes: 3
      },
      {
        stepNumber: 4,
        title: 'Aliñar con emulsión rápida',
        instruction: 'En un vasito mezcla el aceite, el zumo de limón y la sal con un tenedor. Vierte sobre todo el bowl y termina con semillas de sésamo o pipas si tienes.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 390,
      proteinGrams: 15,
      carbsGrams: 42,
      fatGrams: 18
    },
    tags: ['Sin Cocción', 'Vegano', 'Rico en Fibra', '< 10 Min'],
    chefTips: [
      'Si prefieres los garbanzos calientes, saltéalos 3 minutos en sartén con una pizca de pimentón o comino antes de añadirlos al bowl.'
    ],
    equipment: ['Colador', 'Bol para servir', 'Cuchillo de cocina']
  },
  {
    id: 'arroz-frito-huevo-express',
    title: 'Arroz Salteado Dorado con Huevo y Ajo',
    subtitle: 'La mejor forma de transformar arroz blanco del día anterior en un manjar',
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    totalTimeMinutes: 13,
    servings: 2,
    difficulty: 'Muy Fácil',
    category: 'Almuerzo',
    description: 'Crujiente, aromático y ultrarrápido. Inspirado en el clásico chahan japonés y el arroz chaufa, utiliza calor alto para tostar el arroz y dejar el huevo tierno.',
    imageUrl: '/src/assets/images/recipe_pasta_aglio_1790132041835.jpg', // safe fallback
    ingredients: [
      { name: 'Arroz blanco cocido (frío)', amount: '2 tazas', isPantryStaple: false },
      { name: 'Huevos', amount: '2 unidades', isPantryStaple: false },
      { name: 'Dientes de ajo picados', amount: '2 unidades', isPantryStaple: false },
      { name: 'Cebolla o cebolleta', amount: '1/2 unidad picada', isPantryStaple: false },
      { name: 'Aceite vegetal', amount: '2 cucharadas', isPantryStaple: true },
      { name: 'Salsa de soja (opcional)', amount: '1 cucharada', isPantryStaple: true },
      { name: 'Sal y pimienta', amount: 'Al gusto', isPantryStaple: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Desgranar el arroz',
        instruction: 'Si el arroz está en un bloque compacto de la nevera, humedécete ligeramente las manos y sepáralo con los dedos para que los granos queden sueltos.',
        durationMinutes: 2
      },
      {
        stepNumber: 2,
        title: 'Revolver los huevos',
        instruction: 'Calienta 1 cucharada de aceite en sartén o wok a fuego alto. Rompe los 2 huevos directamente y remueve enérgicamente durante 30 segundos para que queden en trozos tiernos. Retira a un plato.',
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        title: 'Tostar el arroz',
        instruction: 'En la misma sartén bien caliente, añade la otra cucharada de aceite, el ajo y la cebolla. Saltea 1 minuto. Agrega el arroz y extiéndelo por la sartén para que tome contacto con el calor y se tueste durante 3-4 minutos.',
        durationMinutes: 4
      },
      {
        stepNumber: 4,
        title: 'Unir y sazonar',
        instruction: 'Devuelve los huevos a la sartén, vierte la cucharada de salsa de soja por el borde para que humee, remueve todo junto 1 minuto y sirve caliente.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 360,
      proteinGrams: 11,
      carbsGrams: 52,
      fatGrams: 12
    },
    tags: ['Aprovechamiento', 'Express', 'Económico'],
    chefTips: [
      'El arroz frío de la nevera funciona mucho mejor que el recién hervido porque no tiene exceso de humedad y no se apelmaza.'
    ],
    equipment: ['Sartén o Wok', 'Espátula']
  },
  {
    id: 'quesadilla-dorada-queso-verduras',
    title: 'Quesadillas Crujientes de Verduras',
    subtitle: 'El bocado rápido perfecto con queso fundido y tortitas de trigo o maíz',
    prepTimeMinutes: 5,
    cookTimeMinutes: 6,
    totalTimeMinutes: 11,
    servings: 1,
    difficulty: 'Muy Fácil',
    category: 'Cena',
    description: 'Dorado por fuera, crujiente en los bordes y con un corazón de queso derretido que abraza las verduras que tengas a mano en la nevera.',
    imageUrl: '/src/assets/images/recipe_tortilla_espanola_1790132059858.jpg',
    ingredients: [
      { name: 'Tortillas de trigo o maíz', amount: '2 unidades', isPantryStaple: false },
      { name: 'Queso rallado o en lonchas', amount: '80g (cheddar, mozzarella o tierno)', isPantryStaple: false },
      { name: 'Tomate o champiñones', amount: '1/2 taza en rodajas finas', isPantryStaple: false },
      { name: 'Orégano seco', amount: '1 pizca', isPantryStaple: true },
      { name: 'Aceite o mantequilla', amount: '1/2 cucharadita para untar', isPantryStaple: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Montar la quesadilla',
        instruction: 'Coloca una tortilla en una tabla. Pon una capa de queso, luego las rodajas de tomate o verduras, espolvorea el orégano y cubre con más queso y la segunda tortilla.',
        durationMinutes: 3
      },
      {
        stepNumber: 2,
        title: 'Tostar a fuego suave',
        instruction: 'Calienta una sartén seca a fuego medio-bajo. Coloca la quesadilla. Deja que se dore durante 3 minutos hasta que la base esté crujiente y el queso comience a derretirse.',
        durationMinutes: 3
      },
      {
        stepNumber: 3,
        title: 'Dar la vuelta y cortar',
        instruction: 'Con una espátula ancha, da la vuelta con cuidado. Tuesta otros 2-3 minutos por el otro lado. Pásala a una tabla, deja reposar 1 minuto y córtala en triángulos.',
        durationMinutes: 3
      }
    ],
    nutrition: {
      calories: 380,
      proteinGrams: 17,
      carbsGrams: 34,
      fatGrams: 19
    },
    tags: ['Comfort Food', '10 Minutos', 'Crujiente'],
    chefTips: [
      'Poner queso tanto abajo como arriba actúa como pegamento comestible para que la quesadilla no se desarme al girarla.'
    ],
    equipment: ['Sartén plana', 'Espátula', 'Tabla de cortar']
  }
];
