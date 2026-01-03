import FloorPlan from './FloorPlan';
import { roomColors } from '../data/layoutTemplates';
import { getAreaRecommendation } from '../utils/layoutGenerator';

export default function LayoutDetail({ template, area }) {
  const recommendation = getAreaRecommendation(template, area);
  
  return (
    <div className="mt-8 card-glass rounded-2xl p-6 animate-fade-in">
      <h3 className="text-xl font-semibold text-white mb-4">
        Детальный просмотр: {template.name}
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Floor plan */}
        <div className="flex justify-center">
          <FloorPlan 
            template={template} 
            area={area} 
            svgWidth={550} 
            svgHeight={450}
            compact={false}
          />
        </div>
        
        {/* Details panel */}
        <div>
          <AreaDistribution template={template} area={area} />
          <Recommendation text={recommendation} />
        </div>
      </div>
    </div>
  );
}

function AreaDistribution({ template, area }) {
  return (
    <div>
      <h4 className="text-sm text-gray-400 font-mono mb-3">
        Распределение площади
      </h4>
      <div className="space-y-2">
        {template.rooms.map((room, i) => (
          <RoomRow key={i} room={room} area={area} />
        ))}
      </div>
    </div>
  );
}

function RoomRow({ room, area }) {
  const colors = roomColors[room.color];
  const roomArea = area * room.areaRatio;
  const percentage = (room.areaRatio * 100).toFixed(0);
  
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-3 h-3 rounded flex-shrink-0"
        style={{ backgroundColor: colors?.stroke || '#666' }}
      />
      <span className="text-sm text-gray-300 flex-1">{room.name}</span>
      <span className="text-sm font-mono text-cyan-400">
        {roomArea.toFixed(1).replace('.', ',')} м²
      </span>
      <span className="text-xs font-mono text-gray-500 w-12 text-right">
        {percentage}%
      </span>
    </div>
  );
}

function Recommendation({ text }) {
  return (
    <div className="mt-6 p-4 bg-cyan-400/10 rounded-lg border border-cyan-400/30">
      <div className="text-xs text-cyan-400 font-mono mb-1">РЕКОМЕНДАЦИЯ</div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}
