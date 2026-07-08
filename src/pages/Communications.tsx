import React, { useState } from 'react';
import { Search, Sparkles, MessageSquare, AlertTriangle, CheckSquare, Mail, Terminal, Send, Check } from 'lucide-react';

interface CommunicationMessage {
  id: string;
  sender: string;
  role: string;
  flag: string;
  originalText: string;
  translation: string;
  sentiment: 'URGENT' | 'NEUTRAL' | 'WARNING';
  channel: string;
  language: string;
  time: string;
  isAiProcessed: boolean;
  actions: string[];
}

export const Communications: React.FC = () => {
  const messages: CommunicationMessage[] = [
    {
      id: '1',
      sender: 'AIS System',
      role: 'System Broadcast',
      flag: '📡',
      originalText: 'EVER ONWARDS MMSI:636017234 — Position: 41.24N 2.06E — Speed: 14.2kts — Course: 220° — Draught: 15.8m',
      translation: 'EVER ONWARDS MMSI:636017234 — Position: 41.24N 2.06E — Speed: 14.2kts — Course: 220° — Draught: 15.8m',
      sentiment: 'NEUTRAL',
      channel: 'AIS',
      language: 'English',
      time: '02:41 PM',
      isAiProcessed: true,
      actions: ['Log speed parameters', 'Compare berth ETA against AIS trajectory']
    },
    {
      id: '2',
      sender: 'MSC BARCELONA',
      role: 'Master',
      flag: '🇫🇷',
      originalText: 'Bonjour Port Control, MSC BARCELONA ici. ETA pilote dans 90 minutes. Demande confirmation de la disponibilité du remorqueur.',
      translation: 'Hello Port Control, MSC BARCELONA here. ETA pilot in 90 minutes. Requesting confirmation of tug availability.',
      sentiment: 'NEUTRAL',
      channel: 'VHF Ch 16',
      language: 'French',
      time: '02:36 PM',
      isAiProcessed: true,
      actions: ['Confirm pilot booking', 'Dispatch tug confirmation']
    },
    {
      id: '3',
      sender: 'TANKER IBERIA',
      role: 'Chief Officer',
      flag: '🇸🇦',
      originalText: 'نحن بحاجة إلى مرشد ميناء على وجه السرعة. شهادات البضائع الخطرة جاهزة للتفتيش في المرسى 3.',
      translation: 'We urgently need a port pilot. Dangerous goods certificates are ready for inspection at berth 3.',
      sentiment: 'URGENT',
      channel: 'VHF Ch 16',
      language: 'Arabic',
      time: '02:33 PM',
      isAiProcessed: true,
      actions: ['Prioritize port pilot allocation', 'Coordinate Hazmat inspection team']
    },
    {
      id: '4',
      sender: 'Grimaldi Lines Agency',
      role: 'Agent',
      flag: '🏴',
      originalText: 'Benvolgut control portuari, el GRAND ZEPHYR necessita canvi de moll. Moll actual RoRo-T2 no disponible.',
      translation: 'Dear port control, GRAND ZEPHYR needs berth change. Current berth RoRo-T2 unavailable.',
      sentiment: 'NEUTRAL',
      channel: 'EMAIL',
      language: 'Catalan',
      time: '02:24 PM',
      isAiProcessed: true,
      actions: [
        'Find alternative berth for GRAND ZEPHYR',
        'Update berthing schedule',
        'Notify vessel agent'
      ]
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('4');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});

  const toggleAction = (key: string) => {
    setActionStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedMsg = messages.find(m => m.id === selectedId) || messages[3];

  const filteredMessages = messages.filter(m => 
    m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.originalText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '20px', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', margin: 0 }}>
              Multilingual Communication Center
            </h1>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '11px', 
              backgroundColor: 'rgba(74, 222, 128, 0.1)', 
              color: '#4ade80', 
              border: '1px solid rgba(74, 222, 128, 0.2)', 
              padding: '2px 8px', 
              borderRadius: '20px',
              fontWeight: 600
            }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
              AI Active
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Model: Whisper + GPT-4o · Real-time auto-translation and action items extraction
          </p>
        </div>

        {/* Quick Weather & Status Panel */}
        <div className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Current Time</span>
            <span style={{ fontWeight: 600 }}>17:31:54 UTC+2</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Wind</span>
            <span style={{ fontWeight: 600 }}>SW 14 kt</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Visibility</span>
            <span style={{ fontWeight: 600 }}>12 NM vis</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Temp</span>
            <span style={{ fontWeight: 600 }}>24°C</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Port State</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>Port: Good</span>
          </div>
        </div>
      </div>

      {/* Search & Processing Banner */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* Search Bar */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder="Search vessels..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <span style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)', marginLeft: '10px' }}>
            ⌘K
          </span>
          <span style={{ fontSize: '11px', backgroundColor: 'var(--accent-blue)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, marginLeft: '10px' }}>
            4
          </span>
        </div>

        {/* AI Multilingual Info */}
        <div className="glass-panel" style={{ flex: 2, display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', fontSize: '13px', color: 'white', gap: '8px' }}>
          <Sparkles size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontWeight: 600, marginRight: '6px' }}>AI Multilingual Processing:</span>
            <span style={{ color: 'var(--text-secondary)' }}>Arabic • Spanish • Catalan • French • Chinese • English — Auto-translate & task extraction</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace Split */}
      <div style={{ display: 'flex', flex: 1, gap: '24px', minHeight: '450px', paddingBottom: '32px' }}>
        
        {/* Left Column: Recent Messages List */}
        <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px 0' }}>
            Recent Communications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {filteredMessages.map((msg) => {
              const isSelected = msg.id === selectedId;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : undefined,
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{msg.flag}</span>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>{msg.sender}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({msg.role})</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{msg.time}</span>
                  </div>

                  <p style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    margin: '0 0 12px 0', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {msg.originalText}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: 700, 
                      backgroundColor: msg.sentiment === 'URGENT' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.08)',
                      color: msg.sentiment === 'URGENT' ? '#ef4444' : 'var(--text-secondary)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: msg.sentiment === 'URGENT' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255,255,255,0.12)'
                    }}>
                      {msg.sentiment}
                    </span>
                    {msg.isAiProcessed && (
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                        color: '#60a5fa', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        border: '1px solid rgba(59, 130, 246, 0.25)'
                      }}>
                        AI Processed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Pane */}
        <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px 0' }}>
            Message Detail
          </h3>

          <div className="glass-panel" style={{ flex: 1, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
            
            {/* Header metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{selectedMsg.flag}</span>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>
                      {selectedMsg.sender}
                    </h2>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{selectedMsg.role}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>→ Port Scheduler · {selectedMsg.channel} · {selectedMsg.language}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                backgroundColor: selectedMsg.sentiment === 'URGENT' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.08)', 
                color: selectedMsg.sentiment === 'URGENT' ? '#ef4444' : 'var(--text-secondary)', 
                padding: '4px 10px', 
                borderRadius: '6px',
                border: selectedMsg.sentiment === 'URGENT' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.15)'
              }}>
                {selectedMsg.sentiment}
              </span>
            </div>

            {/* Original message text box */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Original Message
              </div>
              <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'white', lineHeight: 1.5 }}>
                {selectedMsg.originalText}
              </div>
            </div>

            {/* Translation box */}
            {selectedMsg.language !== 'English' && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} />
                  <span>AI Translation (English)</span>
                </div>
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)', fontSize: '13px', color: 'white', lineHeight: 1.5 }}>
                  {selectedMsg.translation}
                </div>
              </div>
            )}

            {/* Actions list */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={12} />
                <span>AI Extracted Action Items</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedMsg.actions.map((act, index) => {
                  const key = `${selectedMsg.id}-${index}`;
                  const isChecked = !!actionStates[key];
                  return (
                    <div 
                      key={index} 
                      onClick={() => toggleAction(key)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: isChecked ? 'rgba(52, 211, 153, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                        padding: '10px 14px', 
                        borderRadius: '8px', 
                        border: isChecked ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        border: isChecked ? '1.5px solid #34d399' : '1.5px solid rgba(255,255,255,0.3)', 
                        backgroundColor: isChecked ? '#34d399' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isChecked && <Check size={12} color="black" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '12px', color: isChecked ? '#a7f3d0' : 'white', textDecoration: isChecked ? 'line-through' : 'none' }}>
                        {act}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <button style={{ 
                width: '100%', 
                height: '44px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--accent-blue)', 
                border: 'none', 
                color: 'white', 
                fontWeight: 600, 
                fontSize: '13px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-blue)'}
              >
                <Send size={14} />
                Process New Communication
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
