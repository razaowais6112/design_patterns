import { useState } from 'react';

export default function AdapterDemo() {
  const [showAdapter, setShowAdapter] = useState(false);

  return (
    <div className="demo-container my-6">
      <div className="demo-header">
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span>Toggle to see how the Adapter bridges incompatible interfaces</span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className={`text-sm font-medium transition-colors ${!showAdapter ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>❌ Without Adapter</span>
          <button
            onClick={() => setShowAdapter(!showAdapter)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: showAdapter ? 'linear-gradient(135deg, #06b6d4, #22d3ee)' : 'rgba(0,0,0,0.12)' }}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${showAdapter ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${showAdapter ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>✅ With Adapter</span>
        </div>

        {!showAdapter ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400"><strong className="text-red-600 dark:text-red-400">Problem:</strong> Your system expects <code className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>processPayment(amount)</code> but QuickPay has <code className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>makePayment(amount, merchantId)</code>.</span>
            </div>
            <div className="rounded-xl p-4 space-y-2 font-mono text-xs" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
              <div style={{ color: '#6b7280' }}>// Restaurant's expected interface:</div>
              <div style={{ color: '#34d399' }}>interface PaymentProcessor {'{'}</div>
              <div style={{ color: '#34d399' }} className="pl-4">String process(double amount);</div>
              <div style={{ color: '#34d399' }}>{'}'}</div>
              <div style={{ color: '#6b7280' }} className="mt-2">// QuickPay's incompatible interface:</div>
              <div style={{ color: '#f87171' }}>class QuickPayAPI {'{'}</div>
              <div style={{ color: '#f87171' }} className="pl-4">int makePayment(double amount, String merchantId);</div>
              <div style={{ color: '#f87171' }}>{'}'}</div>
              <div style={{ color: '#f87171' }} className="mt-1">→ These DON'T match! Restaurant can't use QuickPay.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400"><strong className="text-emerald-600 dark:text-emerald-400">Solution:</strong> QuickPayAdapter implements <code className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>PaymentProcessor</code> and wraps QuickPayAPI.</span>
            </div>
            <div className="rounded-xl p-4 space-y-2 font-mono text-xs" style={{ background: '#1e1e2e', color: '#e2e8f0' }}>
              <div style={{ color: '#6b7280' }}>// The Adapter — implements the expected interface</div>
              <div style={{ color: '#60a5fa' }}>class QuickPayAdapter implements PaymentProcessor {'{'}</div>
              <div style={{ color: '#60a5fa' }} className="pl-4">QuickPayAPI api = new QuickPayAPI();</div>
              <div style={{ color: '#6b7280' }} className="pl-4">// Translates process() → makePayment()</div>
              <div style={{ color: '#60a5fa' }} className="pl-4">String process(double amount) {'{'}</div>
              <div style={{ color: '#60a5fa' }} className="pl-8">int code = api.makePayment(amount, merchantId);</div>
              <div style={{ color: '#60a5fa' }} className="pl-8">return "QuickPay: $" + amount + " (code " + code + ")";</div>
              <div style={{ color: '#60a5fa' }} className="pl-4">{'}'}</div>
              <div style={{ color: '#60a5fa' }}>{'}'}</div>
              <div style={{ color: '#34d399' }} className="mt-1">✅ Restaurant uses QuickPayAdapter seamlessly — no code changes needed!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
