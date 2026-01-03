import { useState, useMemo } from 'react';
import { layoutTemplates, roomTypes, roomColors } from '../data/layoutTemplates';
import { sortTemplatesByRelevance, calculateSuitability } from '../utils/layoutGenerator';

// ========== АРХИТЕКТУРНЫЕ ЭЛЕМЕНТЫ ==========

// Окно на стене
function Window({ x, y, width, isVertical = false }) {
  if (isVertical) {
    return (
      <g>
        <rect x={x - 2} y={y} width={4} height={width} fill="#0a1628"/>
        <line x1={x} y1={y} x2={x} y2={y + width} stroke="#00d4ff" strokeWidth="2"/>
        <line x1={x - 4} y1={y + 3} x2={x - 4} y2={y + width - 3} stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
        <line x1={x + 4} y1={y + 3} x2={x + 4} y2={y + width - 3} stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y - 2} width={width} height={4} fill="#0a1628"/>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#00d4ff" strokeWidth="2"/>
      <line x1={x + 3} y1={y - 4} x2={x + width - 3} y2={y - 4} stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
      <line x1={x + 3} y1={y + 4} x2={x + width - 3} y2={y + 4} stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
    </g>
  );
}

// Дверь с дугой открывания
function Door({ x, y, width = 22, direction = 'right', isVertical = false }) {
  const r = width * 0.85;
  
  if (isVertical) {
    const arcPath = direction === 'down' 
      ? `M ${x} ${y} L ${x} ${y + width} M ${x} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y + r}`
      : `M ${x} ${y} L ${x} ${y + width} M ${x} ${y + width} A ${r} ${r} 0 0 0 ${x + r} ${y + width - r}`;
    return (
      <g>
        <rect x={x - 3} y={y} width={6} height={width} fill="#0a1628"/>
        <path d={arcPath} fill="none" stroke="#00d4ff" strokeWidth="1.5"/>
        <path d={`M ${x} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y + r}`} fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1" strokeDasharray="4,3"/>
      </g>
    );
  }
  
  const arcPath = direction === 'right'
    ? `M ${x} ${y} L ${x + width} ${y} M ${x} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y - r}`
    : `M ${x} ${y} L ${x + width} ${y} M ${x + width} ${y} A ${r} ${r} 0 0 1 ${x + width - r} ${y - r}`;
  
  return (
    <g>
      <rect x={x} y={y - 3} width={width} height={6} fill="#0a1628"/>
      <path d={`M ${x} ${y} L ${x + width} ${y}`} fill="none" stroke="#00d4ff" strokeWidth="1.5"/>
      <path d={direction === 'right' 
        ? `M ${x} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y - r}`
        : `M ${x + width} ${y} A ${r} ${r} 0 0 1 ${x + width - r} ${y - r}`
      } fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1" strokeDasharray="4,3"/>
    </g>
  );
}

// Ванна
function Bathtub({ x, y, width, height }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="4" fill="rgba(0, 150, 200, 0.1)" stroke="rgba(0, 212, 255, 0.6)" strokeWidth="1.5"/>
      <ellipse cx={x + width - 12} cy={y + height/2} rx="6" ry="4" fill="none" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
      <circle cx={x + width - 12} cy={y + height/2} r="2" fill="rgba(0, 212, 255, 0.4)"/>
    </g>
  );
}

// Душевая кабина
function Shower({ x, y, size }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill="rgba(0, 150, 200, 0.08)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
      <circle cx={x + size/2} cy={y + size/2} r={size * 0.3} fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1"/>
      <circle cx={x + size/2} cy={y + size/2} r="3" fill="rgba(0, 212, 255, 0.4)"/>
    </g>
  );
}

// Унитаз
function Toilet({ x, y, rotation = 0 }) {
  return (
    <g transform={`rotate(${rotation}, ${x + 7}, ${y + 10})`}>
      <rect x={x} y={y} width={14} height={8} rx="2" fill="rgba(200, 200, 200, 0.1)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
      <ellipse cx={x + 7} cy={y + 14} rx="6" ry="7" fill="rgba(200, 200, 200, 0.1)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
    </g>
  );
}

