// База данных планировок на основе анализа проектов Казанских застройщиков
// (Ак Барс Дом, Суварстроит, Унистрой)

export const layoutTemplates = {
  studio: [
    {
      id: 'studio-linear',
      name: 'Линейная студия',
      description: 'Классическая вытянутая планировка',
      minArea: 18,
      maxArea: 32,
      optimalArea: 24,
      aspectRatio: 2.2,
      rooms: [
        { type: 'main', name: 'Жилая зона', areaRatio: 0.65, color: 'living' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.0, color: 'kitchen', integrated: true },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.15, color: 'bathroom' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.12, color: 'hallway' },
        { type: 'balcony', name: 'Балкон', areaRatio: 0.08, color: 'balcony' },
      ],
      layout: 'linear'
    },
    {
      id: 'studio-square',
      name: 'Квадратная студия',
      description: 'Компактная квадратная форма',
      minArea: 20,
      maxArea: 35,
      optimalArea: 26,
      aspectRatio: 1.3,
      rooms: [
        { type: 'main', name: 'Жилая зона', areaRatio: 0.60, color: 'living' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.0, color: 'kitchen', integrated: true },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.18, color: 'bathroom' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.14, color: 'hallway' },
        { type: 'balcony', name: 'Лоджия', areaRatio: 0.08, color: 'balcony' },
      ],
      layout: 'square'
    },
    {
      id: 'studio-euro',
      name: 'Евро-студия',
      description: 'С выделенной спальной нишей',
      minArea: 25,
      maxArea: 38,
      optimalArea: 30,
      aspectRatio: 1.6,
      rooms: [
        { type: 'living', name: 'Гостиная-кухня', areaRatio: 0.50, color: 'living' },
        { type: 'bedroom', name: 'Спальная ниша', areaRatio: 0.22, color: 'bedroom' },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.14, color: 'bathroom' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.08, color: 'hallway' },
        { type: 'balcony', name: 'Балкон', areaRatio: 0.06, color: 'balcony' },
      ],
      layout: 'euro'
    }
  ],
  '1room': [
    {
      id: '1room-classic',
      name: 'Классическая 1К',
      description: 'Раздельные комнаты, изолированная кухня',
      minArea: 32,
      maxArea: 48,
      optimalArea: 38,
      aspectRatio: 1.5,
      rooms: [
        { type: 'living', name: 'Комната', areaRatio: 0.42, color: 'living' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.22, color: 'kitchen' },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.12, color: 'bathroom' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.14, color: 'hallway' },
        { type: 'balcony', name: 'Балкон', areaRatio: 0.10, color: 'balcony' },
      ],
      layout: 'classic-1'
    },
    {
      id: '1room-euro',
      name: 'Евро-однушка',
      description: 'Кухня-гостиная + изолированная спальня',
      minArea: 35,
      maxArea: 52,
      optimalArea: 42,
      aspectRatio: 1.4,
      rooms: [
        { type: 'kitchen-living', name: 'Кухня-гостиная', areaRatio: 0.38, color: 'kitchen' },
        { type: 'bedroom', name: 'Спальня', areaRatio: 0.30, color: 'bedroom' },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.12, color: 'bathroom' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.12, color: 'hallway' },
        { type: 'balcony', name: 'Лоджия', areaRatio: 0.08, color: 'balcony' },
      ],
      layout: 'euro-1'
    },
    {
      id: '1room-linear',
      name: 'Линейная 1К',
      description: 'Вытянутая планировка с панорамным остеклением',
      minArea: 36,
      maxArea: 50,
      optimalArea: 40,
      aspectRatio: 2.0,
      rooms: [
        { type: 'living', name: 'Комната', areaRatio: 0.40, color: 'living' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.24, color: 'kitchen' },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.10, color: 'bathroom' },
        { type: 'hallway', name: 'Коридор', areaRatio: 0.16, color: 'hallway' },
        { type: 'balcony', name: 'Балкон', areaRatio: 0.10, color: 'balcony' },
      ],
      layout: 'linear-1'
    }
  ],
  '2room': [
    {
      id: '2room-classic',
      name: 'Классическая 2К',
      description: 'Две изолированные комнаты',
      minArea: 48,
      maxArea: 70,
      optimalArea: 56,
      aspectRatio: 1.4,
      rooms: [
        { type: 'living', name: 'Гостиная', areaRatio: 0.28, color: 'living' },
        { type: 'bedroom', name: 'Спальня', areaRatio: 0.24, color: 'bedroom' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.18, color: 'kitchen' },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.10, color: 'bathroom' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.12, color: 'hallway' },
        { type: 'balcony', name: 'Лоджия', areaRatio: 0.08, color: 'balcony' },
      ],
      layout: 'classic-2'
    },
    {
      id: '2room-euro',
      name: 'Евро-двушка',
      description: 'Кухня-гостиная + 2 спальни',
      minArea: 52,
      maxArea: 75,
      optimalArea: 62,
      aspectRatio: 1.5,
      rooms: [
        { type: 'kitchen-living', name: 'Кухня-гостиная', areaRatio: 0.32, color: 'kitchen' },
        { type: 'bedroom1', name: 'Спальня 1', areaRatio: 0.22, color: 'bedroom' },
        { type: 'bedroom2', name: 'Спальня 2', areaRatio: 0.18, color: 'bedroom' },
        { type: 'bathroom', name: 'С/У', areaRatio: 0.10, color: 'bathroom' },
        { type: 'hallway', name: 'Холл', areaRatio: 0.10, color: 'hallway' },
        { type: 'balcony', name: 'Балкон', areaRatio: 0.08, color: 'balcony' },
      ],
      layout: 'euro-2'
    },
    {
      id: '2room-improved',
      name: 'Улучшенная 2К',
      description: 'С гардеробной и двумя санузлами',
      minArea: 58,
      maxArea: 80,
      optimalArea: 68,
      aspectRatio: 1.3,
      rooms: [
        { type: 'living', name: 'Гостиная', areaRatio: 0.25, color: 'living' },
        { type: 'bedroom', name: 'Мастер-спальня', areaRatio: 0.22, color: 'bedroom' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.18, color: 'kitchen' },
        { type: 'bathroom1', name: 'Ванная', areaRatio: 0.08, color: 'bathroom' },
        { type: 'bathroom2', name: 'Гостевой С/У', areaRatio: 0.05, color: 'bathroom' },
        { type: 'wardrobe', name: 'Гардеробная', areaRatio: 0.06, color: 'hallway' },
        { type: 'hallway', name: 'Прихожая', areaRatio: 0.10, color: 'hallway' },
        { type: 'balcony', name: 'Лоджия', areaRatio: 0.06, color: 'balcony' },
      ],
      layout: 'improved-2'
    }
  ],
  '3room': [
    {
      id: '3room-classic',
      name: 'Классическая 3К',
      description: 'Три изолированные комнаты',
      minArea: 68,
      maxArea: 95,
      optimalArea: 78,
      aspectRatio: 1.4,
      rooms: [
        { type: 'living', name: 'Гостиная', areaRatio: 0.22, color: 'living' },
        { type: 'bedroom1', name: 'Спальня', areaRatio: 0.18, color: 'bedroom' },
        { type: 'bedroom2', name: 'Детская', areaRatio: 0.16, color: 'bedroom' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.16, color: 'kitchen' },
        { type: 'bathroom1', name: 'Ванная', areaRatio: 0.07, color: 'bathroom' },
        { type: 'bathroom2', name: 'С/У', areaRatio: 0.04, color: 'bathroom' },
        { type: 'hallway', name: 'Коридор', areaRatio: 0.11, color: 'hallway' },
        { type: 'balcony', name: 'Лоджия', areaRatio: 0.06, color: 'balcony' },
      ],
      layout: 'classic-3'
    },
    {
      id: '3room-euro',
      name: 'Евро-трёшка',
      description: 'Кухня-гостиная + 3 спальни',
      minArea: 72,
      maxArea: 100,
      optimalArea: 85,
      aspectRatio: 1.5,
      rooms: [
        { type: 'kitchen-living', name: 'Кухня-гостиная', areaRatio: 0.26, color: 'kitchen' },
        { type: 'bedroom1', name: 'Мастер', areaRatio: 0.18, color: 'bedroom' },
        { type: 'bedroom2', name: 'Спальня 2', areaRatio: 0.14, color: 'bedroom' },
        { type: 'bedroom3', name: 'Спальня 3', areaRatio: 0.14, color: 'bedroom' },
        { type: 'bathroom1', name: 'Мастер С/У', areaRatio: 0.06, color: 'bathroom' },
        { type: 'bathroom2', name: 'Общий С/У', areaRatio: 0.05, color: 'bathroom' },
        { type: 'hallway', name: 'Холл', areaRatio: 0.10, color: 'hallway' },
        { type: 'balcony', name: 'Терраса', areaRatio: 0.07, color: 'balcony' },
      ],
      layout: 'euro-3'
    },
    {
      id: '3room-family',
      name: 'Семейная 3К',
      description: 'С кабинетом и двумя санузлами',
      minArea: 80,
      maxArea: 110,
      optimalArea: 92,
      aspectRatio: 1.3,
      rooms: [
        { type: 'living', name: 'Гостиная', areaRatio: 0.20, color: 'living' },
        { type: 'bedroom1', name: 'Мастер-спальня', areaRatio: 0.16, color: 'bedroom' },
        { type: 'bedroom2', name: 'Детская', areaRatio: 0.14, color: 'bedroom' },
        { type: 'office', name: 'Кабинет', areaRatio: 0.10, color: 'bedroom' },
        { type: 'kitchen', name: 'Кухня', areaRatio: 0.14, color: 'kitchen' },
        { type: 'bathroom1', name: 'Ванная', areaRatio: 0.06, color: 'bathroom' },
        { type: 'bathroom2', name: 'С/У', areaRatio: 0.04, color: 'bathroom' },
        { type: 'wardrobe', name: 'Гардеробная', areaRatio: 0.04, color: 'hallway' },
        { type: 'hallway', name: 'Коридор', areaRatio: 0.08, color: 'hallway' },
        { type: 'balcony', name: 'Лоджия', areaRatio: 0.04, color: 'balcony' },
      ],
      layout: 'family-3'
    }
  ]
};

