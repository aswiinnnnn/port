import React, { useState } from 'react';
import { Search, Sparkles, CheckSquare, Check, Clock, Globe, Anchor, Database, ArrowRight, Mic } from 'lucide-react';

type SupportedLanguage = 'English' | 'Spanish' | 'Catalan' | 'French' | 'Chinese';

const LANGUAGES: SupportedLanguage[] = ['English', 'Spanish', 'Catalan', 'French', 'Chinese'];

interface DbFieldChange {
  field: string;
  from: string;
  to: string;
}

interface DbUpdateProposal {
  vessel: string;
  summary: string;
  changes: DbFieldChange[];
}

interface CommunicationMessage {
  id: string;
  sender: string;
  role: string;
  flag: string;
  originalText: string;
  originalLanguage: string;
  translations: Record<SupportedLanguage, string>;
  sentiment: 'URGENT' | 'NEUTRAL' | 'WARNING';
  channel: string;
  time: string;
  isAiProcessed: boolean;
  actions: string[];
  dbUpdate?: DbUpdateProposal;
  audioUrl?: string;
}

interface CommunicationsProps {
  selectedMessageId?: string | null;
  onSelectMessageId?: (id: string | null) => void;
}

export const Communications: React.FC<CommunicationsProps> = ({
  selectedMessageId,
  onSelectMessageId
}) => {
  const messages: CommunicationMessage[] = [
    {
      id: '4',
      sender: 'GRAND ZEPHYR',
      role: 'Master',
      flag: '🇲🇹',
      originalText: 'Benvolgut control portuari, el GRAND ZEPHYR necessita canvi de moll. Moll actual RoRo-T2 no disponible.',
      originalLanguage: 'Catalan',
      translations: {
        English: 'Dear port control, GRAND ZEPHYR needs berth change. Current berth RoRo-T2 unavailable.',
        Spanish: 'Estimado control portuario, GRAND ZEPHYR necesita cambio de atraque. El atraque actual RoRo-T2 no está disponible.',
        Catalan: 'Benvolgut control portuari, el GRAND ZEPHYR necessita canvi de moll. Moll actual RoRo-T2 no disponible.',
        French: "Cher contrôle portuaire, GRAND ZEPHYR a besoin d'un changement de poste. Le poste actuel RoRo-T2 est indisponible.",
        Chinese: '尊敬的港口管制，GRAND ZEPHYR需要更换泊位。当前泊位RoRo-T2不可用。'
      },
      sentiment: 'NEUTRAL',
      channel: 'RADIO',
      time: '02:24 PM',
      isAiProcessed: true,
      audioUrl: '/generated-audio.mp3',
      actions: [
        'Find alternative berth for GRAND ZEPHYR',
        'Update berthing schedule',
        'Notify vessel agent'
      ],
      dbUpdate: {
        vessel: 'GRAND ZEPHYR',
        summary: 'Berth reassignment requested — RoRo-T2 unavailable',
        changes: [
          { field: 'Assigned Berth', from: 'RoRo-T2', to: 'Terminal E (pending confirmation)' }
        ]
      }
    },
    {
      id: '6',
      sender: 'ATLANTIC HORIZON',
      role: 'Master',
      flag: '🇲🇭',
      originalText: 'Port Control, ATLANTIC HORIZON. Confirming tug assist request. We are approaching the breakwater, winds are picking up. Requesting extra tug support.',
      originalLanguage: 'English',
      translations: {
        English: 'Port Control, ATLANTIC HORIZON. Confirming tug assist request. We are approaching the breakwater, winds are picking up. Requesting extra tug support.',
        Spanish: 'Control de Puerto, ATLANTIC HORIZON. Confirmando la solicitud de asistencia de remolcadores. Nos acercamos al rompeolas, los vientos están aumentando. Solicitando apoyo de remocador adicional.',
        Catalan: 'Control de Port, ATLANTIC HORIZON. Confirmant la sol·licitud d’assistència de remolcadors. Ens acostem a l’escullera, els vents estan augmentant. Sol·licitant suport de remolcador addicional.',
        French: "Port Control, ATLANTIC HORIZON. Confirmant la demande d'assistance de remorqueur. Nous approchons de la digue, les vents se renforcent. Demande de soutien de remorqueur supplémentaire.",
        Chinese: '港口管制，这里是ATLANTIC HORIZON。确认拖船协助请求。我们正在接近防波堤，风力正在增强。请求额外的拖船支持。'
      },
      sentiment: 'WARNING',
      channel: 'VHF Ch 12',
      time: '02:16 PM',
      isAiProcessed: true,
      actions: [
        'Coordinate extra tug support with Tug Poseidon',
        'Monitor wind speeds'
      ],
      dbUpdate: {
        vessel: 'ATLANTIC HORIZON',
        summary: 'Extra tug support requested due to high winds',
        changes: [
          { field: 'Required Tugs', from: '2', to: '3' }
        ]
      }
    },
    {
      id: '1',
      sender: 'EVER ONWARDS',
      role: 'Master',
      flag: '🇱🇷',
      originalText: 'Port Control, EVER ONWARDS here. Updated ETA to Terminal H is now 19:40, delayed from 18:26 due to fog off the breakwater. Draught 15.8m confirmed.',
      originalLanguage: 'English',
      translations: {
        English: 'Port Control, EVER ONWARDS here. Updated ETA to Terminal H is now 19:40, delayed from 18:26 due to fog off the breakwater. Draught 15.8m confirmed.',
        Spanish: 'Control Portuario, aquí EVER ONWARDS. La nueva ETA a la Terminal H es 19:40, retrasada desde las 18:26 por niebla frente al rompeolas. Calado 15.8m confirmado.',
        Catalan: 'Control Portuari, aquí EVER ONWARDS. La nova ETA a la Terminal H és 19:40, retardada des de les 18:26 per boira davant l’escullera. Calat 15.8m confirmat.',
        French: "Contrôle Portuaire, ici EVER ONWARDS. L'ETA mise à jour pour le Terminal H est maintenant 19:40, retardée de 18:26 en raison du brouillard au large de la digue. Tirant d'eau 15.8m confirmé.",
        Chinese: '港口管制，这里是EVER ONWARDS。前往H码头的预计到达时间更新为19:40，因防波堤外浓雾从18:26延迟。吃水确认为15.8米。'
      },
      sentiment: 'WARNING',
      channel: 'VHF Ch 16',
      time: '02:41 PM',
      isAiProcessed: true,
      actions: ['Update berth ETA for EVER ONWARDS', 'Notify Terminal H ground crew of delay'],
      dbUpdate: {
        vessel: 'EVER ONWARDS',
        summary: 'ETA to Terminal H delayed due to fog',
        changes: [
          { field: 'ETA (Terminal H)', from: 'Today, 18:26', to: 'Today, 19:40' },
          { field: 'Draught', from: '15.6m', to: '15.8m' }
        ]
      }
    },
    {
      id: '2',
      sender: 'MSC BARCELONA',
      role: 'Master',
      flag: '🇫🇷',
      originalText: 'Bonjour Port Control, MSC BARCELONA ici. ETA pilote dans 90 minutes. Demande confirmation de la disponibilité du remorqueur.',
      originalLanguage: 'French',
      translations: {
        English: 'Hello Port Control, MSC BARCELONA here. ETA pilot in 90 minutes. Requesting confirmation of tug availability.',
        Spanish: 'Hola Control Portuario, aquí MSC BARCELONA. ETA del práctico en 90 minutos. Solicito confirmación de disponibilidad de remolcador.',
        Catalan: 'Hola Control Portuari, aquí MSC BARCELONA. ETA del pràctic en 90 minuts. Sol·licito confirmació de disponibilitat de remolcador.',
        French: 'Bonjour Port Control, MSC BARCELONA ici. ETA pilote dans 90 minutes. Demande confirmation de la disponibilité du remorqueur.',
        Chinese: '你好港口管制，这里是MSC BARCELONA。引航员预计90分钟后到达。请求确认拖船是否可用。'
      },
      sentiment: 'NEUTRAL',
      channel: 'VHF Ch 16',
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
      originalLanguage: 'Arabic',
      translations: {
        English: 'We urgently need a port pilot. Dangerous goods certificates are ready for inspection at berth 3.',
        Spanish: 'Necesitamos urgentemente un práctico de puerto. Los certificados de mercancías peligrosas están listos para inspección en el atraque 3.',
        Catalan: 'Necessitem urgentment un pràctic de port. Els certificats de mercaderies perilloses estan llestos per a inspecció a l’atracador 3.',
        French: "Nous avons besoin d'urgence d'un pilote portuaire. Les certificats de marchandises dangereuses sont prêts pour inspection au poste 3.",
        Chinese: '我们急需一名港口引航员。危险品证书已准备好在3号泊位接受检查。'
      },
      sentiment: 'URGENT',
      channel: 'VHF Ch 16',
      time: '02:33 PM',
      isAiProcessed: true,
      actions: ['Prioritize port pilot allocation', 'Coordinate Hazmat inspection team']
    },
    {
      id: '5',
      sender: 'Tug Poseidon',
      role: 'Tug Master',
      flag: '⚓',
      originalText: 'Port Control, Tug Poseidon on standby at Terminal C. Ready to assist ATLANTIC HORIZON berthing, requesting updated tug count — recommend 3 not 2 given current crosswind.',
      originalLanguage: 'English',
      translations: {
        English: 'Port Control, Tug Poseidon on standby at Terminal C. Ready to assist ATLANTIC HORIZON berthing, requesting updated tug count — recommend 3 not 2 given current crosswind.',
        Spanish: 'Control Portuario, remolcador Poseidon en espera en Terminal C. Listo para asistir el atraque de ATLANTIC HORIZON, solicito actualizar el número de remolcadores — recomiendo 3 en lugar de 2 dado el viento cruzado actual.',
        Catalan: 'Control Portuari, remolcador Poseidon en espera a la Terminal C. Preparat per assistir l’atracada d’ATLANTIC HORIZON, sol·licito actualitzar el nombre de remolcadors — recomano 3 en comptes de 2 donat el vent creuat actual.',
        French: "Contrôle Portuaire, remorqueur Poseidon en attente au Terminal C. Prêt à assister l'accostage d'ATLANTIC HORIZON, demande de mise à jour du nombre de remorqueurs — recommande 3 au lieu de 2 vu le vent traversier actuel.",
        Chinese: '港口管制，波塞冬拖船在C码头待命。准备协助ATLANTIC HORIZON靠泊，请求更新拖船数量——鉴于目前的横风，建议使用3艘而非2艘。'
      },
      sentiment: 'WARNING',
      channel: 'VHF Ch 12',
      time: '02:18 PM',
      isAiProcessed: true,
      actions: ['Update tug allocation for ATLANTIC HORIZON', 'Confirm crosswind advisory with harbor master'],
      dbUpdate: {
        vessel: 'ATLANTIC HORIZON',
        summary: 'Tug allocation increased due to crosswind conditions',
        changes: [
          { field: 'Tugs Assigned', from: '2', to: '3' }
        ]
      }
    }
  ];

  const [localSelectedId, setLocalSelectedId] = useState<string>('4');
  const selectedId = selectedMessageId || localSelectedId;
  const setSelectedId = onSelectMessageId || setLocalSelectedId;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});
  const [displayLanguage, setDisplayLanguage] = useState<SupportedLanguage>('English');
  const [dbUpdateApplied, setDbUpdateApplied] = useState<Record<string, boolean>>({});

  const toggleAction = (key: string) => {
    setActionStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyDbUpdate = (id: string) => {
    setDbUpdateApplied(prev => ({ ...prev, [id]: true }));
  };

  const selectedMsg = messages.find(m => m.id === selectedId) || messages[3];

  const filteredMessages = messages.filter(m => 
    m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.originalText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '20px', padding: '24px 40px 0 40px', overflow: 'hidden' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0, letterSpacing: '-0.3px' }}>
              Multilingual Communication Center
            </h1>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)', 
              color: '#16a34a', 
              border: '1px solid rgba(16, 185, 129, 0.15)', 
              padding: '3px 10px', 
              borderRadius: '6px',
              fontWeight: 600
            }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                backgroundColor: '#16a34a', 
                borderRadius: '50%', 
                display: 'inline-block'
              }} />
              AI Active
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>
            Whisper + GPT-4o · Real-time translation and action items extraction
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
          <Search size={16} color="#64748b" style={{ marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search communication logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#1e293b',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <span style={{ fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', color: '#64748b', marginLeft: '10px' }}>
            ⌘K
          </span>
        </div>
      </div>

      {/* Main Content Workspace Split */}
      <div style={{ display: 'flex', flex: 1, gap: '24px', minHeight: 0, paddingBottom: '32px' }}>

        {/* Left Column: Recent Messages List */}
        <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px 0', flexShrink: 0 }}>
            Live Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', minHeight: 0, flex: 1, paddingRight: '4px' }}>
            {filteredMessages.map((msg) => {
              const isSelected = msg.id === selectedId;
              const isUrgent = msg.sentiment === 'URGENT';
              
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: 'rgba(234, 241, 243, 0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{msg.flag}</span>
                      <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#1e293b' }}>{msg.sender}</span>
                      <span style={{ fontSize: '11px', color: '#475569' }}>({msg.role})</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      {msg.time}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '12.5px', 
                    color: '#334155', 
                    margin: '0 0 12px 0', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontWeight: 500
                  }}>
                    {msg.originalText}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.04)',
                        color: isUrgent ? '#ef4444' : '#475569',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: isUrgent ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(0,0,0,0.08)'
                      }}>
                        {msg.sentiment}
                      </span>
                      {msg.isAiProcessed && (
                        <span style={{ 
                          fontSize: '9px', 
                          fontWeight: 700, 
                          backgroundColor: 'rgba(37, 99, 235, 0.08)', 
                          color: '#2563eb', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          border: '1px solid rgba(37, 99, 235, 0.15)'
                        }}>
                          AI Processed
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>{msg.channel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Pane */}
        <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px 0', flexShrink: 0 }}>
            Message Detail
          </h3>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(234, 241, 243, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>

            {/* Header metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{selectedMsg.flag}</span>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                      {selectedMsg.sender}
                    </h2>
                    <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{selectedMsg.role}</span>
                      <span>•</span>
                      <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Anchor size={12} />
                        {selectedMsg.channel} · {selectedMsg.originalLanguage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                backgroundColor: selectedMsg.sentiment === 'URGENT' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.04)', 
                color: selectedMsg.sentiment === 'URGENT' ? '#ef4444' : '#475569', 
                padding: '4px 10px', 
                borderRadius: '6px',
                border: selectedMsg.sentiment === 'URGENT' ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(0,0,0,0.08)'
              }}>
                {selectedMsg.sentiment}
              </span>
            </div>

            {/* Radio recording playback */}
            {selectedMsg.audioUrl && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={12} />
                  <span>Radio Recording</span>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <audio
                    key={selectedMsg.id}
                    controls
                    src={selectedMsg.audioUrl}
                    style={{ width: '100%', height: '36px' }}
                  />
                </div>
              </div>
            )}

            {/* Original message text box */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                {selectedMsg.audioUrl ? 'Transcript' : 'Original Message'}
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', fontSize: '13px', color: '#1e293b', lineHeight: 1.5 }}>
                {selectedMsg.originalText}
              </div>
            </div>

            {/* Translation box */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} />
                  <span>AI Translation ({displayLanguage})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px', height: '28px', borderRadius: '6px', border: '1px solid rgba(37, 99, 235, 0.2)', backgroundColor: 'rgba(37, 99, 235, 0.06)' }}>
                  <Globe size={12} color="#2563eb" />
                  <select
                    value={displayLanguage}
                    onChange={(e) => setDisplayLanguage(e.target.value as SupportedLanguage)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#2563eb',
                      cursor: 'pointer'
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedMsg.originalLanguage !== displayLanguage ? (
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.12)', fontSize: '13px', color: '#1e293b', lineHeight: 1.5 }}>
                  {selectedMsg.translations[displayLanguage]}
                </div>
              ) : (
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.12)', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, fontStyle: 'italic' }}>
                  Message is already in {displayLanguage}.
                </div>
              )}
            </div>

            {/* Actions list */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                        backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.3)', 
                        padding: '10px 14px', 
                        borderRadius: '8px', 
                        border: isChecked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        border: isChecked ? '1.5px solid #10b981' : '1.5px solid rgba(0,0,0,0.2)', 
                        backgroundColor: isChecked ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isChecked && <Check size={12} color="white" strokeWidth={3.5} />}
                      </div>
                      <span style={{ fontSize: '12px', color: isChecked ? '#047857' : '#1e293b', textDecoration: isChecked ? 'line-through' : 'none', fontWeight: 500 }}>
                        {act}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Port Database Update proposal — only shown when the message implies a concrete data change */}
            {selectedMsg.dbUpdate && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={12} />
                  <span>Portic Database Update Available</span>
                </div>
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.06)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600, marginBottom: '10px' }}>
                    {selectedMsg.dbUpdate.vessel} — {selectedMsg.dbUpdate.summary}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    {selectedMsg.dbUpdate.changes.map((change, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.5)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <span style={{ color: '#64748b', fontWeight: 600, minWidth: '110px' }}>{change.field}</span>
                        <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>{change.from}</span>
                        <ArrowRight size={12} color="#b45309" />
                        <span style={{ color: '#0f172a', fontWeight: 700 }}>{change.to}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => applyDbUpdate(selectedMsg.id)}
                    disabled={!!dbUpdateApplied[selectedMsg.id]}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '7px',
                      backgroundColor: dbUpdateApplied[selectedMsg.id] ? 'rgba(16, 185, 129, 0.12)' : '#b45309',
                      border: dbUpdateApplied[selectedMsg.id] ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                      color: dbUpdateApplied[selectedMsg.id] ? '#047857' : 'white',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      cursor: dbUpdateApplied[selectedMsg.id] ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {dbUpdateApplied[selectedMsg.id] ? (
                      <>
                        <Check size={14} />
                        Portic Database Updated
                      </>
                    ) : (
                      <>
                        <Database size={14} />
                        Update Portic Database
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
