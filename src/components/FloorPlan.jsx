import { useMemo } from 'react';
import { generateLayoutGeometry } from '../utils/layoutGenerator';
import { roomColors } from '../data/layoutTemplates';

export default function FloorPlan({ template, area, svgWidth = 500, svgHeight = 400, compact = false }) {
  const geometry = useMemo(() => 
    generateLayoutGeometry(template, area, svgWidth, svgHeight),
    [template, area, svgWidth, svgHeight]
  );
  
  return (
    <svg 
      width={svgWidth} 
      height={svgHeight} 
      className="blueprint-grid rounded-lg"
      role="img"
      aria-label={`Планировка ${template.name}, ${area} м²`}
    >
      {/* Внешний контур */}
      <path
        d={geometry.outerPath}
        fill="none"
        stroke="#4a90d9"
        strokeWidth="3"
        className="glow animate-draw"
      />
      
      {/* Комнаты */}
      {geometry.rooms.map((room, i) => (
        <Room 
          key={`${room.type}-${i}`} 
          room={room} 
          index={i}
          compact={compact}
          totalArea={area}
        />
      ))}
      
      {/* Общая площадь */}
      {!compact && (
        <text
          x={svgWidth / 2}
          y={svgHeight - 12}
          textAnchor="middle"
          fill="#00d4ff"
          fontFamily="JetBrains Mono, monospace"
          fontSize="14"
          fontWeight="600"
        >
          Общая площадь: {area.toFixed(2).replace('.', ',')} м²
        </text>
      )}
    </svg>
  );
}

function Room({ room, index, compact, totalArea }) {
  const colors = roomColors[room.color] || { fill: 'rgba(100, 100, 100, 0.1)', stroke: '#666' };
  
  // Реальные размеры комнаты: длина (горизонталь) × ширина (вертикаль)
  const roomDimensions = useMemo(() => {
    // Вычисляем реальные метры на основе пропорций SVG и площади
    const svgArea = room.width * room.height;
    const realArea = room.area;
    
    // Коэффициент масштаба: сколько реальных м² в одном SVG-пикселе²
    const scale = Math.sqrt(realArea / svgArea);
    
    // Реальные размеры в метрах
    const realLength = room.width * scale; // горизонталь
    const realWidth = room.height * scale; // вертикаль
    
    return {
      length: realLength.toFixed(1).replace('.', ','), // горизонталь
      width: realWidth.toFixed(1).replace('.', ',')    // вертикаль
    };
  }, [room.area, room.width, room.height]);

  // Центр для текста
  const center = room.center || { 
    x: room.x + room.width / 2, 
    y: room.y + room.height / 2 
  };
  
  // Определяем размер шрифта в зависимости от размера комнаты
  const minDimension = Math.min(room.width, room.height);
  const fontSize = {
    label: Math.max(8, Math.min(12, minDimension / 8)),
    area: Math.max(7, Math.min(11, minDimension / 9)),
    dimensions: Math.max(6, Math.min(10, minDimension / 10))
  };
  
  // Скрываем текст если комната слишком маленькая
  const showLabel = minDimension > 35;
  const showArea = minDimension > 30;
  const showDimensions = minDimension > 45;
  
  return (
    <g 
      className="animate-fade-in" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Фон комнаты */}
      {room.path ? (
        <path
          d={room.path}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
      ) : (
        <rect
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          rx="2"
        />
      )}
      
      {/* Название комнаты */}
      {showLabel && (
        <text
          x={center.x}
          y={center.y - (showDimensions ? 10 : 4)}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.85)"
          fontFamily="JetBrains Mono, monospace"
          fontSize={fontSize.label}
          fontWeight="500"
        >
          {room.name}
        </text>
      )}
      
      {/* Площадь */}
      {showArea && (
        <text
          x={center.x}
          y={center.y + (showLabel ? 6 : 0)}
          textAnchor="middle"
          fill="rgba(0, 212, 255, 0.95)"
          fontFamily="JetBrains Mono, monospace"
          fontSize={fontSize.area}
          fontWeight="500"
        >
          {room.area.toFixed(1).replace('.', ',')} м²
        </text>
      )}
      
      {/* Размеры: длина (гориз.) × ширина (верт.) */}
      {showDimensions && !compact && (
        <text
          x={center.x}
          y={center.y + 20}
          textAnchor="middle"
          fill="rgba(0, 212, 255, 0.7)"
          fontFamily="JetBrains Mono, monospace"
          fontSize={fontSize.dimensions}
        >
          {roomDimensions.length}×{roomDimensions.width}
        </text>
      )}
    </g>
  );
}
