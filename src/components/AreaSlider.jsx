import { useState, useEffect } from 'react';

export default function AreaSlider({ value, min, max, onChange }) {
  const [inputValue, setInputValue] = useState(value.toString());
  
  // Синхронизация при внешнем изменении value
  useEffect(() => {
    setInputValue(value.toString().replace('.', ','));
  }, [value]);
  
  const handleInputChange = (e) => {
    let val = e.target.value;
    // Разрешаем цифры, точку и запятую
    val = val.replace(/[^\d.,]/g, '');
    // Заменяем точку на запятую для отображения
    setInputValue(val.replace('.', ','));
  };
  
  const handleInputBlur = () => {
    // Парсим значение: поддерживаем и точку, и запятую
    let parsed = parseFloat(inputValue.replace(',', '.'));
    
    if (isNaN(parsed)) {
      parsed = min;
    }
    
    // Ограничиваем диапазоном
    parsed = Math.max(min, Math.min(max, parsed));
    
    // Округляем до 2 знаков
    parsed = Math.round(parsed * 100) / 100;
    
    setInputValue(parsed.toString().replace('.', ','));
    onChange(parsed);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };
  
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setInputValue(val.toString().replace('.', ','));
    onChange(val);
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-3 font-mono">
        Площадь квартиры
      </label>
      <div className="bg-blueprint-bg/50 rounded-xl p-6 border border-gray-700/50">
        {/* Поле ввода */}
        <div className="text-center mb-4">
          <div className="inline-flex items-baseline gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-32 text-5xl font-bold text-white font-mono bg-transparent border-b-2 border-cyan-400/50 focus:border-cyan-400 outline-none text-center transition-colors"
              aria-label="Площадь квартиры"
            />
            <span className="text-xl text-gray-400">м²</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono">
            Введите значение от {min} до {max}
          </p>
        </div>
        
        {/* Слайдер */}
        <input
          type="range"
          min={min}
          max={max}
          step="0.1"
          value={value}
          onChange={handleSliderChange}
          className="w-full"
          aria-label="Ползунок площади"
        />
        
        {/* Метки диапазона */}
        <div className="flex justify-between mt-2 text-xs font-mono text-gray-500">
          <span>{min} м²</span>
          <span>{max} м²</span>
        </div>
      </div>
    </div>
  );
}
