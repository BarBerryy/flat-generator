// Генератор геометрии планировки с поддержкой сложных форм
export function generateLayoutGeometry(template, totalArea, svgWidth, svgHeight) {
  const padding = 30;
  const availableWidth = svgWidth - padding * 2;
  const availableHeight = svgHeight - padding * 2 - 25;
  
  const aspectRatio = template.aspectRatio || 1.4;
  
  let width, height;
  if (availableWidth / availableHeight > aspectRatio) {
    height = availableHeight * 0.9;
    width = height * aspectRatio;
  } else {
    width = availableWidth * 0.9;
    height = width / aspectRatio;
  }
  
  const offsetX = (svgWidth - width) / 2;
  const offsetY = (svgHeight - height - 25) / 2;
  
  const rooms = [];
  const layoutType = template.layout;
  
  // Выбираем генератор в зависимости от типа планировки
  switch (layoutType) {
    case 'linear':
    case 'linear-1':
      generateLinearLayout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'square':
      generateSquareLayout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'euro':
      generateEuroStudioLayout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'euro-1':
      generateEuro1Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'classic-1':
      generateClassic1Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'euro-2':
      generateEuro2Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'classic-2':
      generateClassic2Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'improved-2':
      generateImproved2Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'classic-3':
      generateClassic3Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'euro-3':
      generateEuro3Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    case 'family-3':
      generateFamily3Layout(template, rooms, totalArea, offsetX, offsetY, width, height);
      break;
    default:
      generateClassicLayout(template, rooms, totalArea, offsetX, offsetY, width, height);
  }
  
  // Генерируем внешний контур на основе комнат
  const outerPath = generateOuterPath(rooms, offsetX, offsetY, width, height);
  
  return {
    rooms,
    bounds: { x: offsetX, y: offsetY, width, height },
    outerPath
  };
}

// Генерация внешнего контура
function generateOuterPath(rooms, offsetX, offsetY, width, height) {
  // Простой прямоугольный контур с возможными вырезами
  // Для более сложных форм можно анализировать комнаты
  return `M ${offsetX} ${offsetY} 
          L ${offsetX + width} ${offsetY} 
          L ${offsetX + width} ${offsetY + height} 
          L ${offsetX} ${offsetY + height} Z`;
}

// Создание L-образной комнаты
function createLShapedRoom(room, x, y, totalW, totalH, cutW, cutH, cutPosition, totalArea) {
  // cutPosition: 'tr' (top-right), 'tl', 'br', 'bl'
  let path, centerX, centerY;
  
  switch (cutPosition) {
    case 'tr': // Вырез справа сверху
      path = `M ${x} ${y} 
              L ${x + totalW - cutW} ${y} 
              L ${x + totalW - cutW} ${y + cutH} 
              L ${x + totalW} ${y + cutH} 
              L ${x + totalW} ${y + totalH} 
              L ${x} ${y + totalH} Z`;
      centerX = x + (totalW - cutW / 2) / 2;
      centerY = y + totalH / 2;
      break;
    case 'tl': // Вырез слева сверху
      path = `M ${x + cutW} ${y} 
              L ${x + totalW} ${y} 
              L ${x + totalW} ${y + totalH} 
              L ${x} ${y + totalH} 
              L ${x} ${y + cutH} 
              L ${x + cutW} ${y + cutH} Z`;
      centerX = x + totalW / 2;
      centerY = y + totalH / 2;
      break;
    case 'br': // Вырез справа снизу
      path = `M ${x} ${y} 
              L ${x + totalW} ${y} 
              L ${x + totalW} ${y + totalH - cutH} 
              L ${x + totalW - cutW} ${y + totalH - cutH} 
              L ${x + totalW - cutW} ${y + totalH} 
              L ${x} ${y + totalH} Z`;
      centerX = x + (totalW - cutW / 2) / 2;
      centerY = y + totalH / 2;
      break;
    case 'bl': // Вырез слева снизу
      path = `M ${x} ${y} 
              L ${x + totalW} ${y} 
              L ${x + totalW} ${y + totalH} 
              L ${x + cutW} ${y + totalH} 
              L ${x + cutW} ${y + totalH - cutH} 
              L ${x} ${y + totalH - cutH} Z`;
      centerX = x + totalW / 2;
      centerY = y + totalH / 2;
      break;
  }
  
  return {
    ...room,
    path,
    shape: 'L',
    x, y,
    width: totalW,
    height: totalH,
    area: totalArea * room.areaRatio,
    center: { x: centerX, y: centerY }
  };
}

