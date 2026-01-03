import { useMemo } from 'react';
import FloorPlan from './FloorPlan';
import { calculateSuitability } from '../utils/layoutGenerator';

export default function LayoutCard({ template, area, isSelected, onClick }) {
  const suitability = useMemo(() => 
    calculateSuitability(template, area),
    [template, area]
  );
  
  return (
    <div
      onClick={onClick}
      className={`
        card-glass rounded-xl p-5 cursor-pointer 
        transition-all duration-300 hover:scale-[1.02]
        ${isSelected 
          ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20' 
          : 'hover:border-cyan-400/40'
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-pressed={isSelected}
      aria-label={`${template.name} - ${suitability.text}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white">{template.name}</h3>
          <p className="text-xs text-gray-400">{template.description}</p>
        </div>
        <SuitabilityBadge suitability={suitability} />
      </div>
      
      {/* Floor plan preview */}
      <div className="flex justify-center">
        <FloorPlan 
          template={template} 
          area={area} 
          svgWidth={320} 
          svgHeight={280}
          compact={false}
        />
      </div>
      
      {/* Footer */}
      <div className="mt-3 flex justify-between text-xs font-mono text-gray-400">
        <span>{template.minArea}-{template.maxArea} м²</span>
        <span>Оптимум: {template.optimalArea} м²</span>
      </div>
    </div>
  );
}

function SuitabilityBadge({ suitability }) {
  return (
    <div className={`text-xs font-mono ${suitability.color} flex items-center gap-1`}>
      {suitability.inRange && (
        <span 
          className="w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: suitability.score > 80 
              ? '#4ade80' 
              : suitability.score > 50 
                ? '#facc15' 
                : '#fb923c' 
          }}
        />
      )}
      {suitability.text}
    </div>
  );
}
