import { useState, useMemo } from 'react';
import type { CodeExample, Language } from '../../data/types';
import CopyButton from '../ui/CopyButton';

interface Props {
  code: CodeExample;
  title?: string;
}

const LANGUAGES: { key: Language; label: string; color: string }[] = [
  { key: 'python', label: 'Python', color: '#3776AB' },
  { key: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
  { key: 'java', label: 'Java', color: '#ED8B00' },
];

export default function CodeBlock({ code, title }: Props) {
  const [lang, setLang] = useState<Language>('python');
  const codeText = useMemo(() => code[lang], [code, lang]);

  return (
    <div className="code-window my-5">
      {/* Window header with dots */}
      <div className="code-window-header">
        <div className="code-window-dot" style={{ background: '#ff5f57' }}></div>
        <div className="code-window-dot" style={{ background: '#febc2e' }}></div>
        <div className="code-window-dot" style={{ background: '#28c840' }}></div>
        {title && (
          <span className="ml-3 text-xs text-gray-400 font-medium">{title}</span>
        )}
      </div>

      {/* Language tabs */}
      <div className="flex border-b border-white/[0.04]" style={{ background: '#181825' }}>
        {LANGUAGES.map(l => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className="relative px-4 py-2.5 text-xs font-medium transition-all duration-200"
            style={{
              color: lang === l.key ? l.color : '#6b7280',
              background: lang === l.key ? 'rgba(255,255,255,0.04)' : 'transparent',
            }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color, opacity: lang === l.key ? 1 : 0.3 }}></span>
              {l.label}
            </span>
            {lang === l.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: l.color }}></span>
            )}
          </button>
        ))}
      </div>

      {/* Code content */}
      <div className="relative" style={{ background: '#1e1e2e' }}>
        <CopyButton text={codeText} />
        <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-gray-200 scrollbar-thin">
          <code>{codeText}</code>
        </pre>
      </div>
    </div>
  );
}
