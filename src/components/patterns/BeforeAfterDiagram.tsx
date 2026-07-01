import React from 'react';

const COMPLETED_PATTERNS = [
  'factory', 'builder', 'singleton', 'adapter', 'facade', 'observer', 'strategy', 'state', 'iterator', 'repository'
];

export default function BeforeAfterDiagram({ slug, accentColor }: { slug: string; accentColor: string }) {
  const [isDark, setIsDark] = React.useState(true);
  
  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const hasImages = COMPLETED_PATTERNS.includes(slug);

  const containerStyle: React.CSSProperties = {
    borderRadius: 14,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    background: isDark ? 'rgba(18,18,26,0.6)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    padding: '20px',
    margin: '18px 0 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    height: 'auto',
    borderRadius: 8,
    objectFit: 'contain',
    backgroundColor: '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
  };

  return (
    <div style={containerStyle}>
      {hasImages ? (
        <img 
          src={`/images/patterns/${slug}.png`} 
          alt={`${slug} diagram`} 
          style={imgStyle} 
        />
      ) : (
        <div style={{...imgStyle, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', background: isDark ? '#1a1a24' : '#f5f5f5'}}>
          Illustration pending
        </div>
      )}
    </div>
  );
}
