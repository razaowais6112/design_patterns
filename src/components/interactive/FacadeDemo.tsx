import { useState } from 'react';

export default function FacadeDemo() {
  const [showFacade, setShowFacade] = useState(false);

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />
        </svg>
        <span>Toggle to see how the Facade simplifies order processing</span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className={`text-sm font-medium transition-colors ${!showFacade ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>❌ Without Facade</span>
          <button
            onClick={() => setShowFacade(!showFacade)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: showFacade ? 'linear-gradient(135deg, #06b6d4, #22d3ee)' : 'rgba(0,0,0,0.12)' }}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${showFacade ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${showFacade ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>✅ With Facade</span>
        </div>

        {!showFacade ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400"><strong className="text-red-600 dark:text-red-400">Problem:</strong> Staff must manually interact with 5+ subsystems in the correct order.</span>
            </div>
            <div className="rounded-xl p-4 font-mono text-xs space-y-1" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
              <div style={{ color: '#f87171' }}>// Staff must know EVERY subsystem</div>
              <div style={{ color: '#6b7280' }}>orderSys = new OrderSystem()</div>
              <div style={{ color: '#6b7280' }}>paySys = new PaymentSystem()</div>
              <div style={{ color: '#6b7280' }}>invSys = new InventorySystem()</div>
              <div style={{ color: '#6b7280' }}>notifSys = new NotificationSystem()</div>
              <div style={{ color: '#6b7280' }}>delSys = new DeliverySystem()</div>
              <div style={{ color: '#f59e0b' }} className="mt-1">// Must call in RIGHT order:</div>
              <div style={{ color: '#6b7280' }}>invSys.checkStock(items)</div>
              <div style={{ color: '#6b7280' }}>orderSys.createOrder(items)</div>
              <div style={{ color: '#6b7280' }}>paySys.charge(amount)</div>
              <div style={{ color: '#6b7280' }}>invSys.decrement(items)</div>
              <div style={{ color: '#6b7280' }}>notifSys.sendConfirmation(orderId)</div>
              <div style={{ color: '#6b7280' }}>delSys.dispatch(orderId, address)</div>
              <div style={{ color: '#f87171' }} className="mt-1">😰 Too complex! Easy to make mistakes.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400"><strong className="text-emerald-600 dark:text-emerald-400">Solution:</strong> One Facade. One method. No subsystem knowledge required.</span>
            </div>
            <div className="rounded-xl p-4 font-mono text-xs space-y-1" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
              <div style={{ color: '#60a5fa' }}>// The Facade — hides all the complexity</div>
              <div style={{ color: '#60a5fa' }}>class TakeoutFacade {'{'}</div>
              <div style={{ color: '#6b7280' }} className="pl-4">// Handles ordering, payment, inventory,</div>
              <div style={{ color: '#6b7280' }} className="pl-4">// notifications, and delivery internally</div>
              <div style={{ color: '#60a5fa' }} className="pl-4">def placeOrder(items, amount, address):</div>
              <div style={{ color: '#34d399' }} className="pl-8">// Complex orchestration hidden here</div>
              <div style={{ color: '#60a5fa' }}>{'}'}</div>
              <div style={{ color: '#34d399' }} className="mt-1">// Staff just calls ONE method:</div>
              <div className="text-white">facade = TakeoutFacade()</div>
              <div className="text-white">result = facade.placeOrder(items, 15.99, "123 Main St")</div>
              <div style={{ color: '#34d399' }} className="mt-1">✅ Simple! Staff only needs the facade.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