// Раковина
function WashSink({ x, y, isVertical = false }) {
  if (isVertical) {
    return (
      <g>
        <rect x={x} y={y} width={12} height={16} rx="2" fill="rgba(200, 200, 200, 0.1)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
        <ellipse cx={x + 6} cy={y + 9} rx="4" ry="5" fill="none" stroke="rgba(0, 212, 255, 0.4)" strokeWidth="1"/>
        <circle cx={x + 6} cy={y + 9} r="1.5" fill="rgba(0, 212, 255, 0.5)"/>
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={16} height={12} rx="2" fill="rgba(200, 200, 200, 0.1)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
      <ellipse cx={x + 8} cy={y + 6} rx="5" ry="4" fill="none" stroke="rgba(0, 212, 255, 0.4)" strokeWidth="1"/>
      <circle cx={x + 8} cy={y + 6} r="1.5" fill="rgba(0, 212, 255, 0.5)"/>
    </g>
  );
}

// Кухонная плита
function Stove({ x, y, width, height }) {
  const r = Math.min(width, height) * 0.18;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="rgba(255, 150, 50, 0.1)" stroke="rgba(255, 180, 100, 0.6)" strokeWidth="1"/>
      <circle cx={x + width * 0.28} cy={y + height * 0.35} r={r} fill="none" stroke="rgba(255, 180, 100, 0.5)" strokeWidth="1"/>
      <circle cx={x + width * 0.72} cy={y + height * 0.35} r={r} fill="none" stroke="rgba(255, 180, 100, 0.5)" strokeWidth="1"/>
      <circle cx={x + width * 0.28} cy={y + height * 0.7} r={r * 0.8} fill="none" stroke="rgba(255, 180, 100, 0.5)" strokeWidth="1"/>
      <circle cx={x + width * 0.72} cy={y + height * 0.7} r={r * 0.8} fill="none" stroke="rgba(255, 180, 100, 0.5)" strokeWidth="1"/>
    </g>
  );
}

// Кухонная мойка
function KitchenSink({ x, y, width, height }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="3" fill="rgba(100, 150, 200, 0.1)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1"/>
      <rect x={x + 3} y={y + 3} width={width - 6} height={height - 6} rx="2" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1"/>
      <circle cx={x + width/2} cy={y + height/2} r="2" fill="rgba(0, 212, 255, 0.4)"/>
    </g>
  );
}

// Холодильник
function Fridge({ x, y, width, height }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="rgba(150, 150, 150, 0.15)" stroke="rgba(200, 200, 200, 0.5)" strokeWidth="1"/>
      <line x1={x} y1={y + height * 0.35} x2={x + width} y2={y + height * 0.35} stroke="rgba(200, 200, 200, 0.4)" strokeWidth="1"/>
      <rect x={x + width - 4} y={y + height * 0.15} width={2} height={8} fill="rgba(200, 200, 200, 0.4)"/>
      <rect x={x + width - 4} y={y + height * 0.55} width={2} height={12} fill="rgba(200, 200, 200, 0.4)"/>
    </g>
  );
}

// Кровать
function Bed({ x, y, width, height, isDouble = false }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="rgba(180, 130, 255, 0.1)" stroke="rgba(180, 130, 255, 0.5)" strokeWidth="1"/>
      {/* Подушки */}
      <rect x={x + 3} y={y + 3} width={width - 6} height={height * 0.22} rx="2" fill="rgba(180, 130, 255, 0.2)" stroke="rgba(180, 130, 255, 0.4)" strokeWidth="1"/>
      {isDouble && (
        <line x1={x + width/2} y1={y + height * 0.25} x2={x + width/2} y2={y + height - 3} stroke="rgba(180, 130, 255, 0.3)" strokeWidth="1"/>
      )}
    </g>
  );
}