// Линейная студия
function generateLinearLayout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const mainRoom = template.rooms.find(r => r.type === 'main');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const mainH = height * 0.68;
  const serviceH = height * 0.32;
  
  // Главная зона - L-образная с вырезом под санузел
  if (mainRoom) {
    const cutW = width * 0.25;
    const cutH = serviceH;
    rooms.push(createLShapedRoom(
      mainRoom, offsetX, offsetY, width, height, cutW, cutH, 'bl', totalArea
    ));
  }
  
  // Санузел - в вырезе слева снизу
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX,
      y: offsetY + mainH,
      width: width * 0.25,
      height: serviceH,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Прихожая - рядом с санузлом
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + width * 0.25,
      y: offsetY + mainH,
      width: width * 0.35,
      height: serviceH,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Балкон - справа
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.6,
      y: offsetY + mainH,
      width: width * 0.4,
      height: serviceH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Квадратная студия
function generateSquareLayout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const mainRoom = template.rooms.find(r => r.type === 'main');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const topH = height * 0.65;
  const bottomH = height * 0.35;
  
  // Жилая зона - L-образная
  if (mainRoom) {
    rooms.push(createLShapedRoom(
      mainRoom, offsetX, offsetY, width, topH + bottomH * 0.4, 
      width * 0.35, bottomH * 0.4, 'br', totalArea
    ));
  }
  
  // Санузел
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX,
      y: offsetY + topH + bottomH * 0.4,
      width: width * 0.3,
      height: bottomH * 0.6,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Прихожая
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + width * 0.3,
      y: offsetY + topH + bottomH * 0.4,
      width: width * 0.35,
      height: bottomH * 0.6,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Балкон
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.65,
      y: offsetY + topH,
      width: width * 0.35,
      height: bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Евро-студия с нишей
function generateEuroStudioLayout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const living = template.rooms.find(r => r.type === 'living');
  const bedroom = template.rooms.find(r => r.type === 'bedroom');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const leftW = width * 0.6;
  const rightW = width * 0.4;
  const topH = height * 0.7;
  const bottomH = height * 0.3;
  
  // Гостиная-кухня - L-образная
  if (living) {
    rooms.push(createLShapedRoom(
      living, offsetX, offsetY, leftW, height, leftW * 0.4, bottomH, 'bl', totalArea
    ));
  }
  
  // Спальная ниша
  if (bedroom) {
    rooms.push({
      ...bedroom,
      x: offsetX + leftW,
      y: offsetY,
      width: rightW,
      height: topH,
      area: totalArea * bedroom.areaRatio
    });
  }
  
  // Санузел
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX,
      y: offsetY + height - bottomH,
      width: leftW * 0.4,
      height: bottomH,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Прихожая
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + leftW * 0.4,
      y: offsetY + height - bottomH,
      width: leftW * 0.6,
      height: bottomH,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Балкон
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + leftW,
      y: offsetY + topH,
      width: rightW,
      height: bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Классическая 1К
