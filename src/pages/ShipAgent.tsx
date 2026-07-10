import React, { useState } from 'react';
import { FileText, Anchor, Phone, CheckCircle, AlertCircle, Clock, Search, Ship, Send, ArrowRight, Sparkles } from 'lucide-react';

interface PortCallNotification {
  id: string;
  vesselName: string;
  flag: string;
  imo: string;
  eta: string;
  status: 'Draft' | 'Submitted' | 'Acknowledged';
  cargo: string;
  loa: string;
  draft: string;
  agent: string;
  timestamp: string;
}

interface DocumentFile {
  id: string;
  name: string;
  vessel: string;
  type: string;
  status: 'Pending' | 'Submitted' | 'Approved';
  uploadDate: string;
  size: string;
}

interface BerthReservation {
  id: string;
  vesselName: string;
  berth: string;
  terminal: string;
  arrivalTime: string;
  status: 'Requested' | 'Confirmed' | 'Occupied';
  pilot: string;
  tug: string;
}

interface CommMessage {
  id: string;
  vessel: string;
  flag: string;
  time: string;
  channel: 'RADIO' | 'EMAIL' | 'PORTIC';
  preview: string;
  detail: string;
  sentiment: 'URGENT' | 'NEUTRAL' | 'INFO';
}

const PORT_CALLS: PortCallNotification[] = [
  { id: 'pcn-1', vesselName: 'GRAND ZEPHYR', flag: '🇲🇹', imo: 'IMO 9812345', eta: '09 Jul 14:30', status: 'Submitted', cargo: 'Vehicles & Trucks · 1,200 units', loa: '198m', draft: '6.8m', agent: 'Mediterranean Shipping Agency', timestamp: '08 Jul 10:15' },
  { id: 'pcn-2', vesselName: 'MARITIME STAR', flag: '🇱🇷', imo: 'IMO 9456782', eta: '10 Jul 08:00', status: 'Draft', cargo: 'Breakbulk · 5,000 MT steel coils', loa: '176m', draft: '9.4m', agent: 'Mediterranean Shipping Agency', timestamp: '08 Jul 09:45' },
  { id: 'pcn-3', vesselName: 'ATLANTIC HORIZON', flag: '🇲🇭', imo: 'IMO 9456123', eta: '08 Jul 15:00', status: 'Acknowledged', cargo: 'Iron Ore · 44,000 MT', loa: '225m', draft: '13.5m', agent: 'Mediterranean Shipping Agency', timestamp: '07 Jul 16:20' },
  { id: 'pcn-4', vesselName: 'TANKER IBERIA', flag: '🇪🇸', imo: 'IMO 9331004', eta: '11 Jul 06:30', status: 'Draft', cargo: 'Crude Oil · 68,000 MT', loa: '244m', draft: '15.1m', agent: 'Mediterranean Shipping Agency', timestamp: '08 Jul 08:05' },
  { id: 'pcn-5', vesselName: 'NORDIC SUPPLY', flag: '🇳🇴', imo: 'IMO 9278841', eta: '12 Jul 11:15', status: 'Submitted', cargo: 'General Cargo · 3,100 MT', loa: '142m', draft: '7.2m', agent: 'Mediterranean Shipping Agency', timestamp: '08 Jul 07:50' }
];

const DOCUMENTS: DocumentFile[] = [
  { id: 'doc-1', name: 'IMO FAL Form 1 — General Declaration', vessel: 'GRAND ZEPHYR', type: 'PDF', status: 'Approved', uploadDate: '08 Jul', size: '212 KB' },
  { id: 'doc-2', name: 'IMO FAL Form 6 — Dangerous Goods', vessel: 'GRAND ZEPHYR', type: 'PDF', status: 'Submitted', uploadDate: '08 Jul', size: '184 KB' },
  { id: 'doc-3', name: 'Maritime Health Declaration', vessel: 'GRAND ZEPHYR', type: 'PDF', status: 'Pending', uploadDate: '08 Jul', size: '96 KB' },
  { id: 'doc-4', name: 'Cargo Manifest', vessel: 'MARITIME STAR', type: 'XLSX', status: 'Submitted', uploadDate: '08 Jul', size: '340 KB' },
  { id: 'doc-5', name: 'Crew List & Passenger List', vessel: 'ATLANTIC HORIZON', type: 'PDF', status: 'Approved', uploadDate: '07 Jul', size: '128 KB' },
  { id: 'doc-6', name: 'Ship Security Certificate (ISSC)', vessel: 'TANKER IBERIA', type: 'PDF', status: 'Pending', uploadDate: '08 Jul', size: '154 KB' }
];

