import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Mic, Send, ChevronDown, Check, X, Sliders, MessageSquare, ClipboardList, Map, Anchor, ThumbsUp, ThumbsDown } from 'lucide-react';
import { answerQuestion, findVesselByFuzzyName } from '../lib/aiAssistant';
import type { PageId } from '../types';

type UserRole = 'port-service-provider' | 'tug-operator' | 'ship-agent' | 'harbour-pilot';

interface ChatAction {
  label: string;
  type: 'approve_allocation' | 'modify_allocation' | 'decline_allocation' | 'contact_vessel' | 'view_checklist' | 'view_live_map' | 'check_tugs';
  primary?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  isStreaming?: boolean;
  isThinking?: boolean;
  thinkingText?: string;
  vesselName?: string;
  suggestedQuestions?: string[];
  actions?: ChatAction[];
  actionStatus?: 'Approved' | 'Declined';
  feedback?: 'up' | 'down';
}

const SUGGESTED_PROMPTS = [
  'Why is the tug boat allocation done for GRAND ZEPHYR?',
  "What's the status of MSC BARCELONA?",
  'Which pilots are available right now?'
];

interface HeaderProps {
  pageTitle?: string;
  isLightMode?: boolean;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onSelectVesselForAllocation?: (vesselName: string | null) => void;
  onPageChange?: (pageId: PageId) => void;
}

const ROLES: { id: UserRole; label: string; shortLabel: string }[] = [
  { id: 'port-service-provider', label: 'Port Service Provider', shortLabel: 'Port Service Provider' },
  { id: 'tug-operator', label: 'Tug Operator', shortLabel: 'Tug Operator' },
  { id: 'ship-agent', label: 'Ship Agent', shortLabel: 'Ship Agent' },
  { id: 'harbour-pilot', label: 'Harbour Pilot', shortLabel: 'Harbour Pilot' }
];

const getThinkingStepsForQuestion = (question: string, vesselName?: string): string[] => {
  const qLower = question.toLowerCase();
  const v = vesselName || "requested vessel";
  
  if (qLower.includes('why') || qLower.includes('allocat') || qLower.includes('assign')) {
    return [
      `Searching port database logs for ${v}...`,
      `Retrieving deterministic resource assignment matrix...`,
      `Checking harbor regulations and wind safety parameters...`,
      `Verifying harbor pilot credentials and tug crew rosters...`
    ];
  }
  if (qLower.includes('status') || qLower.includes('where') || qLower.includes('eta')) {
    return [
      `Contacting real-time AIS transponder feed for ${v}...`,
      `Scanning dock occupancy and scheduled berth updates...`,
      `Evaluating risk profile index and current draft safety margins...`
    ];
  }
  if (qLower.includes('pilot') || qLower.includes('tug') || qLower.includes('berth')) {
    return [
      `Accessing real-time resource registry...`,
      `Filtering active duty logs for available units...`,
      `Structuring availability records...`
    ];
  }
  return [
    `Parsing query token metadata...`,
    `Querying port intelligence databases...`,
    `Formulating optimal collaborative advice...`
  ];
};

const getSuggestedQuestionsForAnswer = (question: string, answer: any): string[] => {
  const qLower = question.toLowerCase();
  const vName = answer.vessel?.name;

  if (vName) {
    if (qLower.includes('why') || qLower.includes('allocat')) {
      return [
        `What is the risk level of ${vName}?`,
        `When is ${vName} expected to arrive (ETA)?`,
        `Are there other pilots certified for ${vName}?`
      ];
    } else {
      return [
        `Why is this allocation done for ${vName}?`,
        `Who is the ship operator for ${vName}?`,
        `Show me available berths for ${vName}`
      ];
    }
  }

  if (qLower.includes('pilot')) {
    return [
      `Which pilots are available right now?`,
      `Show me deep draft certified pilots`
    ];
  }
  if (qLower.includes('tug')) {
    return [
      `Which tugs are available right now?`,
      `Show me the status of Tug Poseidon`
    ];
  }
  if (qLower.includes('berth')) {
    return [
      `Which berths are vacant right now?`,
      `Show me Moll de Barcelona Pier status`
    ];
  }

  return [
    `Why is the tug boat allocation done for GRAND ZEPHYR?`,
    `What's the status of MSC BARCELONA?`,
    `Which pilots are available right now?`
  ];
};