function generateClassic1Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const living = template.rooms.find(r => r.type === 'living');
  const kitchen = template.rooms.find(r => r.type === 'kitchen');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const topH = height * 0.6;
  const bottomH = height * 0.4;
  
  // Комната - L-образная с балконом
  if (living) {
    rooms.push(createLShapedRoom(
      living, offsetX, offsetY, width * 0.55, topH + bottomH * 0.3,
      width * 0.15, bottomH * 0.3, 'br', totalArea
    ));
  }
  
  // Кухня
  if (kitchen) {
    rooms.push({
      ...kitchen,
      x: offsetX + width * 0.55,
      y: offsetY,
      width: width * 0.45,
      height: topH,
      area: totalArea * kitchen.areaRatio
    });
  }
  
  // Прихожая - L-образная
  if (hallway) {
    rooms.push(createLShapedRoom(
      hallway, offsetX, offsetY + topH + bottomH * 0.3, width * 0.55, bottomH * 0.7,
      width * 0.2, bottomH * 0.35, 'tl', totalArea
    ));
  }
  
  // Санузел
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX + width * 0.55,
      y: offsetY + topH,
      width: width * 0.25,
      height: bottomH,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Балкон
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.8,
      y: offsetY + topH,
      width: width * 0.2,
      height: bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Евро-однушка
function generateEuro1Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const kitchenLiving = template.rooms.find(r => r.type === 'kitchen-living');
  const bedroom = template.rooms.find(r => r.type === 'bedroom');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const leftW = width * 0.55;
  const rightW = width * 0.45;
  const topH = height * 0.72;
  const bottomH = height * 0.28;
  
  // Кухня-гостиная - L-образная
  if (kitchenLiving) {
    rooms.push(createLShapedRoom(
      kitchenLiving, offsetX, offsetY, leftW, height,
      leftW * 0.45, bottomH, 'bl', totalArea
    ));
  }
  
  // Спальня
  if (bedroom) {
    rooms.push({
      ...bedroom,
      x: offsetX + leftW,
      y: offsetY,
      width: rightW,
      height: topH,
      area: totalArea * bedroom.areaRatio
    });
  }
  
  // Прихожая
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX,
      y: offsetY + height - bottomH,
      width: leftW * 0.45,
      height: bottomH,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Санузел
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX + leftW * 0.45,
      y: offsetY + height - bottomH,
      width: leftW * 0.55,
      height: bottomH,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Лоджия
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + leftW,
      y: offsetY + topH,
      width: rightW,
      height: bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Классическая 2К
function generateClassic2Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const living = template.rooms.find(r => r.type === 'living');
  const bedroom = template.rooms.find(r => r.type === 'bedroom');
  const kitchen = template.rooms.find(r => r.type === 'kitchen');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const topH = height * 0.58;
  const bottomH = height * 0.42;
  
  // Гостиная - L-образная
  if (living) {
    rooms.push(createLShapedRoom(
      living, offsetX, offsetY, width * 0.48, topH + bottomH * 0.25,
      width * 0.15, bottomH * 0.25, 'br', totalArea
    ));
  }
  
  // Спальня
  if (bedroom) {
    rooms.push({
      ...bedroom,
      x: offsetX + width * 0.48,
      y: offsetY,
      width: width * 0.52,
      height: topH,
      area: totalArea * bedroom.areaRatio
    });
  }
  
  // Кухня - с нишей
  if (kitchen) {
    rooms.push(createLShapedRoom(
      kitchen, offsetX, offsetY + topH + bottomH * 0.25, width * 0.38, bottomH * 0.75,
      width * 0.1, bottomH * 0.25, 'tr', totalArea
    ));
  }
  
  // Прихожая
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + width * 0.33,
      y: offsetY + topH,
      width: width * 0.25,
      height: bottomH,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Санузел
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX + width * 0.58,
      y: offsetY + topH,
      width: width * 0.22,
      height: bottomH,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Балкон
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.8,
      y: offsetY + topH,
      width: width * 0.2,
      height: bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Евро-двушка