const BERTHS: BerthReservation[] = [
  { id: 'br-1', vesselName: 'GRAND ZEPHYR', berth: 'RoRo-T2', terminal: 'RoRo Terminal', arrivalTime: '09 Jul 14:30', status: 'Confirmed', pilot: 'Capt. Rodriguez', tug: 'Boluda Tug COSTA BRAVA' },
  { id: 'br-2', vesselName: 'MARITIME STAR', berth: 'South-Cargo-B3', terminal: 'South General Cargo', arrivalTime: '10 Jul 08:00', status: 'Requested', pilot: 'Unassigned', tug: 'Unassigned' },
  { id: 'br-3', vesselName: 'ATLANTIC HORIZON', berth: 'North-Dock-B8', terminal: 'North Dock', arrivalTime: '08 Jul 15:00', status: 'Occupied', pilot: 'Capt. Martínez', tug: 'Boluda Tug BARCELONA' },
  { id: 'br-4', vesselName: 'TANKER IBERIA', berth: 'Liquid-T3-B2', terminal: 'Liquid Cargo Terminal', arrivalTime: '11 Jul 06:30', status: 'Requested', pilot: 'Unassigned', tug: 'Unassigned' }
];

const MESSAGES: CommMessage[] = [
  { id: 'msg-1', vessel: 'GRAND ZEPHYR', flag: '🇲🇹', time: '14:30', channel: 'RADIO', sentiment: 'URGENT', preview: 'Requesting berth allocation confirmation before ETA', detail: 'Dear port control, GRAND ZEPHYR needs berth change. Current berth RoRo-T2 unavailable — requesting confirmation of alternate assignment before arrival at 14:30.' },
  { id: 'msg-2', vessel: 'MARITIME STAR', flag: '🇱🇷', time: '09:45', channel: 'EMAIL', sentiment: 'INFO', preview: 'Documentation package submitted for review', detail: 'Cargo manifest and FAL forms for MARITIME STAR have been uploaded to Portic. Awaiting customs pre-clearance ahead of 10 Jul arrival.' },
  { id: 'msg-3', vessel: 'ATLANTIC HORIZON', flag: '🇲🇭', time: '16:20', channel: 'PORTIC', sentiment: 'NEUTRAL', preview: 'Berth confirmed at North Dock B8', detail: 'Portic system update: ATLANTIC HORIZON berth reservation confirmed at North-Dock-B8. Pilot Capt. Martínez and Tug COSTA BRAVA assigned for berthing operation.' },
  { id: 'msg-4', vessel: 'TANKER IBERIA', flag: '🇪🇸', time: '08:05', channel: 'RADIO', sentiment: 'URGENT', preview: 'ISSC certificate pending upload — customs hold risk', detail: 'Reminder: Ship Security Certificate for TANKER IBERIA is still pending. Customs clearance may be delayed if not submitted before 10 Jul 18:00.' },
  { id: 'msg-5', vessel: 'NORDIC SUPPLY', flag: '🇳🇴', time: '07:50', channel: 'EMAIL', sentiment: 'INFO', preview: 'Port call notification acknowledged by port authority', detail: 'Port authority has acknowledged the port call notification for NORDIC SUPPLY. Standard pre-arrival checklist applies, no exceptions flagged.' }
];

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.6px'
};

const statusColor = (status: string) => {
  if (status === 'Approved' || status === 'Submitted' || status === 'Confirmed' || status === 'Acknowledged') return '#10b981';
  if (status === 'Pending' || status === 'Requested' || status === 'Draft') return '#f59e0b';
  if (status === 'Occupied') return '#3b82f6';
  return '#ef4444';
};

const statusBg = (status: string) => `${statusColor(status)}15`;

const statusIcon = (status: string) => {
  if (status === 'Approved' || status === 'Confirmed' || status === 'Submitted' || status === 'Acknowledged') return <CheckCircle size={12} />;
  if (status === 'Pending' || status === 'Requested' || status === 'Draft') return <Clock size={12} />;
  return <AlertCircle size={12} />;
};

interface ShipAgentProps {
  activeTab: 'notifications' | 'documents' | 'berth' | 'communications' | 'departure';
}

