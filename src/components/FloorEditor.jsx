import { useState, useMemo } from 'react';
import { layoutTemplates, roomTypes, roomColors } from '../data/layoutTemplates';
import { sortTemplatesByRelevance, calculateSuitability } from '../utils/layoutGenerator';

// Главный компонент - единый план этажа
export default function FloorEditor() {
  const [apartments, setApartments] = useState([
    { roomType: '1room', area: 38, areaInput: '38', template: null },
    { roomType: '2room', area: 56, areaInput: '56', template: null },
    { roomType: '2room', area: 62, areaInput: '62', template: null },
    { roomType: '1room', area: 42, areaInput: '42', template: null },
  ]);
  
  const [selectedApartment, setSelectedApartment] = useState(null);
  
  const updateApartment = (index, config) => {
    const newApartments = [...apartments];
    newApartments[index] = config;
    setApartments(newApartments);
  };
  
  const totalArea = apartments.reduce((sum, apt) => sum + apt.area, 0);
  
  // Размеры SVG
  const svgWidth = 1000;
  const svgHeight = 600;
  const padding = 20;
  
  // Центральный холл
  const hallWidth = 80;
  const hallHeight = svgHeight - padding * 2;
  const hallX = (svgWidth - hallWidth) / 2;
  const hallY = padding;
  
  // Левая и правая стороны этажа
  const sideWidth = (svgWidth - hallWidth - padding * 2) / 2;
  
  // Квартиры слева (0, 1) и справа (2, 3)
  const leftApts = [apartments[0], apartments[1]];
  const rightApts = [apartments[2], apartments[3]];
  
  // Вычисляем высоты квартир пропорционально площади
  const calcHeights = (apts) => {
    const total = apts.reduce((s, a) => s + Math.sqrt(a.area), 0);
    return apts.map(a => (Math.sqrt(a.area) / total) * hallHeight);
  };
  
  const leftHeights = calcHeights(leftApts);
  const rightHeights = calcHeights(rightApts);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-cyan-400 rounded-full" />
          <div>
            <h2 className="text-xl font-semibold text-white">Поэтажный план</h2>
            <p className="text-sm text-gray-400">Нажмите на квартиру для редактирования</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {totalArea.toFixed(1).replace('.', ',')} м²
          </div>
          <div className="text-xs text-gray-500">жилая площадь этажа</div>
        </div>
      </div>
      
      {/* План этажа */}
      <div className="card-glass rounded-2xl p-6 overflow-x-auto">
        <svg 
          width={svgWidth} 
          height={svgHeight}
          className="mx-auto"
          style={{ 
            background: 'linear-gradient(180deg, rgba(10,22,40,0.9) 0%, rgba(15,39,68,0.9) 100%)',
          }}
        >
          {/* Сетка */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30, 58, 95, 0.4)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />
          
          {/* Внешний контур этажа */}
          <rect
            x={padding}
            y={padding}
            width={svgWidth - padding * 2}
            height={svgHeight - padding * 2}
            fill="none"
            stroke="#4a90d9"
            strokeWidth="4"
          />
          
          {/* Центральный холл/лестничная клетка */}
          <rect
            x={hallX}
            y={hallY}
            width={hallWidth}
            height={hallHeight}
            fill="rgba(100, 100, 120, 0.15)"
            stroke="#4a90d9"
            strokeWidth="2"
          />
          <text
            x={hallX + hallWidth / 2}
            y={hallY + hallHeight / 2 - 20}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            Лестничная
          </text>
          <text
            x={hallX + hallWidth / 2}
            y={hallY + hallHeight / 2}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            клетка
          </text>
          {/* Лифт */}
          <rect
            x={hallX + 15}
            y={hallY + hallHeight / 2 + 30}
            width={50}
            height={40}
            fill="rgba(74, 144, 217, 0.2)"
            stroke="#4a90d9"
            strokeWidth="1"
          />
          <text
            x={hallX + 40}
            y={hallY + hallHeight / 2 + 55}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="9"
            fontFamily="JetBrains Mono"
          >
            лифт
          </text>
          
          {/* Левые квартиры */}
          {leftApts.map((apt, i) => {
            const y = padding + leftHeights.slice(0, i).reduce((s, h) => s + h, 0);
            const h = leftHeights[i];
            const aptIndex = i;
            
            return (
              <ApartmentBlock
                key={`left-${i}`}
                config={apt}
                x={padding}
                y={y}
                width={sideWidth}
                height={h}
                isSelected={selectedApartment === aptIndex}
                apartmentIndex={aptIndex}
                onSelect={() => setSelectedApartment(selectedApartment === aptIndex ? null : aptIndex)}
                mirror={false}
              />
            );
          })}
          
          {/* Правые квартиры */}
          {rightApts.map((apt, i) => {
            const y = padding + rightHeights.slice(0, i).reduce((s, h) => s + h, 0);
            const h = rightHeights[i];
            const aptIndex = i + 2;
            
            return (
              <ApartmentBlock
                key={`right-${i}`}
                config={apt}
                x={hallX + hallWidth}
                y={y}
                width={sideWidth}
                height={h}
                isSelected={selectedApartment === aptIndex}
                apartmentIndex={aptIndex}
                onSelect={() => setSelectedApartment(selectedApartment === aptIndex ? null : aptIndex)}
                mirror={true}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Панели редактирования */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {apartments.map((config, index) => (
          <ApartmentPanel
            key={index}
            config={config}
            onChange={(newConfig) => updateApartment(index, newConfig)}
            templates={layoutTemplates[config.roomType] || []}
            apartmentIndex={index}
            isSelected={selectedApartment === index}
            onSelect={() => setSelectedApartment(selectedApartment === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

// Блок квартиры на плане этажа
function ApartmentBlock({ config, x, y, width, height, isSelected, apartmentIndex, onSelect, mirror }) {
  const templates = layoutTemplates[config.roomType] || [];
  const sortedTemplates = sortTemplatesByRelevance(templates, config.area);
  const template = config.template 
    ? templates.find(t => t.id === config.template) || sortedTemplates[0]
    : sortedTemplates[0];
  
  // Генерируем комнаты для этой квартиры
  const rooms = useMemo(() => {
    if (!template) return [];
    
    const padding = 3;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2 - 18; // место для подписи
    const startX = x + padding;
    const startY = y + padding;
    
    return generateRoomsForApartment(template, config.area, startX, startY, innerW, innerH, mirror);
  }, [template, config.area, x, y, width, height, mirror]);

  return (
    <g 
      className="cursor-pointer"
      onClick={onSelect}
    >
      {/* Контур квартиры */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isSelected ? 'rgba(0, 212, 255, 0.08)' : 'rgba(10, 22, 40, 0.3)'}
        stroke={isSelected ? '#00d4ff' : '#4a90d9'}
        strokeWidth={isSelected ? 3 : 2}
      />
      
      {/* Комнаты */}
      {rooms.map((room, i) => {
        const colors = roomColors[room.color] || { fill: 'rgba(100, 100, 100, 0.1)', stroke: '#666' };
        const minDim = Math.min(room.width, room.height);
        const showLabel = minDim > 40;
        const showArea = minDim > 30;
        
        const cx = room.x + room.width / 2;
        const cy = room.y + room.height / 2;
        
        return (
          <g key={i}>
            <rect
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="1"
            />
            
            {showLabel && (
              <text
                x={cx}
                y={cy - (showArea ? 6 : 0)}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.85)"
                fontSize={Math.min(11, minDim / 5)}
                fontFamily="JetBrains Mono"
              >
                {room.name}
              </text>
            )}
            
            {showArea && (
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fill="rgba(0, 212, 255, 0.9)"
                fontSize={Math.min(10, minDim / 5.5)}
                fontFamily="JetBrains Mono"
              >
                {room.area.toFixed(1).replace('.', ',')} м²
              </text>
            )}
          </g>
        );
      })}
      
      {/* Номер и площадь квартиры */}
      <rect
        x={x + 4}
        y={y + height - 20}
        width={width - 8}
        height={18}
        fill="rgba(0, 20, 40, 0.7)"
        rx="2"
      />
      <text
        x={x + width / 2}
        y={y + height - 6}
        textAnchor="middle"
        fill={isSelected ? '#00d4ff' : '#4a90d9'}
        fontSize="12"
        fontFamily="JetBrains Mono"
        fontWeight="600"
      >
        Кв. {apartmentIndex + 1} • {config.area.toFixed(1).replace('.', ',')} м²
      </text>
    </g>
  );
}

// Генерация комнат для квартиры
function generateRoomsForApartment(template, totalArea, startX, startY, width, height, mirror) {
  const rooms = [];
  const gap = 2;
  
  // Группируем комнаты по функции
  const livingRooms = template.rooms.filter(r => 
    ['main', 'living', 'kitchen-living', 'bedroom', 'bedroom1', 'bedroom2', 'bedroom3'].includes(r.type)
  );
  const kitchenRooms = template.rooms.filter(r => 
    ['kitchen'].includes(r.type)
  );
  const serviceRooms = template.rooms.filter(r => 
    ['bathroom', 'bathroom1', 'bathroom2', 'hallway', 'wardrobe'].includes(r.type)
  );
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  // Основная зона (60% высоты) - жилые комнаты
  const mainHeight = height * 0.58;
  // Вспомогательная зона (25%) - кухня
  const auxHeight = height * 0.25;
  // Сервисная зона (17%) - санузлы, коридор
  const serviceHeight = height * 0.17;
  
  let currentY = startY;
  
  // Жилые комнаты сверху
  if (livingRooms.length > 0) {
    const totalRatio = livingRooms.reduce((s, r) => s + r.areaRatio, 0);
    let currentX = startX;
    
    livingRooms.forEach(room => {
      const w = (room.areaRatio / totalRatio) * width;
      rooms.push({
        ...room,
        x: mirror ? (startX + width - (currentX - startX) - w) : currentX,
        y: currentY,
        width: w - gap,
        height: mainHeight - gap,
        area: totalArea * room.areaRatio
      });
      currentX += w;
    });
    currentY += mainHeight;
  }
  
  // Кухня и часть сервисных помещений в середине
  const midRooms = [...kitchenRooms, ...serviceRooms.slice(0, 2)];
  if (midRooms.length > 0) {
    const totalRatio = midRooms.reduce((s, r) => s + r.areaRatio, 0);
    let currentX = startX;
    
    midRooms.forEach(room => {
      const w = (room.areaRatio / totalRatio) * width;
      rooms.push({
        ...room,
        x: mirror ? (startX + width - (currentX - startX) - w) : currentX,
        y: currentY,
        width: w - gap,
        height: auxHeight - gap,
        area: totalArea * room.areaRatio
      });
      currentX += w;
    });
    currentY += auxHeight;
  }
  
  // Остальные сервисные и балкон внизу
  const bottomRooms = [...serviceRooms.slice(2), balcony].filter(Boolean);
  if (bottomRooms.length > 0) {
    const totalRatio = bottomRooms.reduce((s, r) => s + r.areaRatio, 0);
    let currentX = startX;
    
    bottomRooms.forEach(room => {
      const w = (room.areaRatio / totalRatio) * width;
      rooms.push({
        ...room,
        x: mirror ? (startX + width - (currentX - startX) - w) : currentX,
        y: currentY,
        width: w - gap,
        height: serviceHeight - gap,
        area: totalArea * room.areaRatio
      });
      currentX += w;
    });
  } else if (serviceRooms.length <= 2 && balcony) {
    // Если балкон не был добавлен
    rooms.push({
      ...balcony,
      x: mirror ? startX : (startX + width * 0.7),
      y: currentY,
      width: width * 0.3 - gap,
      height: serviceHeight - gap,
      area: totalArea * balcony.areaRatio
    });
  }
  
  return rooms;
}

// Панель редактирования квартиры
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
    <div 
      className={`card-glass rounded-xl p-4 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-cyan-400' : 'hover:border-cyan-400/40'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            isSelected ? 'bg-cyan-400 text-gray-900' : 'bg-cyan-400/20 text-cyan-400'
          }`}>
            <span className="text-sm font-mono font-bold">{apartmentIndex + 1}</span>
          </div>
          <span className="text-sm text-white font-medium">{currentTemplate?.name}</span>
        </div>
        <span className={`text-xs ${suitability.color}`}>{suitability.text}</span>
      </div>
      
      {/* Комнатность */}
      <div className="mb-3">
        <div className="flex gap-1">
          {roomTypes.map(type => (
            <button
              key={type.id}
              onClick={(e) => {
                e.stopPropagation();
                const newArea = (type.minArea + type.maxArea) / 2;
                onChange({ 
                  ...config, 
                  roomType: type.id, 
                  area: newArea,
                  areaInput: newArea.toString().replace('.', ','),
                  template: null 
                });
              }}
              className={`
                flex-1 py-1.5 rounded text-xs font-mono transition-all
                ${config.roomType === type.id
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:text-gray-300'
                }
              `}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Площадь */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={config.areaInput || config.area.toString().replace('.', ',')}
            onChange={handleAreaChange}
            onBlur={handleAreaBlur}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white font-mono text-center text-lg focus:border-cyan-400/50 outline-none"
          />
          <span className="text-gray-400 text-sm">м²</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {roomType?.minArea}–{roomType?.maxArea} м²
        </div>
      </div>
      
      {/* Планировка */}
      <div>
        <select
          value={config.template || ''}
          onChange={(e) => {
            e.stopPropagation();
            onChange({ ...config, template: e.target.value || null });
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:border-cyan-400/50 outline-none"
        >
          <option value="">Авто</option>
          {sortedTemplates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}