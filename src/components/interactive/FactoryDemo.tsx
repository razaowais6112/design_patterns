import { useState } from 'react';

interface BurgerType {
  id: string;
  name: string;
  patty: string;
  cookMethod: string;
  emoji: string;
}

const burgers: BurgerType[] = [
  { id: 'beef', name: 'Classic Beef', patty: 'Beef patty (grilled)', cookMethod: 'Grilled to perfection', emoji: '🥩' },
  { id: 'chicken', name: 'Crispy Chicken', patty: 'Chicken patty (fried)', cookMethod: 'Deep fried golden', emoji: '🍗' },
  { id: 'veggie', name: 'Garden Veggie', patty: 'Veggie patty (baked)', cookMethod: 'Baked until crispy', emoji: '🥬' },
  { id: 'fish', name: 'Ocean Catch', patty: 'Fish fillet (grilled)', cookMethod: 'Lightly grilled', emoji: '🐟' },
];

export default function FactoryDemo() {
  const [selected, setSelected] = useState<BurgerType | null>(null);
  const [producing, setProducing] = useState(false);
  const [done, setDone] = useState(false);

  const produce = async (burger: BurgerType) => {
    setSelected(burger);
    setProducing(true);
    setDone(false);
    // Simulate the factory production delay
    await new Promise(r => setTimeout(r, 800));
    setProducing(false);
    setDone(true);
  };

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 18h18M6 18V9l6-4 6 4v9M9 12h6M9 15h6" />
        </svg>
        <span>Try it: Click a burger type to see the factory create it</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {burgers.map(b => (
            <button key={b.id} onClick={() => produce(b)}
              disabled={producing}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                selected?.id === b.id && done
                  ? 'ring-2 ring-purple-500 shadow-lg'
                  : ''
              } ${producing ? 'pointer-events-none opacity-50' : 'hover:scale-[1.02]'}`}
              style={{
                background: selected?.id === b.id && done ? 'rgba(139, 92, 246, 0.08)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${selected?.id === b.id && done ? 'rgba(139, 92, 246, 0.3)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <div className="text-3xl mb-2">{b.emoji}</div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white">{b.name}</div>
            </button>
          ))}
        </div>

        {/* Factory output */}
        <div className="rounded-xl p-5 min-h-[80px]" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
          {!selected && !producing && (
            <p className="text-gray-500 text-sm italic">Choose a burger type above — the factory will create it...</p>
          )}
          {producing && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#fbbf24' }}>
              <span className="animate-pulse">⚙️</span>
              <span>Factory: Creating your burger...</span>
            </div>
          )}
          {done && selected && (
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-1.5" style={{ color: '#34d399' }}>✅ <span className="text-white">BurgerFactory created: <strong>{selected.name}</strong></span></p>
              <p className="text-gray-400 pl-6">🥩 {selected.patty}</p>
              <p className="text-gray-400 pl-6">🍳 {selected.cookMethod}</p>
              <p className="text-gray-600 pl-6 text-xs mt-2 italic">// The kitchen doesn't know which burger type — the factory handles everything</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