export const ShipAgent: React.FC<ShipAgentProps> = ({ activeTab }) => {
  const [notifSearch, setNotifSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string>(MESSAGES[0].id);
  const [messageDraft, setMessageDraft] = useState('');

  const [notifications, setNotifications] = useState<PortCallNotification[]>(PORT_CALLS);
  const [documents, setDocuments] = useState<DocumentFile[]>(DOCUMENTS);
  const [berths, setBerths] = useState<BerthReservation[]>(BERTHS);
  const [allocationAccepted, setAllocationAccepted] = useState(false);

  // Departure Confirmation is now per-vessel: only vessels with a confirmed
  // berth (pilot + tug already assigned) are eligible to check off for departure.
  const departureEligible = berths.filter(b => b.pilot !== 'Unassigned' && b.tug !== 'Unassigned');
  const [selectedDepartureVessel, setSelectedDepartureVessel] = useState<string>(departureEligible[0]?.vesselName ?? berths[0].vesselName);
  const selectedBerth = berths.find(b => b.vesselName === selectedDepartureVessel) ?? berths[0];

  type ChecklistKey = 'pilot' | 'tug' | 'cargo' | 'personnel' | 'customs';
  const [checklistByVessel, setChecklistByVessel] = useState<Record<string, Record<ChecklistKey, boolean>>>(
    Object.fromEntries(berths.map(b => [b.vesselName, { pilot: true, tug: true, cargo: false, personnel: false, customs: true }]))
  );
  const checklist = checklistByVessel[selectedDepartureVessel] ?? { pilot: false, tug: false, cargo: false, personnel: false, customs: false };
  const setChecklist = (updater: (prev: Record<ChecklistKey, boolean>) => Record<ChecklistKey, boolean>) => {
    setChecklistByVessel(prev => ({ ...prev, [selectedDepartureVessel]: updater(prev[selectedDepartureVessel] ?? checklist) }));
  };

  const selectedMessage = MESSAGES.find(m => m.id === selectedMessageId) ?? MESSAGES[0];

  const filteredNotifications = notifications.filter(pcn =>
    pcn.vesselName.toLowerCase().includes(notifSearch.toLowerCase())
  );
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(docSearch.toLowerCase()) || doc.vessel.toLowerCase().includes(docSearch.toLowerCase())
  );

  const submittedCount = notifications.filter(p => p.status !== 'Draft').length;
  const draftCount = notifications.filter(p => p.status === 'Draft').length;
  const upcomingArrivals = notifications.filter(p => p.status !== 'Draft');
  const approvedDocs = documents.filter(d => d.status === 'Approved').length;
  const pendingDocs = documents.filter(d => d.status === 'Pending').length;
  const vesselsCovered = new Set(documents.map(d => d.vessel)).size;
  const confirmedBerths = berths.filter(b => b.status !== 'Requested').length;
  const pilotsAssigned = berths.filter(b => b.pilot !== 'Unassigned').length;
  const tugsBooked = berths.filter(b => b.tug !== 'Unassigned').length;

  const handleSubmitNotification = (id: string) => {
    setNotifications(prev => prev.map(pcn => pcn.id === id ? { ...pcn, status: 'Submitted' } : pcn));
  };

  const handleNewNotification = () => {
    const draft: PortCallNotification = {
      id: `pcn-${Date.now()}`,
      vesselName: 'NEW VESSEL CALL',
      flag: '🏳️',
      imo: 'IMO Pending',
      eta: 'TBD',
      status: 'Draft',
      cargo: 'Pending manifest upload',
      loa: '—',
      draft: '—',
      agent: 'Mediterranean Shipping Agency',
      timestamp: new Date().toISOString().slice(0, 10)
    };
    setNotifications(prev => [draft, ...prev]);
  };

  const handleUploadDocument = () => {
    const vessel = notifications[0]?.vesselName ?? 'GRAND ZEPHYR';
    const doc: DocumentFile = {
      id: `doc-${Date.now()}`,
      name: 'New Document — Pending Classification',
      vessel,
      type: 'PDF',
      status: 'Pending',
      uploadDate: new Date().toISOString().slice(0, 10),
      size: '—'
    };
    setDocuments(prev => [doc, ...prev]);
  };

  const handleSendReply = () => {
    if (!messageDraft.trim()) return;
    alert(`Reply sent to ${selectedMessage.vessel}:\n"${messageDraft.trim()}"`);
    setMessageDraft('');
  };

  const handleDocAction = (id: string, action: 'View' | 'Edit') => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    if (action === 'Edit') {
      setDocuments(prev => prev.map(d => d.id === id && d.status === 'Pending' ? { ...d, status: 'Submitted' } : d));
    } else {
      alert(`${doc.name}\nVessel: ${doc.vessel}\nType: ${doc.type} · ${doc.size}\nStatus: ${doc.status}`);
    }
  };

  const handleAcceptAllocation = () => {
    setBerths(prev => prev.map(b => b.vesselName === 'MARITIME STAR' ? { ...b, pilot: 'Capt. Chen', tug: 'Boluda Tug LLEVANT', status: 'Confirmed' } : b));
    setAllocationAccepted(true);
  };

  const checklistItems: { key: ChecklistKey; label: string }[] = [
    { key: 'pilot', label: 'Pilot briefing complete' },
    { key: 'tug', label: 'Tug lines attached' },
    { key: 'cargo', label: 'Cargo secured' },
    { key: 'personnel', label: 'All personnel aboard' },
    { key: 'customs', label: 'Customs clearance received' }
  ];
  const checklistDone = Object.values(checklist).filter(Boolean).length;
  const departureStepIndex = Math.min(4, Math.round((checklistDone / checklistItems.length) * 4));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minWidth: 0, height: '100%', gap: '16px', overflow: 'auto', paddingRight: '8px' }}>

      {/* ============ PORT CALL NOTIFICATIONS ============ */}
      {activeTab === 'notifications' && (
        <>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Submitted / Acknowledged</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{submittedCount}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>On track for port authority review</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Drafts Pending</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{draftCount}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>Needs submission before ETA</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Submitted / Acknowledged Vessels</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{upcomingArrivals.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{upcomingArrivals.map(p => p.vesselName).join(', ') || 'None yet'}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Total Port Calls</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{notifications.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Tracked this week</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ ...cardStyle, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px' }}>
            <Search size={15} color="#64748b" />
            <input
              value={notifSearch}
              onChange={e => setNotifSearch(e.target.value)}
              placeholder="Search vessel or IMO..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '12px', color: '#1e293b', flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Port Call Notifications</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map(pcn => (
              <div key={pcn.id} style={{ ...cardStyle, padding: '16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{pcn.flag}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{pcn.vesselName}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{pcn.imo} · Submitted {pcn.timestamp}</div>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: statusColor(pcn.status), backgroundColor: statusBg(pcn.status), padding: '3px 8px', borderRadius: '4px', marginLeft: 'auto' }}>
                      {statusIcon(pcn.status)}
                      {pcn.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>ETA</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{pcn.eta}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>LOA / Draft</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{pcn.loa} / {pcn.draft}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>Cargo Manifest</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{pcn.cargo}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>Agent of Record</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{pcn.agent}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => pcn.status === 'Draft' && handleSubmitNotification(pcn.id)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(37,99,235,0.2)', backgroundColor: pcn.status === 'Draft' ? '#2563eb' : 'transparent', color: pcn.status === 'Draft' ? 'white' : '#2563eb', fontWeight: 600, fontSize: '11px', cursor: pcn.status === 'Draft' ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                >
                  {pcn.status === 'Draft' ? 'Submit Notification' : 'View Details'}
                </button>
              </div>
            ))}
            <button
              onClick={handleNewNotification}
              style={{ padding: '12px', borderRadius: '8px', border: '2px dashed rgba(37,99,235,0.3)', backgroundColor: 'transparent', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              + New Port Call Notification (ETA, Vessel Particulars, Cargo Manifest)
            </button>
          </div>
        </>
      )}

      {/* ============ PRE-ARRIVAL DOCUMENTATION ============ */}
      {activeTab === 'documents' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Approved</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{approvedDocs}/{documents.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Cleared by port authority</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Pending Review</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{pendingDocs}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>Awaiting upload or approval</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Total Documents</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{documents.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Across all active port calls</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Vessels Covered</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{vesselsCovered}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Active documentation sets</div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px' }}>
            <Search size={15} color="#64748b" />
            <input
              value={docSearch}
              onChange={e => setDocSearch(e.target.value)}
              placeholder="Search documents or vessel..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '12px', color: '#1e293b', flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Pre-Arrival Documentation</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {filteredDocuments.map(doc => (
              <div key={doc.id} style={{ ...cardStyle, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0, wordBreak: 'break-word' }}>{doc.name}</h4>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{doc.vessel} · {doc.type} · {doc.size} · {doc.uploadDate}</div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: statusColor(doc.status), backgroundColor: statusBg(doc.status), padding: '3px 6px', borderRadius: '3px' }}>
                    {statusIcon(doc.status)}
                    {doc.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                  <button onClick={() => handleDocAction(doc.id, 'View')} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>View</button>
                  <button
                    onClick={() => handleDocAction(doc.id, 'Edit')}
                    disabled={doc.status !== 'Pending'}
                    style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: doc.status === 'Pending' ? '#2563eb' : 'white', color: doc.status === 'Pending' ? 'white' : '#94a3b8', fontWeight: 600, cursor: doc.status === 'Pending' ? 'pointer' : 'default' }}
                  >
                    {doc.status === 'Pending' ? 'Submit' : 'Edit'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleUploadDocument} style={{ padding: '12px', borderRadius: '8px', border: '2px dashed rgba(37,99,235,0.3)', backgroundColor: 'transparent', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            + Upload New Document (FAL Forms, DG Declaration, Health/Maritime Declaration)
          </button>
        </>
      )}

      {/* ============ BERTH RESERVATIONS & PILOTAGE ============ */}
      {activeTab === 'berth' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Berths Confirmed</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{confirmedBerths}/{berths.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Ready for berthing ops</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Pilots Assigned</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{pilotsAssigned}/{berths.length}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>{berths.length - pilotsAssigned} requests awaiting roster</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Tugs Booked</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{tugsBooked}/{berths.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Boluda fleet coordination</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>Occupied Berths</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{berths.filter(b => b.status === 'Occupied').length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Currently in active use</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Anchor size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Berth Reservations &amp; Pilotage</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {berths.map(br => (
              <div key={br.id} style={{ ...cardStyle, padding: '16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                  <div>
                    <div style={eyebrowStyle}>Vessel</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{br.vesselName}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>Berth / Terminal</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>{br.berth}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{br.terminal}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>Arrival</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{br.arrivalTime}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>Pilot</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: br.pilot === 'Unassigned' ? '#94a3b8' : '#1e293b', marginTop: '4px' }}>{br.pilot}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>Tug</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: br.tug === 'Unassigned' ? '#94a3b8' : '#1e293b', marginTop: '4px' }}>{br.tug}</div>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: statusColor(br.status), backgroundColor: statusBg(br.status), padding: '6px 12px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  {statusIcon(br.status)}
                  {br.status}
                </span>
              </div>
            ))}
          </div>

          {!allocationAccepted && berths.some(b => b.vesselName === 'MARITIME STAR' && b.pilot === 'Unassigned') && (
            <div style={{ ...cardStyle, padding: '16px', backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> AI Suggested Allocation — MARITIME STAR
              </h4>
              <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: '1.7' }}>
                <div>Suggested pilot: <strong>Capt. Chen</strong> (Standard Certified, Available)</div>
                <div>Suggested tug: <strong>Boluda Tug LLEVANT</strong> (Available, Tug Base)</div>
              </div>
              <button
                onClick={handleAcceptAllocation}
                style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
              >
                Accept Suggested Allocation
              </button>
            </div>
          )}
          {allocationAccepted && (
            <div style={{ ...cardStyle, padding: '16px', backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} color="#10b981" />
              <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Allocation confirmed — Capt. Chen and Boluda Tug LLEVANT assigned to MARITIME STAR.</span>
            </div>
          )}
        </>
      )}

      {/* ============ VESSEL COMMUNICATIONS ============ */}
      {activeTab === 'communications' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Vessel Communications</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '3px 8px', borderRadius: '10px', marginLeft: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} /> {MESSAGES.length} active threads
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.3fr', gap: '16px', flex: 1, minHeight: '420px' }}>
            {/* Live feed */}
            <div style={{ ...cardStyle, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {MESSAGES.map(msg => {
                const isSelected = msg.id === selectedMessageId;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(37,99,235,0.08)' : 'rgba(0,0,0,0.02)',
                      border: isSelected ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>{msg.flag}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{msg.vessel}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{msg.time}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{msg.preview}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#475569', backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '3px' }}>{msg.channel}</span>
                      {msg.sentiment === 'URGENT' && (
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '2px 6px', borderRadius: '3px' }}>URGENT</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail pane */}
            <div style={{ ...cardStyle, padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{selectedMessage.flag}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{selectedMessage.vessel}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{selectedMessage.channel} · {selectedMessage.time}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 700, color: selectedMessage.sentiment === 'URGENT' ? '#ef4444' : '#2563eb', backgroundColor: selectedMessage.sentiment === 'URGENT' ? 'rgba(239,68,68,0.08)' : 'rgba(37,99,235,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                  {selectedMessage.sentiment}
                </span>
              </div>

              <div>
                <div style={eyebrowStyle}>Message</div>
                <div style={{ fontSize: '12px', color: '#1e293b', marginTop: '6px', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px' }}>
                  {selectedMessage.detail}
                </div>
              </div>

              <div style={{ ...cardStyle, backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={12} /> Suggested Reply
                </div>
                <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '6px', lineHeight: '1.5' }}>
                  "Confirmed, {selectedMessage.vessel} — awaiting final approval, will update Portic within the hour."
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea
                  value={messageDraft}
                  onChange={e => setMessageDraft(e.target.value)}
                  placeholder={`Reply to ${selectedMessage.vessel}...`}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px' }}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!messageDraft.trim()}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: messageDraft.trim() ? '#2563eb' : 'rgba(0,0,0,0.1)', color: messageDraft.trim() ? 'white' : '#94a3b8', fontWeight: 600, fontSize: '11px', cursor: messageDraft.trim() ? 'pointer' : 'default' }}
                >
                  <Send size={13} /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============ DEPARTURE CONFIRMATION ============ */}
      {activeTab === 'departure' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Ship size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Departure Confirmation</h3>
            <select
              value={selectedDepartureVessel}
              onChange={e => setSelectedDepartureVessel(e.target.value)}
              style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 600, color: '#1e293b', backgroundColor: 'white' }}
            >
              {berths.map(b => (
                <option key={b.id} value={b.vesselName}>{b.vesselName}</option>
              ))}
            </select>
          </div>

          {/* Stepper */}
          <div style={{ ...cardStyle, padding: '18px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {['Berthed', 'Cargo Ops', 'Documentation', 'Pilot & Tug', 'Departure'].map((step, i) => {
                const doneUpTo = departureStepIndex;
                const done = i < doneUpTo;
                const current = i === doneUpTo;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: done ? '#10b981' : current ? '#2563eb' : 'rgba(0,0,0,0.06)',
                        color: done || current ? 'white' : '#94a3b8',
                        fontSize: '11px', fontWeight: 700
                      }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: done || current ? '#1e293b' : '#94a3b8', textAlign: 'center', maxWidth: '70px' }}>{step}</span>
                    </div>
                    {i < 4 && <div style={{ flex: 1, height: '2px', backgroundColor: i < doneUpTo ? '#10b981' : 'rgba(0,0,0,0.08)', margin: '0 4px', marginBottom: '18px' }} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>Pilot Confirmation</h4>
              {selectedBerth.pilot !== 'Unassigned' ? (
                <div style={{ padding: '10px', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#047857' }}>✓ {selectedBerth.pilot}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Confirmed for {selectedBerth.arrivalTime}</div>
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#b45309' }}>⏳ Pilot not yet assigned</div>
                </div>
              )}
              <button
                onClick={() => alert(`Pilot change requested for ${selectedDepartureVessel}.`)}
                style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
              >
                Request Pilot Change
              </button>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>Tug Confirmation</h4>
              {selectedBerth.tug !== 'Unassigned' ? (
                <div style={{ padding: '10px', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#047857' }}>✓ {selectedBerth.tug}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{selectedBerth.berth} · {selectedBerth.terminal}</div>
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#b45309' }}>⏳ Tug not yet assigned</div>
                </div>
              )}
              <button
                onClick={() => alert(`Tug change requested for ${selectedDepartureVessel}.`)}
                style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
              >
                Request Tug Change
              </button>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '16px', backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#047857', margin: 0 }}>Departure Checklist — {selectedDepartureVessel}</h4>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>{checklistDone}/{checklistItems.length} complete</span>
            </div>
            <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: `${(checklistDone / checklistItems.length) * 100}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.3s ease' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '11px' }}>
              {checklistItems.map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#1e293b' }}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={checklistDone < checklistItems.length}
            onClick={() => alert(`Departure confirmed for ${selectedDepartureVessel}. Port authority notified.`)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: checklistDone === checklistItems.length ? '#2563eb' : 'rgba(0,0,0,0.1)',
              color: checklistDone === checklistItems.length ? 'white' : '#94a3b8',
              fontWeight: 600,
              fontSize: '13px',
              cursor: checklistDone === checklistItems.length ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Confirm Departure &amp; Notify Port Authority <ArrowRight size={14} />
          </button>
        </>
      )}
    </div>
  );
};
