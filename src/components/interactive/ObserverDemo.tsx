import { useState, useCallback } from 'react';

type OrderStatus = 'received' | 'cooking' | 'ready' | 'delivered';

interface ObserverLog {
  name: string;
  message: string;
  time: number;
}

const statusSteps: OrderStatus[] = ['received', 'cooking', 'ready', 'delivered'];

const statusLabels: Record<OrderStatus, string> = {
  received: '📥 Order Received',
  cooking: '🍳 Cooking',
  ready: '✅ Ready for Pickup',
  delivered: '📦 Delivered',
};

const statusColors: Record<OrderStatus, string> = {
  received: '#8b5cf6',
  cooking: '#f59e0b',
  ready: '#10b981',
  delivered: '#6b7280',
};

export default function ObserverDemo() {
  const [status, setStatus] = useState<OrderStatus>('received');
  const [logs, setLogs] = useState<ObserverLog[]>([]);
  const [observers, setObservers] = useState({
    kitchen: true,
    customer: true,
    loyalty: true,
    analytics: true,
  });

  const addLog = useCallback((name: string, message: string) => {
    setLogs(prev => [...prev.slice(-19), { name, message, time: Date.now() }]);
  }, []);

  const advanceStatus = () => {
    const idx = statusSteps.indexOf(status);
    if (idx < statusSteps.length - 1) {
      const nextStatus = statusSteps[idx + 1];
      setStatus(nextStatus);

      const notify = (name: string, msg: string) => {
        setTimeout(() => addLog(name, msg), 100);
      };

      if (observers.kitchen) notify('Kitchen Display', `Order status updated to: ${nextStatus}`);
      if (observers.customer) notify('Customer Notifier', `📱 Your order is now: ${statusLabels[nextStatus]}`);
      if (observers.loyalty) notify('Loyalty Tracker', `Points updated for status: ${nextStatus}`);
      if (observers.analytics) notify('Analytics', `Event: order_status → ${nextStatus}`);
    }
  };

  const reset = () => {
    setStatus('received');
    setLogs([]);
  };

  const canAdvance = status !== 'delivered';

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>Try it: Advance the order status and watch observers get notified</span>
      </div>

      <div className="grid md:grid-cols-2 gap-5 p-5">
        {/* Left: State + Controls */}
        <div className="space-y-4">
          {/* Status timeline */}
          <div className="space-y-2">
            {statusSteps.map((s, i) => {
              const isActive = statusSteps.indexOf(status) >= i;
              const color = statusColors[s];
              return (
                <div key={s} className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300"
                  style={{
                    background: isActive ? `${color}10` : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isActive ? `${color}20` : 'transparent'}`,
                  }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      background: isActive ? color : 'rgba(0,0,0,0.06)',
                      color: isActive ? 'white' : '#9ca3af',
                    }}>{i + 1}</div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                    {statusLabels[s]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Observer toggles */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Subscribed Observers</label>
            <div className="space-y-2">
              {([
                { key: 'kitchen' as const, label: '🍳 Kitchen Display' },
                { key: 'customer' as const, label: '📱 Customer Notifier' },
                { key: 'loyalty' as const, label: '⭐ Loyalty Tracker' },
                { key: 'analytics' as const, label: '📊 Analytics Dashboard' },
              ]).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer group">
                  <input type="checkbox" checked={observers[key]}
                    onChange={e => setObservers(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500" />
                  <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={advanceStatus} disabled={!canAdvance}
              className="btn-primary flex-1"
              style={canAdvance ? { background: `linear-gradient(135deg, ${statusColors[statusSteps[statusSteps.indexOf(status) + 1] || 'received']}, ${statusColors[status]})` } : { background: '#374151', boxShadow: 'none', opacity: 0.5, cursor: 'not-allowed' }}
            >
              {canAdvance ? `Advance to ${statusLabels[statusSteps[statusSteps.indexOf(status) + 1]]}` : 'Order Complete'}
            </button>
            <button onClick={reset}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.06]"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              Reset
            </button>
          </div>
        </div>

        {/* Right: Logs */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Observer Notification Log</h4>
          <div className="rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
            {logs.length === 0 && (
              <p className="text-gray-500 italic">Advance the order status to see observer notifications...</p>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-gray-500 flex-shrink-0">[{log.name}]</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
