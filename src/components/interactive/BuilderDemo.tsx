import { useState } from 'react';

interface BurgerBuild {
  patty: string | null;
  bun: string | null;
  cheese: boolean;
  lettuce: boolean;
  tomato: boolean;
  sauce: string | null;
}

const patties = ['Beef', 'Chicken', 'Veggie', 'Fish'];
const buns = ['Brioche', 'Sesame', 'Whole Wheat', 'Gluten-free'];
const sauces = ['BBQ', 'Mayo', 'Ketchup', 'Spicy Mayo'];

export default function BuilderDemo() {
  const [burger, setBurger] = useState<BurgerBuild>({
    patty: null, bun: null, cheese: false,
    lettuce: false, tomato: false, sauce: null,
  });
  const [built, setBuilt] = useState(false);

  const set = (key: keyof BurgerBuild, value: any) => {
    setBurger(prev => ({ ...prev, [key]: value }));
    setBuilt(false);
  };

  const hasAllRequired = burger.patty && burger.bun;

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <span>Try it: Build your own burger step by step</span>
      </div>

      <div className="grid md:grid-cols-2 gap-5 p-5">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">1. Choose patty</label>
            <div className="flex flex-wrap gap-2">
              {patties.map(p => (
                <button key={p} onClick={() => set('patty', p)}
                  className={`chip ${burger.patty === p ? 'active' : ''}`}>{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">2. Choose bun</label>
            <div className="flex flex-wrap gap-2">
              {buns.map(b => (
                <button key={b} onClick={() => set('bun', b)}
                  className={`chip ${burger.bun === b ? 'active' : ''}`}>{b}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">3. Add extras</label>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'cheese' as const, label: 'Cheese', emoji: '🧀' },
                { key: 'lettuce' as const, label: 'Lettuce', emoji: '🥬' },
                { key: 'tomato' as const, label: 'Tomato', emoji: '🍅' },
              ].map(({ key, label, emoji }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group">
                  <input type="checkbox" checked={burger[key] as boolean} onChange={e => set(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500" />
                  <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{emoji} {label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">4. Add sauce</label>
            <div className="flex flex-wrap gap-2">
              {sauces.map(s => (
                <button key={s} onClick={() => set('sauce', s)}
                  className={`chip ${burger.sauce === s ? 'active' : ''}`}>{s}</button>
              ))}
            </div>
          </div>

          <button
            onClick={() => hasAllRequired && setBuilt(true)}
            disabled={!hasAllRequired}
            className="btn-primary w-full"
            style={hasAllRequired ? { background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' } : { background: '#374151', boxShadow: 'none', opacity: 0.5, cursor: 'not-allowed' }}
          >
            {hasAllRequired ? '🍔 Build Burger!' : 'Select patty and bun first'}
          </button>
        </div>

        {/* Result */}
        <div className="rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px]"
          style={{ background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
          {built ? (
            <>
              <div className="text-5xl mb-3">🍔</div>
              <div className="text-center">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{burger.patty} Burger</h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="flex items-center justify-center gap-1.5">🍞 {burger.bun} bun</p>
                  {burger.cheese && <p className="flex items-center justify-center gap-1.5">🧀 Cheese</p>}
                  {burger.lettuce && <p className="flex items-center justify-center gap-1.5">🥬 Lettuce</p>}
                  {burger.tomato && <p className="flex items-center justify-center gap-1.5">🍅 Tomato</p>}
                  {burger.sauce && <p className="flex items-center justify-center gap-1.5">🥫 {burger.sauce}</p>}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 italic">Built step by step with the Builder pattern!</p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-30">🍞</div>
              <p className="text-sm text-gray-400 dark:text-gray-500">Your burger will appear here<br />after you build it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
