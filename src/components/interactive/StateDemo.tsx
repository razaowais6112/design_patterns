import { useState } from 'react';

type OrderPhase = 'received' | 'cooking' | 'ready' | 'delivered';

interface StateInfo {
  label: string;
  icon: string;
  color: string;
  allowed: { action: string; next: OrderPhase | null; label: string }[];
  description: string;
}

const states: Record<OrderPhase, StateInfo> = {
  received: {
    label: 'Received', icon: '📥', color: '#8b5cf6',
    description: 'Order has been placed. Items can still be added.',
    allowed: [
      { action: 'cook', next: 'cooking', label: 'Start Cooking →' },
      { action: 'serve', next: null, label: '❌ Can\'t serve — not cooked yet' },
      { action: 'deliver', next: null, label: '❌ Can\'t deliver — not ready' },
    ]
  },
  cooking: {
    label: 'Cooking', icon: '🍳', color: '#f59e0b',
    description: 'Order is being prepared. No more items can be added.',
    allowed: [
      { action: 'cook', next: null, label: '❌ Already cooking' },
      { action: 'serve', next: 'ready', label: 'Mark as Ready →' },
      { action: 'deliver', next: null, label: '❌ Not ready yet' },
    ]
  },
  ready: {
    label: 'Ready', icon: '✅', color: '#10b981',
    description: 'Order is ready for pickup or delivery.',
    allowed: [
      { action: 'cook', next: null, label: '❌ Already done' },
      { action: 'serve', next: null, label: '✅ Already marked ready' },
      { action: 'deliver', next: 'delivered', label: 'Deliver →' },
    ]
  },
  delivered: {
    label: 'Delivered', icon: '📦', color: '#6b7280',
    description: 'Order has been delivered. No further actions.',
    allowed: [
      { action: 'cook', next: null, label: '❌ Already delivered' },
      { action: 'serve', next: null, label: '❌ Already delivered' },
      { action: 'deliver', next: null, label: '❌ Already delivered' },
    ]
  }
};

export default function StateDemo() {
  const [phase, setPhase] = useState<OrderPhase>('received');
  const [history, setHistory] = useState<string[]>(['Order created']);

  const performAction = (action: string, next: OrderPhase | null, label: string) => {
    if (next) {
      setPhase(next);
      setHistory(prev => [...prev, `Action: ${action} → State: ${states[next].label}`]);
    } else {
      setHistory(prev => [...prev, `🚫 ${label}`]);
    }
  };

  const reset = () => {
    setPhase('received');
    setHistory(['Order created (reset)']);
  };

  const current = states[phase];

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6" />
        </svg>
        <span>Try it: Click actions to see how state controls behavior</span>
      </div>

      <div className="grid md:grid-cols-2 gap-5 p-5">
        {/* State machine view */}
        <div className="space-y-4">
          {/* Current state */}
          <div className="rounded-xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{current.icon}</span>
              <span className="text-lg font-bold">{current.label}</span>
            </div>
            <p className="text-sm opacity-90">{current.description}</p>
          </div>

          {/* Allowed actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Actions</h4>
            {current.allowed.map((a, i) => (
              <button key={i} onClick={() => performAction(a.action, a.next, a.label)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                disabled={!a.next}
                style={a.next ? {
                  background: `${current.color}10`,
                  border: `1px solid ${current.color}20`,
                  color: current.color,
                  fontWeight: 600,
                } : {
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid transparent',
                  color: '#9ca3af',
                  cursor: 'not-allowed',
                }}
              >
                {a.label}
              </button>
            ))}
          </div>

          <button onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            Reset Order
          </button>
        </div>

        {/* History log */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Action Log</h4>
          <div className="rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
            {history.map((entry, i) => (
              <div key={i} style={{ color: entry.startsWith('🚫') ? '#f87171' : entry.startsWith('Order') ? '#6b7280' : '#34d399' }}>
                <span className="text-gray-600 mr-2">{i + 1}.</span>{entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