const getActionsForAnswer = (question: string, answer: any): ChatAction[] => {
  const vName = answer.vessel?.name;
  const qLower = question.toLowerCase();

  if (vName) {
    if (qLower.includes('why') || qLower.includes('allocat') || qLower.includes('status')) {
      return [
        { label: 'Approve Allocation', type: 'approve_allocation', primary: true },
        { label: 'Modify Allocation', type: 'modify_allocation', primary: false },
        { label: 'Decline Allocation', type: 'decline_allocation', primary: false }
      ];
    } else {
      return [
        { label: 'Contact Agent', type: 'contact_vessel', primary: true },
        { label: 'View Checklist', type: 'view_checklist', primary: false }
      ];
    }
  }

  return [
    { label: 'View Live Map', type: 'view_live_map', primary: true },
    { label: 'Check Tugs', type: 'check_tugs', primary: false }
  ];
};

export const Header: React.FC<HeaderProps> = ({ 
  isLightMode, 
  currentRole = 'port-service-provider', 
  onRoleChange,
  onSelectVesselForAllocation,
  onPageChange
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const currentRoleData = ROLES.find(r => r.id === currentRole);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowChat(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAsk = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setChatInput('');
    setShowChat(true);

    const answer = answerQuestion(trimmed);
    const vessel = findVesselByFuzzyName(trimmed);
    const assistantMsgId = `a-${Date.now()}`;

    const rawThoughts = getThinkingStepsForQuestion(trimmed, vessel?.name);

    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      isThinking: true,
      thinkingText: rawThoughts[0] || 'Analyzing request...',
      vesselName: answer.vessel?.name
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    let thoughtIdx = 0;
    const runThoughts = () => {
      thoughtIdx++;
      if (thoughtIdx < rawThoughts.length) {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                thinkingText: rawThoughts[thoughtIdx]
              };
            }
            return msg;
          })
        );
        const organicDelay = 800 + Math.random() * 600;
        setTimeout(runThoughts, organicDelay);
      } else {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                isThinking: false,
                isStreaming: true
              };
            }
            return msg;
          })
        );

        let charIndex = 0;
        const fullText = answer.text;
        const step = 4;
        const streamInterval = setInterval(() => {
          charIndex += step;
          const isDone = charIndex >= fullText.length;
          const nextText = isDone ? fullText : fullText.slice(0, charIndex);

          setMessages(prev =>
            prev.map(msg => {
              if (msg.id === assistantMsgId) {
                return {
                  ...msg,
                  text: nextText
                };
              }
              return msg;
            })
          );

          if (isDone) {
            clearInterval(streamInterval);
            setIsStreaming(false);
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id === assistantMsgId) {
                  return {
                    ...msg,
                    isStreaming: false,
                    suggestedQuestions: getSuggestedQuestionsForAnswer(trimmed, answer),
                    actions: getActionsForAnswer(trimmed, answer)
                  };
                }
                return msg;
              })
            );
          }
        }, 10);
      }
    };

    const initialDelay = 1000 + Math.random() * 400;
    setTimeout(runThoughts, initialDelay);
  };

  const handleActionClick = (messageId: string, action: ChatAction, vesselName?: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            actionStatus: action.type === 'approve_allocation' ? 'Approved' : action.type === 'decline_allocation' ? 'Declined' : undefined
          };
        }
        return msg;
      })
    );

    if (action.type === 'modify_allocation' && vesselName) {
      onSelectVesselForAllocation?.(vesselName);
    } else if (action.type === 'approve_allocation' && vesselName) {
      const sysMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        role: 'assistant',
        text: `✓ Collaboration Agent: Resource allocation for ${vesselName} has been approved and locked in the master database. Tug and Pilot crews have been dispatched.`
      };
      setMessages(prev => [...prev, sysMsg]);
    } else if (action.type === 'decline_allocation' && vesselName) {
      const sysMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        role: 'assistant',
        text: `❌ Collaboration Agent: Allocation declined for ${vesselName}. Opening manual configuration or click 'Modify Allocation' below.`
      };
      setMessages(prev => [...prev, sysMsg]);
    } else if (action.type === 'contact_vessel') {
      onPageChange?.('communications');
    } else if (action.type === 'view_checklist') {
      onPageChange?.('vessels');
    } else if (action.type === 'view_live_map') {
      onPageChange?.('live-map');
    } else if (action.type === 'check_tugs') {
      onPageChange?.('resources');
    }
  };

  const handleFeedback = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          feedback: msg.feedback === rating ? undefined : rating
        };
      }
      return msg;
    }));
  };

  const STYLE_SHEET = `
    @keyframes slideDownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-16px) scale(0.98);
        filter: blur(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes staggeredFadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0% { transform: scale(0.85); opacity: 0.5; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(0.85); opacity: 0.5; }
    }

    @keyframes dot-tri-1 {
      0%, 100% { transform: translate(-5px, -3px) scale(0.8); opacity: 0.4; }
      50% { transform: translate(0px, 0px) scale(1.2); opacity: 1; }
    }
    @keyframes dot-tri-2 {
      0%, 100% { transform: translate(0px, 5px) scale(1.2); opacity: 1; }
      50% { transform: translate(5px, -3px) scale(0.8); opacity: 0.4; }
    }
    @keyframes dot-tri-3 {
      0%, 100% { transform: translate(5px, -3px) scale(0.8); opacity: 0.4; }
      50% { transform: translate(-5px, -3px) scale(1.2); opacity: 1; }
    }
    .animate-dt-1 { animation: dot-tri-1 2s infinite ease-in-out; }
    .animate-dt-2 { animation: dot-tri-2 2s infinite ease-in-out; }
    .animate-dt-3 { animation: dot-tri-3 2s infinite ease-in-out; }

    .chat-panel-animate {
      animation: slideDownFadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      transform-origin: top center;
    }

    .staggered-item {
      opacity: 0;
      animation: staggeredFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'approve_allocation':
        return <Check size={13} style={{ flexShrink: 0 }} />;
      case 'modify_allocation':
        return <Sliders size={13} style={{ flexShrink: 0 }} />;
      case 'decline_allocation':
        return <X size={13} style={{ flexShrink: 0 }} />;
      case 'contact_vessel':
        return <MessageSquare size={13} style={{ flexShrink: 0 }} />;
      case 'view_checklist':
        return <ClipboardList size={13} style={{ flexShrink: 0 }} />;
      case 'view_live_map':
        return <Map size={13} style={{ flexShrink: 0 }} />;
      case 'check_tugs':
        return <Anchor size={13} style={{ flexShrink: 0 }} />;
      default:
        return null;
    }
  };

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
      <style dangerouslySetInnerHTML={{ __html: STYLE_SHEET }} />
      {/* Left side: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="28" 
          viewBox="92 28 32 33"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <style>{`.a{fill:${isLightMode ? '#1e293b' : '#ffffff'};}.b{fill:#3b82f6;}`}</style>
          </defs>
          <path className="a" d="M92.334,44.508l15.905-16.042,6.718,6.65L98.984,51.158Z"/>
          <path className="b" d="M108.787,60.961,102,54.106c2.194-10.969,10.009-6.307,14.191-17.893l6.993,6.718c-4.182,11.792-11.517,6.582-14.4,18.03"/>
        </svg>
        <span style={{ 
          marginLeft: '12px', 
          fontFamily: 'var(--font-sans)', 
          fontSize: '18px', 
          fontWeight: 600, 
          color: isLightMode ? '#1e293b' : '#ffffff',
          letterSpacing: '-0.3px',
          whiteSpace: 'nowrap'
        }}>
          Port de Barcelona
        </span>
      </div>

      {/* Middle: AI Assistant Search Bar */}
      <div 
        ref={searchWrapperRef} 
        style={{ 
          flex: showChat ? '0 1 700px' : '0 1 500px', 
          margin: '0 40px', 
          position: 'relative',
          transition: 'flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)', backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, var(--accent-cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={14} color="white" />
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onFocus={() => setShowChat(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk(chatInput);
              }}
              disabled={isStreaming}
              placeholder={isStreaming ? "Agent is typing..." : "Ask why an allocation was made, or vessel status..."}
              className={isLightMode ? "dark-placeholder" : "light-placeholder"}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: isLightMode ? '#1e293b' : 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                cursor: isStreaming ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <button
            onClick={() => handleAsk(chatInput)}
            disabled={isStreaming || !chatInput.trim()}
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: (isStreaming || !chatInput.trim()) ? 'not-allowed' : 'pointer', 
              border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)', 
              backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)',
              opacity: (isStreaming || !chatInput.trim()) ? 0.6 : 1,
              outline: 'none'
            }}
          >
            <Send size={18} color={isLightMode ? '#475569' : "var(--text-secondary)"} />
          </button>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)', backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)' }}>
            <Mic size={18} color={isLightMode ? '#475569' : "var(--text-secondary)"} />
          </div>
        </div>

        {/* AI Assistant Chat Panel */}
        {showChat && (
          <div 
            className="chat-panel-animate"
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '14px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '520px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, var(--accent-cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={12} color="white" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>Port Operations Collaboration Agent</span>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 600, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear Thread
                </button>
              )}
            </div>

            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '150px' }}>
              {messages.length === 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                    Select a collaboration topic to begin:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <button
                        key={prompt}
                        onClick={() => handleAsk(prompt)}
                        className="staggered-item"
                        style={{
                          textAlign: 'left',
                          fontSize: '11px',
                          color: '#2563eb',
                          backgroundColor: 'rgba(37,99,235,0.06)',
                          border: '1px solid rgba(37,99,235,0.15)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          animationDelay: `${index * 50}ms`
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.06)'; }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div 
                    className="staggered-item"
                    style={{
                      maxWidth: '85%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line',
                      backgroundColor: msg.role === 'user' ? '#2563eb' : (msg.role === 'system' ? '#f8fafc' : 'rgba(0,0,0,0.04)'),
                      color: msg.role === 'user' ? 'white' : '#1e293b',
                      border: msg.role === 'system' ? '1px solid #e2e8f0' : 'none'
                    }}
                  >
                    {/* Organic Thinking status box with 3 dots animation */}
                    {msg.isThinking && msg.thinkingText && (
                      <div style={{
                        marginBottom: msg.text ? '8px' : '0',
                        fontSize: '11.5px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{ position: 'relative', width: '20px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '4px' }}>
                          <div className="animate-dt-1" style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                          <div className="animate-dt-2" style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                          <div className="animate-dt-3" style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#60a5fa' }} />
                        </div>
                        <span style={{ fontStyle: 'italic' }}>{msg.thinkingText}</span>
                      </div>
                    )}
                    {msg.text}

                    {/* Collaborative actions inside the agent response box */}
                    {!msg.isStreaming && msg.actions && msg.actions.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                        {msg.actionStatus ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: msg.actionStatus === 'Approved' ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '11px' }}>
                            <Check size={12} />
                            <span>{msg.actionStatus === 'Approved' ? 'Action Confirmed / Approved' : 'Action Declined'}</span>
                          </div>
                        ) : (
                          msg.actions.map((action, actionIdx) => (
                            <button
                              key={action.label}
                              className="staggered-item"
                              onClick={() => handleActionClick(msg.id, action, msg.vesselName)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                border: action.primary ? 'none' : '1px solid rgba(0,0,0,0.15)',
                                backgroundColor: action.primary ? '#2563eb' : '#ffffff',
                                color: action.primary ? '#ffffff' : '#334155',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s',
                                animationDelay: `${actionIdx * 60}ms`
                              }}
                              onMouseEnter={(e) => {
                                if (action.primary) {
                                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                                } else {
                                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (action.primary) {
                                  e.currentTarget.style.backgroundColor = '#2563eb';
                                } else {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                }
                              }}
                            >
                              {getActionIcon(action.type)}
                              <span>{action.label}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback options (Thumbs Up / Down) outside of bubble */}
                  {msg.role === 'assistant' && !msg.isStreaming && !msg.isThinking && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingLeft: '8px', opacity: 0.7 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(msg.id, 'up');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: msg.feedback === 'up' ? '#2563eb' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        title="Thumbs Up"
                      >
                        <ThumbsUp size={12} fill={msg.feedback === 'up' ? '#2563eb' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(msg.id, 'down');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: msg.feedback === 'down' ? '#ef4444' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        title="Thumbs Down"
                      >
                        <ThumbsDown size={12} fill={msg.feedback === 'down' ? '#ef4444' : 'none'} />
                      </button>
                    </div>
                  )}

                  {/* Suggested questions rendered directly under the AI response */}
                  {!msg.isStreaming && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', width: '85%' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, paddingLeft: '4px' }}>Suggested Next Steps:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.suggestedQuestions.map((q, qIdx) => (
                          <button
                            key={q}
                            className="staggered-item"
                            onClick={() => handleAsk(q)}
                            disabled={isStreaming}
                            style={{
                              textAlign: 'left',
                              fontSize: '11px',
                              color: '#2563eb',
                              backgroundColor: 'rgba(37,99,235,0.06)',
                              border: '1px solid rgba(37,99,235,0.15)',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: isStreaming ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s',
                              animationDelay: `${qIdx * 60}ms`
                            }}
                            onMouseEnter={(e) => { if (!isStreaming) e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.12)'; }}
                            onMouseLeave={(e) => { if (!isStreaming) e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.06)'; }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAsk(chatInput);
                }}
                disabled={isStreaming}
                placeholder={isStreaming ? "Waiting for agent output..." : "Collaborate or type a query..."}
                style={{ flex: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', outline: 'none', color: '#1e293b' }}
              />
              <button
                onClick={() => handleAsk(chatInput)}
                disabled={isStreaming || !chatInput.trim()}
                style={{ 
                  padding: '0 14px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '11px', 
                  cursor: (isStreaming || !chatInput.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isStreaming || !chatInput.trim()) ? 0.6 : 1
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Weather & Status Panel + User Role Dropdown */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '8px 16px',
          borderRadius: '10px',
          fontSize: '11px',
          color: isLightMode ? '#1e293b' : '#ffffff',
          border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
          backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>Current Time</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>17:31:54 UTC+2</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>Wind</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>SW 14 kt</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>Visibility</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>12 NM vis</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>Temp</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>24°C</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>Port State</span>
            <span style={{ fontWeight: 600, color: '#16a34a' }}>Port: Good</span>
          </div>
        </div>

        {/* User Role Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
              backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)',
              color: isLightMode ? '#1e293b' : '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white'
            }}>
              {currentRoleData?.shortLabel.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: isLightMode ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>User Role</span>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>{currentRoleData?.shortLabel}</span>
            </div>
            <ChevronDown size={16} style={{ marginLeft: '4px', transition: 'transform 0.2s ease', transform: showRoleDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {/* Dropdown Menu */}
          {showRoleDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: isLightMode ? '#ffffff' : 'var(--glass-dark-bg)',
              border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 1000,
              minWidth: '200px',
              overflow: 'hidden'
            }}>
              {ROLES.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange?.(role.id as any);
                    setShowRoleDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: currentRole === role.id
                      ? (isLightMode ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.15)')
                      : 'transparent',
                    color: currentRole === role.id ? '#2563eb' : (isLightMode ? '#1e293b' : '#ffffff'),
                    fontSize: '13px',
                    fontWeight: currentRole === role.id ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    borderBottom: index < ROLES.length - 1 ? (isLightMode ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.08)') : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (currentRole !== role.id) {
                      (e.target as HTMLButtonElement).style.backgroundColor = isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentRole !== role.id) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: currentRole === role.id ? '#2563eb' : 'rgba(37, 99, 235, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: currentRole === role.id ? 'white' : '#2563eb',
                    flexShrink: 0
                  }}>
                    {role.label.charAt(0)}
                  </div>
                  <span>{role.label}</span>
                  {currentRole === role.id && (
                    <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