// Диван
function Sofa({ x, y, width, height, backSide = 'left' }) {
  const backW = width * 0.18;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="rgba(100, 180, 255, 0.1)" stroke="rgba(100, 180, 255, 0.5)" strokeWidth="1"/>
      {backSide === 'left' && (
        <rect x={x} y={y} width={backW} height={height} fill="rgba(100, 180, 255, 0.2)" stroke="rgba(100, 180, 255, 0.5)" strokeWidth="1"/>
      )}
      {backSide === 'right' && (
        <rect x={x + width - backW} y={y} width={backW} height={height} fill="rgba(100, 180, 255, 0.2)" stroke="rgba(100, 180, 255, 0.5)" strokeWidth="1"/>
      )}
      {backSide === 'top' && (
        <rect x={x} y={y} width={width} height={backW} fill="rgba(100, 180, 255, 0.2)" stroke="rgba(100, 180, 255, 0.5)" strokeWidth="1"/>
      )}
      {backSide === 'bottom' && (
        <rect x={x} y={y + height - backW} width={width} height={backW} fill="rgba(100, 180, 255, 0.2)" stroke="rgba(100, 180, 255, 0.5)" strokeWidth="1"/>
      )}
    </g>
  );
}

// Обеденный стол
function DiningTable({ x, y, width, height }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="3" fill="rgba(200, 180, 150, 0.15)" stroke="rgba(200, 180, 150, 0.5)" strokeWidth="1"/>
      {/* Стулья */}
      <rect x={x - 8} y={y + height/2 - 6} width={6} height={12} rx="1" fill="none" stroke="rgba(200, 180, 150, 0.4)" strokeWidth="1"/>
      <rect x={x + width + 2} y={y + height/2 - 6} width={6} height={12} rx="1" fill="none" stroke="rgba(200, 180, 150, 0.4)" strokeWidth="1"/>
    </g>
  );
}

// Шкаф
function Wardrobe({ x, y, width, height }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="rgba(150, 120, 90, 0.15)" stroke="rgba(180, 150, 120, 0.5)" strokeWidth="1"/>
      <line x1={x + width/2} y1={y} x2={x + width/2} y2={y + height} stroke="rgba(180, 150, 120, 0.4)" strokeWidth="1"/>
      <circle cx={x + width/2 - 4} cy={y + height/2} r="2" fill="rgba(180, 150, 120, 0.5)"/>
      <circle cx={x + width/2 + 4} cy={y + height/2} r="2" fill="rgba(180, 150, 120, 0.5)"/>
    </g>
  );
}

// ========== ГЕНЕРАЦИЯ КОМНАТ С МЕБЕЛЬЮ ==========

