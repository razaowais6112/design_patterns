import { useState } from 'react';

const menuItems = [
  { name: 'Classic Beef Burger', price: 7.99, available: true, category: 'mains' },
  { name: 'Crispy Chicken Burger', price: 6.99, available: true, category: 'mains' },
  { name: 'Grilled Fish Burger', price: 8.49, available: false, category: 'mains' },
  { name: 'Hand-cut Fries', price: 2.99, available: true, category: 'sides' },
  { name: 'Onion Rings', price: 3.49, available: true, category: 'sides' },
  { name: 'Side Salad', price: 2.49, available: false, category: 'sides' },
  { name: 'Chocolate Milkshake', price: 4.49, available: true, category: 'drinks' },
  { name: 'Lemonade', price: 1.99, available: true, category: 'drinks' },
  { name: 'Iced Tea', price: 1.99, available: false, category: 'drinks' },
];

type TraversalMode = 'all' | 'available' | 'reverse';

const modeLabels: Record<TraversalMode, string> = {
  all: '🔢 Forward (all items)',
  available: '✅ Available only',
  reverse: '🔙 Reverse order',
};

export default function IteratorDemo() {
  const [mode, setMode] = useState<TraversalMode>('all');

  const getItems = () => {
    switch (mode) {
      case 'all':
        return menuItems;
      case 'available':
        return menuItems.filter(i => i.available);
      case 'reverse':
        return [...menuItems].reverse();
    }
  };

  const items = getItems();

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
        </svg>
        <span>Try it: Choose a traversal strategy and see the result</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(modeLabels) as [TraversalMode, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setMode(key)}
              className={`chip ${mode === key ? 'active' : ''}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: '#1e1e2e' }}>
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#6b7280', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Item</span>
            <span>Price</span>
            <span>Status</span>
          </div>
          {/* Items */}
          {items.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-500 text-sm">No items match this iterator</div>
          )}
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 px-5 py-2.5 text-sm transition-colors"
              style={{
                color: item.available ? '#e2e8f0' : '#6b7280',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
              <span>{item.available ? item.name : <span className="line-through">{item.name}</span>}</span>
              <span className="tabular-nums">${item.price.toFixed(2)}</span>
              <span className="text-xs font-medium" style={{ color: item.available ? '#34d399' : '#f87171' }}>
                {item.available ? 'In stock' : 'Sold out'}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          Iterator: {mode === 'all' ? 'Traversing all items in forward order' : mode === 'available' ? 'Skipping unavailable items (filtering iterator)' : 'Traversing in reverse order'}
        </p>
      </div>
    </div>
  );
}