function generateEuro2Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const kitchenLiving = template.rooms.find(r => r.type === 'kitchen-living');
  const bedroom1 = template.rooms.find(r => r.type === 'bedroom1');
  const bedroom2 = template.rooms.find(r => r.type === 'bedroom2');
  const bathroom = template.rooms.find(r => r.type === 'bathroom');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const topH = height * 0.6;
  const bottomH = height * 0.4;
  
  // Кухня-гостиная - L-образная
  if (kitchenLiving) {
    rooms.push(createLShapedRoom(
      kitchenLiving, offsetX, offsetY, width * 0.52, topH + bottomH * 0.35,
      width * 0.18, bottomH * 0.35, 'br', totalArea
    ));
  }
  
  // Спальня 1
  if (bedroom1) {
    rooms.push({
      ...bedroom1,
      x: offsetX + width * 0.52,
      y: offsetY,
      width: width * 0.48,
      height: topH,
      area: totalArea * bedroom1.areaRatio
    });
  }
  
  // Спальня 2 - L-образная
  if (bedroom2) {
    rooms.push(createLShapedRoom(
      bedroom2, offsetX, offsetY + topH + bottomH * 0.35, width * 0.4, bottomH * 0.65,
      width * 0.12, bottomH * 0.2, 'tl', totalArea
    ));
  }
  
  // Холл
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + width * 0.34,
      y: offsetY + topH,
      width: width * 0.22,
      height: bottomH,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Санузел
  if (bathroom) {
    rooms.push({
      ...bathroom,
      x: offsetX + width * 0.56,
      y: offsetY + topH,
      width: width * 0.22,
      height: bottomH,
      area: totalArea * bathroom.areaRatio
    });
  }
  
  // Балкон
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.78,
      y: offsetY + topH,
      width: width * 0.22,
      height: bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Улучшенная 2К
function generateImproved2Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const living = template.rooms.find(r => r.type === 'living');
  const bedroom = template.rooms.find(r => r.type === 'bedroom');
  const kitchen = template.rooms.find(r => r.type === 'kitchen');
  const bathroom1 = template.rooms.find(r => r.type === 'bathroom1');
  const bathroom2 = template.rooms.find(r => r.type === 'bathroom2');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const wardrobe = template.rooms.find(r => r.type === 'wardrobe');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const topH = height * 0.55;
  const midH = height * 0.25;
  const bottomH = height * 0.2;
  
  // Гостиная - L-образная
  if (living) {
    rooms.push(createLShapedRoom(
      living, offsetX, offsetY, width * 0.45, topH + midH * 0.4,
      width * 0.12, midH * 0.4, 'br', totalArea
    ));
  }
  
  // Мастер-спальня с гардеробной нишей
  if (bedroom) {
    rooms.push(createLShapedRoom(
      bedroom, offsetX + width * 0.45, offsetY, width * 0.55, topH,
      width * 0.15, topH * 0.3, 'br', totalArea
    ));
  }
  
  // Гардеробная
  if (wardrobe) {
    rooms.push({
      ...wardrobe,
      x: offsetX + width * 0.85,
      y: offsetY + topH * 0.7,
      width: width * 0.15,
      height: topH * 0.3,
      area: totalArea * wardrobe.areaRatio
    });
  }
  
  // Кухня
  if (kitchen) {
    rooms.push({
      ...kitchen,
      x: offsetX,
      y: offsetY + topH + midH * 0.4,
      width: width * 0.35,
      height: midH * 0.6 + bottomH,
      area: totalArea * kitchen.areaRatio
    });
  }
  
  // Прихожая
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + width * 0.35,
      y: offsetY + topH,
      width: width * 0.25,
      height: midH + bottomH,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Ванная
  if (bathroom1) {
    rooms.push({
      ...bathroom1,
      x: offsetX + width * 0.6,
      y: offsetY + topH,
      width: width * 0.2,
      height: midH,
      area: totalArea * bathroom1.areaRatio
    });
  }
  
  // Гостевой С/У
  if (bathroom2) {
    rooms.push({
      ...bathroom2,
      x: offsetX + width * 0.6,
      y: offsetY + topH + midH,
      width: width * 0.2,
      height: bottomH,
      area: totalArea * bathroom2.areaRatio
    });
  }
  
  // Лоджия
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.8,
      y: offsetY + topH,
      width: width * 0.2,
      height: midH + bottomH,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Классическая 3К