function generateDetailedRooms(template, totalArea, startX, startY, width, height, mirror, entranceSide) {
  const rooms = [];
  const elements = [];
  const gap = 2;
  
  // Группируем комнаты
  const livingRooms = template.rooms.filter(r => 
    ['main', 'living', 'kitchen-living', 'bedroom', 'bedroom1', 'bedroom2', 'bedroom3'].includes(r.type)
  );
  const kitchenRooms = template.rooms.filter(r => ['kitchen'].includes(r.type));
  const serviceRooms = template.rooms.filter(r => 
    ['bathroom', 'bathroom1', 'bathroom2', 'hallway', 'wardrobe'].includes(r.type)
  );
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const mainHeight = height * 0.55;
  const auxHeight = height * 0.27;
  const serviceHeight = height * 0.18;
  
  let currentY = startY;
  
  // === ЖИЛЫЕ КОМНАТЫ (верх) ===
  if (livingRooms.length > 0) {
    const totalRatio = livingRooms.reduce((s, r) => s + r.areaRatio, 0);
    let currentX = startX;
    
    livingRooms.forEach((room, idx) => {
      const w = (room.areaRatio / totalRatio) * width;
      const rx = mirror ? (startX + width - (currentX - startX) - w + gap) : currentX;
      
      rooms.push({
        ...room,
        x: rx,
        y: currentY,
        width: w - gap,
        height: mainHeight - gap,
        area: totalArea * room.areaRatio
      });
      
      // Окна на внешней стене
      const winW = Math.min(35, (w - gap) * 0.4);
      elements.push({ type: 'window', x: rx + (w - gap)/2 - winW/2, y: currentY, width: winW, isVertical: false });
      
      // Мебель
      if (room.type === 'bedroom' || room.type === 'bedroom1') {
        const bedW = Math.min(55, (w - gap) * 0.55);
        const bedH = Math.min(40, mainHeight * 0.4);
        elements.push({ type: 'bed', x: rx + (w - gap)/2 - bedW/2, y: currentY + 25, width: bedW, height: bedH, isDouble: true });
        elements.push({ type: 'wardrobe', x: rx + 8, y: currentY + mainHeight - gap - 35, width: Math.min(45, (w-gap)*0.4), height: 25 });
      } else if (room.type === 'bedroom2' || room.type === 'bedroom3') {
        const bedW = Math.min(40, (w - gap) * 0.5);
        const bedH = Math.min(30, mainHeight * 0.35);
        elements.push({ type: 'bed', x: rx + (w - gap)/2 - bedW/2, y: currentY + 20, width: bedW, height: bedH, isDouble: false });
      } else if (room.type === 'living' || room.type === 'main') {
        const sofaW = Math.min(55, (w - gap) * 0.5);
        elements.push({ type: 'sofa', x: rx + 10, y: currentY + mainHeight * 0.45, width: sofaW, height: 20, backSide: 'left' });
        elements.push({ type: 'table', x: rx + sofaW + 20, y: currentY + mainHeight * 0.5, width: 25, height: 18 });
      } else if (room.type === 'kitchen-living') {
        const sofaW = Math.min(50, (w - gap) * 0.4);
        elements.push({ type: 'sofa', x: rx + 10, y: currentY + mainHeight * 0.35, width: sofaW, height: 18, backSide: 'left' });
        elements.push({ type: 'table', x: rx + sofaW + 18, y: currentY + mainHeight * 0.4, width: 22, height: 16 });
        // Кухонная зона
        elements.push({ type: 'stove', x: rx + w - gap - 38, y: currentY + mainHeight - gap - 35, width: 32, height: 28 });
        elements.push({ type: 'kitchenSink', x: rx + w - gap - 75, y: currentY + mainHeight - gap - 35, width: 32, height: 25 });
        elements.push({ type: 'fridge', x: rx + w - gap - 110, y: currentY + mainHeight - gap - 42, width: 28, height: 38 });
      }
      
      // Межкомнатные двери
      if (idx > 0 || livingRooms.length === 1) {
        elements.push({ 
          type: 'door', 
          x: rx + 5, 
          y: currentY + mainHeight - gap, 
          width: 22, 
          direction: 'right',
          isVertical: false 
        });
      }
      
      currentX += w;
    });
    currentY += mainHeight;
  }
  
  // === КУХНЯ И СЕРВИС (середина) ===
  const midRooms = [...kitchenRooms, ...serviceRooms.slice(0, 2)];
  if (midRooms.length > 0) {
    const totalRatio = midRooms.reduce((s, r) => s + r.areaRatio, 0);
    let currentX = startX;
    
    midRooms.forEach((room, idx) => {
      const w = (room.areaRatio / totalRatio) * width;
      const rx = mirror ? (startX + width - (currentX - startX) - w + gap) : currentX;
      
      rooms.push({
        ...room,
        x: rx,
        y: currentY,
        width: w - gap,
        height: auxHeight - gap,
        area: totalArea * room.areaRatio
      });
      
      if (room.type === 'kitchen') {
        // Окно
        elements.push({ type: 'window', x: rx + 10, y: currentY, width: Math.min(30, w * 0.35), isVertical: false });
        // Оборудование
        elements.push({ type: 'stove', x: rx + 8, y: currentY + auxHeight - gap - 32, width: 30, height: 28 });
        elements.push({ type: 'kitchenSink', x: rx + 45, y: currentY + auxHeight - gap - 32, width: 28, height: 24 });
        elements.push({ type: 'fridge', x: rx + w - gap - 35, y: currentY + 8, width: 26, height: 35 });
        elements.push({ type: 'diningTable', x: rx + w - gap - 70, y: currentY + auxHeight - gap - 30, width: 28, height: 22 });
        // Дверь
        elements.push({ type: 'door', x: rx + w - gap - 5, y: currentY + 15, width: 20, direction: 'down', isVertical: true });
      } else if (room.type === 'bathroom' || room.type === 'bathroom1') {
        elements.push({ type: 'bathtub', x: rx + 5, y: currentY + 5, width: Math.min(50, w - 20), height: Math.min(24, auxHeight * 0.4) });
        elements.push({ type: 'toilet', x: rx + w - gap - 22, y: currentY + auxHeight - gap - 28, rotation: 0 });
        elements.push({ type: 'washSink', x: rx + w - gap - 20, y: currentY + 10, isVertical: true });
        elements.push({ type: 'door', x: rx + 5, y: currentY + auxHeight - gap, width: 18, direction: 'right', isVertical: false });
      } else if (room.type === 'bathroom2') {
        elements.push({ type: 'shower', x: rx + 5, y: currentY + 5, size: Math.min(28, auxHeight - 15) });
        elements.push({ type: 'toilet', x: rx + w - gap - 20, y: currentY + auxHeight - gap - 26, rotation: 0 });
        elements.push({ type: 'washSink', x: rx + w - gap - 18, y: currentY + 8, isVertical: true });
        elements.push({ type: 'door', x: rx + 15, y: currentY + auxHeight - gap, width: 18, direction: 'right', isVertical: false });
      } else if (room.type === 'hallway') {
        // Входная дверь
        const doorX = entranceSide === 'right' ? rx + w - gap : rx;
        elements.push({ type: 'door', x: doorX, y: currentY + auxHeight/2 - 13, width: 26, direction: entranceSide === 'right' ? 'down' : 'up', isVertical: true });
        elements.push({ type: 'wardrobe', x: rx + (entranceSide === 'right' ? 5 : w - gap - 35), y: currentY + 8, width: 30, height: auxHeight - 20 });
      }
      
      currentX += w;
    });
    currentY += auxHeight;
  }
  
  // === БАЛКОН И ОСТАЛЬНОЕ (низ) ===
  const bottomRooms = [...serviceRooms.slice(2), balcony].filter(Boolean);
  if (bottomRooms.length > 0) {
    const totalRatio = bottomRooms.reduce((s, r) => s + r.areaRatio, 0);
    let currentX = startX;
    
    bottomRooms.forEach((room) => {
      const w = (room.areaRatio / totalRatio) * width;
      const rx = mirror ? (startX + width - (currentX - startX) - w + gap) : currentX;
      
      rooms.push({
        ...room,
        x: rx,
        y: currentY,
        width: w - gap,
        height: serviceHeight - gap,
        area: totalArea * room.areaRatio
      });
      
      if (room.type === 'balcony') {
        // Балконная дверь/окно
        elements.push({ type: 'window', x: rx + 8, y: currentY, width: w - gap - 16, isVertical: false });
      } else if (room.type === 'wardrobe') {
        elements.push({ type: 'wardrobe', x: rx + 3, y: currentY + 3, width: w - gap - 6, height: serviceHeight - gap - 6 });
      }
      
      currentX += w;
    });
  }
  
  return { rooms, elements };
}

