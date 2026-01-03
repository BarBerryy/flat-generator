import { roomTypes } from '../data/layoutTemplates';

export default function RoomSelector({ selectedType, onSelect }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-3 font-mono">
        Комнатность
      </label>
      <div className="grid grid-cols-4 gap-2">
        {roomTypes.map(type => (
          <RoomTypeButton
            key={type.id}
            type={type}
            isSelected={selectedType === type.id}
            onClick={() => onSelect(type.id)}
          />
        ))}
      </div>
    </div>
  );
}

function RoomTypeButton({ type, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-xl border transition-all duration-300
        ${isSelected
          ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
          : 'border-gray-600/50 text-gray-400 hover:border-gray-500 hover:text-gray-300'
        }
      `}
      aria-pressed={isSelected}
    >
      <div className="text-2xl mb-1">{type.icon}</div>
      <div className="text-sm font-medium">{type.name}</div>
    </button>
  );
}
