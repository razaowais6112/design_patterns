import { useState } from 'react';

const strategies = [
  { id: 'regular', label: 'Regular customer', calc: (subtotal: number) => subtotal },
  { id: 'loyalty', label: 'Loyalty member (10% off)', calc: (subtotal: number) => subtotal * 0.9 },
  { id: 'employee', label: 'Employee discount (20% off)', calc: (subtotal: number) => subtotal * 0.8 },
  { id: 'lunch', label: 'Lunch special ($2 off)', calc: (subtotal: number) => subtotal - 2 },
  { id: 'student', label: 'Student discount (15% off)', calc: (subtotal: number) => subtotal * 0.85 },
];

const menuItems = [
  { name: 'Classic Beef Burger', price: 7.99 },
  { name: 'Crispy Chicken Burger', price: 6.99 },
  { name: 'Hand-cut Fries', price: 2.99 },
  { name: 'Milkshake', price: 3.49 },
  { name: 'Side Salad', price: 2.49 },
];

export default function StrategyDemo() {
  const [selected, setSelected] = useState(strategies[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(menuItems.map(i => [i.name, 0]))
  );

  const updateQty = (name: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const subtotal = menuItems.reduce((sum, item) => sum + item.price * (quantities[item.name] || 0), 0);
  const total = selected.calc(subtotal);

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Try it: Select a pricing strategy and see the total change</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map(item => (
            <div key={item.name} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.name} — <span className="tabular-nums font-medium">${item.price.toFixed(2)}</span></span>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.name, -1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}>−</button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{quantities[item.name]}</span>
                <button onClick={() => updateQty(item.name, 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Strategy selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Pricing Strategy</label>
          <select
            value={selected.id}
            onChange={e => setSelected(strategies.find(s => s.id === e.target.value) || strategies[0])}
            className="w-full rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white transition-all cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            {strategies.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div className="rounded-xl p-5 space-y-2 text-sm" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
          <div className="flex justify-between"><span className="text-gray-400">Subtotal:</span><span className="tabular-nums font-medium">${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between" style={{ color: '#fbbf24' }}><span>Strategy:</span><span className="text-sm">{selected.label}</span></div>
          <div className="h-px my-1" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
          <div className="flex justify-between font-bold text-base">
            <span>Total:</span>
            <span className="tabular-nums" style={{ color: '#34d399' }}>${Math.max(0, total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