// ========== ОТРИСОВКА ЭЛЕМЕНТОВ ==========

function RenderElement({ el }) {
  switch (el.type) {
    case 'window': return <Window {...el} />;
    case 'door': return <Door {...el} />;
    case 'bathtub': return <Bathtub {...el} />;
    case 'shower': return <Shower {...el} />;
    case 'toilet': return <Toilet {...el} />;
    case 'washSink': return <WashSink {...el} />;
    case 'stove': return <Stove {...el} />;
    case 'kitchenSink': return <KitchenSink {...el} />;
    case 'fridge': return <Fridge {...el} />;
    case 'bed': return <Bed {...el} />;
    case 'sofa': return <Sofa {...el} />;
    case 'diningTable': return <DiningTable {...el} />;
    case 'table': return <DiningTable {...el} />;
    case 'wardrobe': return <Wardrobe {...el} />;
    default: return null;
  }
}

// ========== БЛОК КВАРТИРЫ ==========

function ApartmentBlock({ config, x, y, width, height, isSelected, apartmentIndex, onSelect, mirror, entranceSide }) {
  const templates = layoutTemplates[config.roomType] || [];
  const sortedTemplates = sortTemplatesByRelevance(templates, config.area);
  const template = config.template 
    ? templates.find(t => t.id === config.template) || sortedTemplates[0]
    : sortedTemplates[0];
  
  const { rooms, elements } = useMemo(() => {
    if (!template) return { rooms: [], elements: [] };
    const innerW = width - 6;
    const innerH = height - 28;
    return generateDetailedRooms(template, config.area, x + 3, y + 3, innerW, innerH, mirror, entranceSide);
  }, [template, config.area, x, y, width, height, mirror, entranceSide]);

  return (
    <g className="cursor-pointer" onClick={onSelect}>
      {/* Фон */}
      <rect
        x={x} y={y} width={width} height={height}
        fill={isSelected ? 'rgba(0, 212, 255, 0.06)' : 'rgba(10, 22, 40, 0.4)'}
        stroke={isSelected ? '#00d4ff' : '#4a90d9'}
        strokeWidth={isSelected ? 4 : 3}
      />
      
      {/* Комнаты */}
      {rooms.map((room, i) => {
        const colors = roomColors[room.color] || { fill: 'rgba(100,100,100,0.1)', stroke: '#666' };
        const minDim = Math.min(room.width, room.height);
        const showLabel = minDim > 32;
        const showArea = minDim > 26;
        const cx = room.x + room.width / 2;
        const cy = room.y + room.height / 2;
        
        return (
          <g key={i}>
            <rect
              x={room.x} y={room.y} width={room.width} height={room.height}
              fill={room.type === 'balcony' ? 'url(#balconyPattern)' : colors.fill}
              stroke={colors.stroke}
              strokeWidth="1.5"
            />
            {showLabel && (
              <text x={cx} y={cy - (showArea ? 6 : 0)} textAnchor="middle" 
                fill="rgba(255,255,255,0.8)" fontSize={Math.min(10, minDim/5)} fontFamily="JetBrains Mono">
                {room.name}
              </text>
            )}
            {showArea && (
              <text x={cx} y={cy + 9} textAnchor="middle"
                fill="rgba(0,212,255,0.85)" fontSize={Math.min(9, minDim/5.5)} fontFamily="JetBrains Mono">
                {room.area.toFixed(1).replace('.', ',')}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Архитектурные элементы */}
      {elements.map((el, i) => <RenderElement key={i} el={el} />)}
      
      {/* Подпись */}
      <rect x={x + 4} y={y + height - 22} width={width - 8} height={18} fill="rgba(0,20,40,0.85)" rx="2"/>
      <text x={x + width/2} y={y + height - 8} textAnchor="middle"
        fill={isSelected ? '#00d4ff' : '#4a90d9'} fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
        Кв. {apartmentIndex + 1} • {config.area.toFixed(1).replace('.', ',')} м²
      </text>
    </g>
  );
}

// ========== ПАНЕЛЬ УПРАВЛЕНИЯ ==========

function ApartmentPanel({ config, onChange, templates, apartmentIndex, isSelected, onSelect }) {
  const sortedTemplates = sortTemplatesByRelevance(templates, config.area);
  const currentTemplate = config.template 
    ? templates.find(t => t.id === config.template) || sortedTemplates[0]
    : sortedTemplates[0];
  const roomType = roomTypes.find(r => r.id === config.roomType);
  const suitability = calculateSuitability(currentTemplate, config.area);
  
  const handleAreaChange = (e) => {
    let val = e.target.value.replace(/[^\d.,]/g, '').replace('.', ',');
    onChange({ ...config, areaInput: val });
  };
  
  const handleAreaBlur = () => {
    let parsed = parseFloat((config.areaInput || '').replace(',', '.'));
    if (isNaN(parsed)) parsed = roomType?.minArea || 30;
    parsed = Math.max(roomType?.minArea || 20, Math.min(roomType?.maxArea || 100, parsed));
    parsed = Math.round(parsed * 100) / 100;
    onChange({ ...config, area: parsed, areaInput: parsed.toString().replace('.', ',') });
  };

  return (
    <div className={`card-glass rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-cyan-400' : 'hover:border-cyan-400/40'}`} onClick={onSelect}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isSelected ? 'bg-cyan-400 text-gray-900' : 'bg-cyan-400/20 text-cyan-400'}`}>
            <span className="text-sm font-mono font-bold">{apartmentIndex + 1}</span>
          </div>
          <span className="text-sm text-white font-medium">{currentTemplate?.name}</span>
        </div>
        <span className={`text-xs ${suitability.color}`}>{suitability.text}</span>
      </div>
      
      <div className="mb-3 flex gap-1">
        {roomTypes.map(type => (
          <button key={type.id} onClick={(e) => { e.stopPropagation(); const newArea = (type.minArea + type.maxArea) / 2; onChange({ ...config, roomType: type.id, area: newArea, areaInput: newArea.toString().replace('.', ','), template: null }); }}
            className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${config.roomType === type.id ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50' : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:text-gray-300'}`}>
            {type.name}
          </button>
        ))}
      </div>
      
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <input type="text" value={config.areaInput || config.area.toString().replace('.', ',')} onChange={handleAreaChange} onBlur={handleAreaBlur} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white font-mono text-center text-lg focus:border-cyan-400/50 outline-none"/>
          <span className="text-gray-400 text-sm">м²</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">{roomType?.minArea}–{roomType?.maxArea} м²</div>
      </div>
      
      <select value={config.template || ''} onChange={(e) => { e.stopPropagation(); onChange({ ...config, template: e.target.value || null }); }} onClick={(e) => e.stopPropagation()}
        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:border-cyan-400/50 outline-none">
        <option value="">Авто</option>
        {sortedTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
}

// ========== ГЛАВНЫЙ КОМПОНЕНТ ==========

export default function FloorEditor() {
  const [apartments, setApartments] = useState([
    { roomType: '1room', area: 38, areaInput: '38', template: null },
    { roomType: '2room', area: 56, areaInput: '56', template: null },
    { roomType: '2room', area: 62, areaInput: '62', template: null },
    { roomType: '1room', area: 42, areaInput: '42', template: null },
  ]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  
  const updateApartment = (i, cfg) => { const a = [...apartments]; a[i] = cfg; setApartments(a); };
  const totalArea = apartments.reduce((s, a) => s + a.area, 0);
  
  const svgW = 1000, svgH = 650, pad = 20;
  const hallW = 80, hallH = svgH - pad * 2;
  const hallX = (svgW - hallW) / 2, hallY = pad;
  const sideW = (svgW - hallW - pad * 2) / 2;
  
  const calcH = (apts) => { const t = apts.reduce((s, a) => s + Math.sqrt(a.area), 0); return apts.map(a => (Math.sqrt(a.area) / t) * hallH); };
  const leftH = calcH([apartments[0], apartments[1]]);
  const rightH = calcH([apartments[2], apartments[3]]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-cyan-400 rounded-full" />
          <div>
            <h2 className="text-xl font-semibold text-white">Поэтажный план</h2>
            <p className="text-sm text-gray-400">Нажмите на квартиру для редактирования</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-cyan-400">{totalArea.toFixed(1).replace('.', ',')} м²</div>
          <div className="text-xs text-gray-500">жилая площадь</div>
        </div>
      </div>
      
      <div className="card-glass rounded-2xl p-6 overflow-x-auto">
        <svg width={svgW} height={svgH} className="mx-auto" style={{ background: '#0a1628' }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30,58,95,0.3)" strokeWidth="0.5"/>
            </pattern>
            <pattern id="balconyPattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 0 8 L 8 0" stroke="rgba(74,144,217,0.4)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#grid)"/>
          
          {/* Внешние стены */}
          <rect x={pad} y={pad} width={svgW - pad*2} height={svgH - pad*2} fill="none" stroke="#4a90d9" strokeWidth="6"/>
          
          {/* Лестничная клетка */}
          <rect x={hallX} y={hallY} width={hallW} height={hallH} fill="rgba(60,70,90,0.2)" stroke="#4a90d9" strokeWidth="4"/>
          <g transform={`translate(${hallX + 10}, ${hallY + 20})`}>
            {[0,1,2,3,4,5,6,7].map(i => <rect key={i} x={0} y={i * 14} width={60} height={12} fill="none" stroke="#4a90d9" strokeWidth="1"/>)}
          </g>
          <text x={hallX + hallW/2} y={hallY + 145} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="JetBrains Mono">ЛК</text>
          
          {/* Лифт */}
          <rect x={hallX + 10} y={hallY + hallH/2 + 30} width={60} height={55} fill="rgba(74,144,217,0.15)" stroke="#4a90d9" strokeWidth="2"/>
          <line x1={hallX + 10} y1={hallY + hallH/2 + 30} x2={hallX + 70} y2={hallY + hallH/2 + 85} stroke="#4a90d9" strokeWidth="1"/>
          <line x1={hallX + 70} y1={hallY + hallH/2 + 30} x2={hallX + 10} y2={hallY + hallH/2 + 85} stroke="#4a90d9" strokeWidth="1"/>
          <text x={hallX + 40} y={hallY + hallH/2 + 105} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">лифт</text>
          
          {/* Квартиры */}
          {[apartments[0], apartments[1]].map((apt, i) => (
            <ApartmentBlock key={`l${i}`} config={apt} x={pad} y={pad + leftH.slice(0,i).reduce((s,h)=>s+h,0)} width={sideW} height={leftH[i]}
              isSelected={selectedApartment === i} apartmentIndex={i} onSelect={() => setSelectedApartment(selectedApartment === i ? null : i)}
              mirror={false} entranceSide="right"/>
          ))}
          {[apartments[2], apartments[3]].map((apt, i) => (
            <ApartmentBlock key={`r${i}`} config={apt} x={hallX + hallW} y={pad + rightH.slice(0,i).reduce((s,h)=>s+h,0)} width={sideW} height={rightH[i]}
              isSelected={selectedApartment === i + 2} apartmentIndex={i + 2} onSelect={() => setSelectedApartment(selectedApartment === i + 2 ? null : i + 2)}
              mirror={true} entranceSide="left"/>
          ))}
        </svg>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {apartments.map((cfg, i) => (
          <ApartmentPanel key={i} config={cfg} onChange={(c) => updateApartment(i, c)} templates={layoutTemplates[cfg.roomType] || []}
            apartmentIndex={i} isSelected={selectedApartment === i} onSelect={() => setSelectedApartment(selectedApartment === i ? null : i)}/>
        ))}
      </div>
    </div>
  );
}
