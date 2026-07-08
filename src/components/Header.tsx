import React from 'react';
import { Sparkles, ChevronDown, Bell, Mic, Send, Anchor } from 'lucide-react';

interface HeaderProps {
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header 
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px 0 0',
        userSelect: 'none',
        flexShrink: 0,
        backgroundColor: 'transparent'
      }}
    >
      {/* Left side: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="28" 
          viewBox="92 28 32 33"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <style>{`.a{fill:#ffffff;}.b{fill:#3b82f6;}`}</style>
          </defs>
          <path className="a" d="M92.334,44.508l15.905-16.042,6.718,6.65L98.984,51.158Z"/>
          <path className="b" d="M108.787,60.961,102,54.106c2.194-10.969,10.009-6.307,14.191-17.893l6.993,6.718c-4.182,11.792-11.517,6.582-14.4,18.03"/>
        </svg>
        <span style={{ 
          marginLeft: '12px', 
          fontFamily: 'var(--font-sans)', 
          fontSize: '18px', 
          fontWeight: 600, 
          color: '#ffffff',
          letterSpacing: '-0.3px',
          whiteSpace: 'nowrap'
        }}>
          Port de Barcelona
        </span>
      </div>

      {/* Middle: Search Bar */}
      <div style={{ flex: '0 1 500px', margin: '0 40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="glass-dark-panel" style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'var(--glass-dark-bg)' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, var(--accent-cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={14} color="white" />
          </div>
          <input 
            type="text" 
            placeholder="How can I help you?" 
            className="light-placeholder"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              padding: '8px 16px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
        
        <div className="glass-dark-panel" style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'var(--glass-dark-bg)' }}>
          <Send size={18} color="var(--text-secondary)" />
        </div>
        <div className="glass-dark-panel" style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'var(--glass-dark-bg)' }}>
          <Mic size={18} color="var(--text-secondary)" />
        </div>
      </div>

      <div style={{ flex: 1 }}></div>
    </header>
  );
};
