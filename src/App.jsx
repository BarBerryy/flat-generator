import { useState, useEffect, useMemo } from 'react';
import { 
  Header, 
  Footer, 
  RoomSelector, 
  AreaSlider, 
  LayoutCard, 
  LayoutDetail,
  FloorEditor
} from './components';
import { layoutTemplates, roomTypes } from './data/layoutTemplates';
import { sortTemplatesByRelevance, calculateSuitability } from './utils/layoutGenerator';

export default function App() {
  const [mode, setMode] = useState('floor'); // 'single' или 'floor'
  const [selectedType, setSelectedType] = useState('1room');
  const [area, setArea] = useState(38);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [autoSelect, setAutoSelect] = useState(true);
  
  // Get current room type config
  const currentRoomType = useMemo(() => 
    roomTypes.find(r => r.id === selectedType),
    [selectedType]
  );
  
  // Get templates for selected room type
  const templates = useMemo(() => 
    layoutTemplates[selectedType] || [],
    [selectedType]
  );
  
  // Sort templates by relevance to selected area
  const sortedTemplates = useMemo(() => 
    sortTemplatesByRelevance(templates, area),
    [templates, area]
  );
  
  // Автоматический выбор лучшей планировки
  useEffect(() => {
    if (autoSelect && sortedTemplates.length > 0) {
      const best = sortedTemplates.reduce((best, current) => {
        const bestSuit = calculateSuitability(best, area);
        const currentSuit = calculateSuitability(current, area);
        return currentSuit.score > bestSuit.score ? current : best;
      }, sortedTemplates[0]);
      
      setSelectedLayout(best);
    }
  }, [area, sortedTemplates, autoSelect]);
  
  // Reset area and selection when room type changes
  useEffect(() => {
    if (currentRoomType) {
      const midArea = Math.round(
        (currentRoomType.minArea + 
        (currentRoomType.maxArea - currentRoomType.minArea) / 2) * 100
      ) / 100;
      setArea(midArea);
      setAutoSelect(true);
    }
  }, [selectedType, currentRoomType]);
  
  const handleLayoutSelect = (template) => {
    if (selectedLayout?.id === template.id) {
      setAutoSelect(true);
    } else {
      setAutoSelect(false);
      setSelectedLayout(template);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        {/* Переключатель режимов */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-gray-800/50 p-1 border border-gray-700/50">
            <button
              onClick={() => setMode('floor')}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${mode === 'floor' 
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              🏢 Этаж (4 квартиры)
            </button>
            <button
              onClick={() => setMode('single')}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${mode === 'single' 
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              🏠 Одна квартира
            </button>
          </div>
        </div>
        
        {mode === 'floor' ? (
          <FloorEditor />
        ) : (
          <>
            {/* Controls */}
            <div className="card-glass rounded-2xl p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <RoomSelector 
                  selectedType={selectedType} 
                  onSelect={setSelectedType} 
                />
                <AreaSlider
                  value={area}
                  min={currentRoomType?.minArea || 20}
                  max={currentRoomType?.maxArea || 100}
                  onChange={setArea}
                />
              </div>
              
              {/* Auto-select indicator */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setAutoSelect(!autoSelect)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-mono transition-all
                    ${autoSelect 
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50' 
                      : 'bg-gray-700/30 text-gray-400 border border-gray-600/50 hover:border-gray-500'
                    }
                  `}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${autoSelect ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'}`} />
                  Автоподбор планировки
                </button>
              </div>
            </div>
            
            {/* Layouts section header */}
            <div className="mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-cyan-400 rounded-full" />
              <h2 className="text-xl font-semibold text-white">
                {autoSelect ? 'Рекомендуемые планировки' : 'Выбранная планировка'}
              </h2>
              <span className="text-sm text-gray-400 ml-2 font-mono">
                ({sortedTemplates.length} вариантов)
              </span>
            </div>
            
            {/* Layouts grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedTemplates.map(template => (
                <LayoutCard
                  key={template.id}
                  template={template}
                  area={area}
                  isSelected={selectedLayout?.id === template.id}
                  onClick={() => handleLayoutSelect(template)}
                />
              ))}
            </div>
            
            {/* Selected layout detail view */}
            {selectedLayout && (
              <LayoutDetail 
                template={selectedLayout} 
                area={area} 
              />
            )}
          </>
        )}
        
        <Footer />
      </div>
    </div>
  );
}
