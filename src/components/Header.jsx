export default function Header() {
  return (
    <div className="text-center mb-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-mono mb-4">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        Генератор планировок
      </div>
      
      {/* Title */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent mb-2">
        Квартирография
      </h1>
      
      {/* Subtitle */}
      <p className="text-gray-400 max-w-2xl mx-auto">
        Подбор оптимальных планировок на основе анализа проектов Казанских застройщиков.
        Создавайте этажи из нескольких квартир или проектируйте отдельные планировки.
      </p>
    </div>
  );
}