function generateClassic3Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const living = template.rooms.find(r => r.type === 'living');
  const bedroom1 = template.rooms.find(r => r.type === 'bedroom1');
  const bedroom2 = template.rooms.find(r => r.type === 'bedroom2');
  const kitchen = template.rooms.find(r => r.type === 'kitchen');
  const bathroom1 = template.rooms.find(r => r.type === 'bathroom1');
  const bathroom2 = template.rooms.find(r => r.type === 'bathroom2');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const row1 = height * 0.42;
  const row2 = height * 0.33;
  const row3 = height * 0.25;
  
  // Гостиная - L-образная
  if (living) {
    rooms.push(createLShapedRoom(
      living, offsetX, offsetY, width * 0.42, row1 + row2 * 0.3,
      width * 0.12, row2 * 0.3, 'br', totalArea
    ));
  }
  
  // Спальня
  if (bedroom1) {
    rooms.push({
      ...bedroom1,
      x: offsetX + width * 0.42,
      y: offsetY,
      width: width * 0.32,
      height: row1,
      area: totalArea * bedroom1.areaRatio
    });
  }
  
  // Детская
  if (bedroom2) {
    rooms.push({
      ...bedroom2,
      x: offsetX + width * 0.74,
      y: offsetY,
      width: width * 0.26,
      height: row1,
      area: totalArea * bedroom2.areaRatio
    });
  }
  
  // Кухня
  if (kitchen) {
    rooms.push({
      ...kitchen,
      x: offsetX,
      y: offsetY + row1 + row2 * 0.3,
      width: width * 0.32,
      height: row2 * 0.7 + row3,
      area: totalArea * kitchen.areaRatio
    });
  }
  
  // Коридор - L-образный
  if (hallway) {
    rooms.push(createLShapedRoom(
      hallway, offsetX + width * 0.32, offsetY + row1, width * 0.35, row2 + row3,
      width * 0.15, row3, 'br', totalArea
    ));
  }
  
  // Ванная
  if (bathroom1) {
    rooms.push({
      ...bathroom1,
      x: offsetX + width * 0.67,
      y: offsetY + row1,
      width: width * 0.18,
      height: row2,
      area: totalArea * bathroom1.areaRatio
    });
  }
  
  // С/У
  if (bathroom2) {
    rooms.push({
      ...bathroom2,
      x: offsetX + width * 0.85,
      y: offsetY + row1,
      width: width * 0.15,
      height: row2,
      area: totalArea * bathroom2.areaRatio
    });
  }
  
  // Лоджия
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.67,
      y: offsetY + row1 + row2,
      width: width * 0.33,
      height: row3,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Евро-трёшка