// Типы комнат с их характеристиками
export const roomTypes = [
  { id: 'studio', name: 'Студия', icon: '◻', minArea: 18, maxArea: 38 },
  { id: '1room', name: '1-комн', icon: '▢', minArea: 32, maxArea: 52 },
  { id: '2room', name: '2-комн', icon: '▣', minArea: 48, maxArea: 80 },
  { id: '3room', name: '3-комн', icon: '⊞', minArea: 68, maxArea: 110 },
];

// Цветовая схема для разных типов помещений
export const roomColors = {
  living: { fill: 'rgba(100, 200, 255, 0.2)', stroke: '#64c8ff', name: 'Жилая' },
  bedroom: { fill: 'rgba(147, 112, 219, 0.2)', stroke: '#9370db', name: 'Спальня' },
  kitchen: { fill: 'rgba(255, 182, 100, 0.2)', stroke: '#ffb664', name: 'Кухня' },
  bathroom: { fill: 'rgba(100, 220, 200, 0.2)', stroke: '#64dcc8', name: 'Санузел' },
  hallway: { fill: 'rgba(180, 180, 180, 0.15)', stroke: '#b4b4b4', name: 'Коридор' },
  balcony: { fill: 'rgba(144, 238, 144, 0.2)', stroke: '#90ee90', name: 'Балкон' },
};