function generateEuro3Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const kitchenLiving = template.rooms.find(r => r.type === 'kitchen-living');
  const bedroom1 = template.rooms.find(r => r.type === 'bedroom1');
  const bedroom2 = template.rooms.find(r => r.type === 'bedroom2');
  const bedroom3 = template.rooms.find(r => r.type === 'bedroom3');
  const bathroom1 = template.rooms.find(r => r.type === 'bathroom1');
  const bathroom2 = template.rooms.find(r => r.type === 'bathroom2');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const row1 = height * 0.45;
  const row2 = height * 0.32;
  const row3 = height * 0.23;
  
  // Кухня-гостиная - L-образная
  if (kitchenLiving) {
    rooms.push(createLShapedRoom(
      kitchenLiving, offsetX, offsetY, width * 0.45, row1 + row2 * 0.4,
      width * 0.15, row2 * 0.4, 'br', totalArea
    ));
  }
  
  // Мастер
  if (bedroom1) {
    rooms.push({
      ...bedroom1,
      x: offsetX + width * 0.45,
      y: offsetY,
      width: width * 0.3,
      height: row1,
      area: totalArea * bedroom1.areaRatio
    });
  }
  
  // Спальня 2
  if (bedroom2) {
    rooms.push({
      ...bedroom2,
      x: offsetX + width * 0.75,
      y: offsetY,
      width: width * 0.25,
      height: row1,
      area: totalArea * bedroom2.areaRatio
    });
  }
  
  // Спальня 3
  if (bedroom3) {
    rooms.push({
      ...bedroom3,
      x: offsetX,
      y: offsetY + row1 + row2 * 0.4,
      width: width * 0.32,
      height: row2 * 0.6 + row3,
      area: totalArea * bedroom3.areaRatio
    });
  }
  
  // Холл - L-образный
  if (hallway) {
    rooms.push(createLShapedRoom(
      hallway, offsetX + width * 0.32, offsetY + row1, width * 0.28, row2 + row3,
      width * 0.1, row3, 'br', totalArea
    ));
  }
  
  // Мастер С/У
  if (bathroom1) {
    rooms.push({
      ...bathroom1,
      x: offsetX + width * 0.6,
      y: offsetY + row1,
      width: width * 0.2,
      height: row2,
      area: totalArea * bathroom1.areaRatio
    });
  }
  
  // Общий С/У
  if (bathroom2) {
    rooms.push({
      ...bathroom2,
      x: offsetX + width * 0.8,
      y: offsetY + row1,
      width: width * 0.2,
      height: row2,
      area: totalArea * bathroom2.areaRatio
    });
  }
  
  // Терраса
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.6,
      y: offsetY + row1 + row2,
      width: width * 0.4,
      height: row3,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Семейная 3К
function generateFamily3Layout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const living = template.rooms.find(r => r.type === 'living');
  const bedroom1 = template.rooms.find(r => r.type === 'bedroom1');
  const bedroom2 = template.rooms.find(r => r.type === 'bedroom2');
  const office = template.rooms.find(r => r.type === 'office');
  const kitchen = template.rooms.find(r => r.type === 'kitchen');
  const bathroom1 = template.rooms.find(r => r.type === 'bathroom1');
  const bathroom2 = template.rooms.find(r => r.type === 'bathroom2');
  const wardrobe = template.rooms.find(r => r.type === 'wardrobe');
  const hallway = template.rooms.find(r => r.type === 'hallway');
  const balcony = template.rooms.find(r => r.type === 'balcony');
  
  const row1 = height * 0.4;
  const row2 = height * 0.35;
  const row3 = height * 0.25;
  
  // Гостиная - L-образная
  if (living) {
    rooms.push(createLShapedRoom(
      living, offsetX, offsetY, width * 0.38, row1 + row2 * 0.35,
      width * 0.1, row2 * 0.35, 'br', totalArea
    ));
  }
  
  // Мастер-спальня
  if (bedroom1) {
    rooms.push(createLShapedRoom(
      bedroom1, offsetX + width * 0.38, offsetY, width * 0.35, row1,
      width * 0.1, row1 * 0.35, 'br', totalArea
    ));
  }
  
  // Гардеробная при спальне
  if (wardrobe) {
    rooms.push({
      ...wardrobe,
      x: offsetX + width * 0.63,
      y: offsetY + row1 * 0.65,
      width: width * 0.1,
      height: row1 * 0.35,
      area: totalArea * wardrobe.areaRatio
    });
  }
  
  // Детская
  if (bedroom2) {
    rooms.push({
      ...bedroom2,
      x: offsetX + width * 0.73,
      y: offsetY,
      width: width * 0.27,
      height: row1,
      area: totalArea * bedroom2.areaRatio
    });
  }
  
  // Кухня
  if (kitchen) {
    rooms.push({
      ...kitchen,
      x: offsetX,
      y: offsetY + row1 + row2 * 0.35,
      width: width * 0.3,
      height: row2 * 0.65 + row3,
      area: totalArea * kitchen.areaRatio
    });
  }
  
  // Кабинет
  if (office) {
    rooms.push({
      ...office,
      x: offsetX + width * 0.3,
      y: offsetY + row1,
      width: width * 0.25,
      height: row2,
      area: totalArea * office.areaRatio
    });
  }
  
  // Коридор
  if (hallway) {
    rooms.push({
      ...hallway,
      x: offsetX + width * 0.3,
      y: offsetY + row1 + row2,
      width: width * 0.4,
      height: row3,
      area: totalArea * hallway.areaRatio
    });
  }
  
  // Ванная
  if (bathroom1) {
    rooms.push({
      ...bathroom1,
      x: offsetX + width * 0.55,
      y: offsetY + row1,
      width: width * 0.22,
      height: row2,
      area: totalArea * bathroom1.areaRatio
    });
  }
  
  // С/У
  if (bathroom2) {
    rooms.push({
      ...bathroom2,
      x: offsetX + width * 0.77,
      y: offsetY + row1,
      width: width * 0.23,
      height: row2 * 0.5,
      area: totalArea * bathroom2.areaRatio
    });
  }
  
  // Лоджия
  if (balcony) {
    rooms.push({
      ...balcony,
      x: offsetX + width * 0.77,
      y: offsetY + row1 + row2 * 0.5,
      width: width * 0.23,
      height: row2 * 0.5 + row3,
      area: totalArea * balcony.areaRatio
    });
  }
}

// Универсальный fallback
function generateClassicLayout(template, rooms, totalArea, offsetX, offsetY, width, height) {
  const cols = template.rooms.length <= 4 ? 2 : 3;
  const rows = Math.ceil(template.rooms.length / cols);
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const gap = 2;
  
  const sortedRooms = [...template.rooms].sort((a, b) => b.areaRatio - a.areaRatio);
  
  sortedRooms.forEach((room, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    rooms.push({
      ...room,
      x: offsetX + col * cellWidth + gap,
      y: offsetY + row * cellHeight + gap,
      width: cellWidth - gap * 2,
      height: cellHeight - gap * 2,
      area: totalArea * room.areaRatio
    });
  });
}

// Расчёт пригодности планировки
export function calculateSuitability(template, area) {
  if (area < template.minArea) {
    return { score: 0, text: 'Слишком мало', color: 'text-red-400', inRange: false };
  }
  if (area > template.maxArea) {
    return { score: 0, text: 'Слишком много', color: 'text-red-400', inRange: false };
  }
  
  const optimalDiff = Math.abs(area - template.optimalArea);
  const range = template.maxArea - template.minArea;
  const score = Math.max(0, 100 - (optimalDiff / range) * 100);
  
  if (score > 80) return { score, text: 'Оптимально', color: 'text-green-400', inRange: true };
  if (score > 50) return { score, text: 'Хорошо', color: 'text-yellow-400', inRange: true };
  return { score, text: 'Допустимо', color: 'text-orange-400', inRange: true };
}

// Сортировка шаблонов по релевантности
export function sortTemplatesByRelevance(templates, area) {
  return [...templates].sort((a, b) => {
    const aOpt = Math.abs(area - a.optimalArea);
    const bOpt = Math.abs(area - b.optimalArea);
    const aInRange = area >= a.minArea && area <= a.maxArea;
    const bInRange = area >= b.minArea && area <= b.maxArea;
    
    if (aInRange && !bInRange) return -1;
    if (!aInRange && bInRange) return 1;
    return aOpt - bOpt;
  });
}

// Генерация рекомендации
export function getAreaRecommendation(template, area) {
  const areaStr = area.toFixed(2).replace('.', ',');
  
  if (area < template.optimalArea - 5) {
    return `Для этой планировки оптимальна площадь ${template.optimalArea} м². При текущей площади (${areaStr} м²) некоторые комнаты могут быть тесными.`;
  }
  if (area > template.optimalArea + 10) {
    return `Площадь ${areaStr} м² избыточна для этой планировки. Рассмотрите более просторный вариант или добавление дополнительных зон.`;
  }
  return `Площадь ${areaStr} м² идеально подходит для данной планировки. Все комнаты будут комфортного размера.`;
}
