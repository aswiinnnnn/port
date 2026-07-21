import React, { useMemo, useState } from 'react';
import { Ship, Anchor, Compass, Sparkles, Check, X, RefreshCw, Calendar, ArrowDownRight, ArrowUpRight, Box, Layers, ChevronDown, Info } from 'lucide-react';
import { listVessels, docks, type VesselListItem } from './UnifiedDashboard';

interface TugBoat {
  id: string;
  name: string;
  bollardPull: string;
  status: 'Available' | 'On Assignment' | 'Maintenance';
}

interface HarborPilot {
  id: string;
  name: string;
  certification: string;
  status: 'Available' | 'On Assignment' | 'Off Duty';
}

interface QuayCrane {
  id: string;
  name: string;
  capacity: string;
  status: 'Available' | 'On Assignment' | 'Maintenance';
}

const TUG_FLEET: TugBoat[] = [
  { id: 'tug-1', name: 'Tug Poseidon', bollardPull: '65t', status: 'Available' },
  { id: 'tug-2', name: 'Tug Neptune', bollardPull: '60t', status: 'Available' },
  { id: 'tug-3', name: 'Tug Triton', bollardPull: '55t', status: 'On Assignment' },
  { id: 'tug-4', name: 'Tug Meridian', bollardPull: '70t', status: 'Available' },
  { id: 'tug-5', name: 'Tug Aegis', bollardPull: '50t', status: 'Maintenance' },
  { id: 'tug-6', name: 'Tug Orion', bollardPull: '62t', status: 'Available' }
];

const PILOT_ROSTER: HarborPilot[] = [
  { id: 'pilot-1', name: 'Capt. Marina Solà', certification: 'Deep Draft Certified', status: 'Available' },
  { id: 'pilot-2', name: 'Capt. Jordi Vives', certification: 'LNG/Hazmat Certified', status: 'Available' },
  { id: 'pilot-3', name: 'Capt. Laura Bosch', certification: 'Cruise Vessel Certified', status: 'On Assignment' },
  { id: 'pilot-4', name: 'Capt. Pau Ferrer', certification: 'Standard Certified', status: 'Available' },
  { id: 'pilot-5', name: 'Capt. Nuria Camps', certification: 'Deep Draft Certified', status: 'Off Duty' }
];

const CRANE_ROSTER: QuayCrane[] = [
  { id: 'crane-1', name: 'Gantry Crane Super-Post-Panamax #1', capacity: '65t Dual-Hoist', status: 'Available' },
  { id: 'crane-2', name: 'STS Crane BEST Terminal #3', capacity: '50t Twin-Lift', status: 'Available' },
  { id: 'crane-3', name: 'Paceco Heavy Gantry Crane #2', capacity: '45t Single-Lift', status: 'On Assignment' },
  { id: 'crane-4', name: 'Liebherr LHM 550 Mobile Harbor Crane', capacity: '100t Heavy-Lift', status: 'Available' },
  { id: 'crane-5', name: 'ZPMC Super-Post-Panamax #4', capacity: '65t Dual-Hoist', status: 'Maintenance' }
];

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const pickAvailable = <T extends { status: string }>(pool: T[], seed: number): T => {
  const available = pool.filter(item => item.status === 'Available');
  const source = available.length > 0 ? available : pool;
  return source[seed % source.length];
};

interface PortCallHistoryItem {
  date: string;
  berth: string;
  inboundTEU: number;
  outboundTEU: number;
  cargoType: string;
  assignedPilot: string;
  assignedTugs: string;
  stevedoreTeam: string;
  dwellTime: string;
}

const BERTH_LIST = ['Moll de Ponent', 'Moll de la Fusta', 'Moll Sud Container Terminal', 'Moll de Barcelona', 'Moll de Llevant'];
const CARGO_CATALOG = [
  'Dry Bulk & Electronics Containers',
  'Automotive & Machinery Units',
  'Reefer Cold-Chain Produce',
  'High-Value Manufactured Goods',
  'Chemical & Raw Materials',
  'Consumer Goods & Apparel'
];
const PILOTS_LIST = ['Capt. Marina Solà', 'Capt. Jordi Vives', 'Capt. Laura Bosch', 'Capt. Pau Ferrer', 'Capt. Nuria Camps'];
const TUGS_LIST = ['Tug Poseidon (65t) + Tug Neptune (60t)', 'Tug Triton (55t)', 'Tug Meridian (70t) + Tug Aegis (50t)', 'Tug Orion (62t) + Tug Poseidon (65t)'];
const SUPERVISORS = ['Team Alpha (Lead: M. Ross)', 'Team Bravo (Lead: J. Delgado)', 'Team Delta (Lead: S. Chen)', 'Team Echo (Lead: K. Novak)'];

const generateVesselHistory = (vesselName: string): PortCallHistoryItem[] => {
  const seed = hashString(vesselName);
  const history: PortCallHistoryItem[] = [];

  for (let i = 1; i <= 10; i++) {
    const s = seed + i * 1337;
    const daysAgo = i * 14 + (s % 7);
    const inbound = 450 + (s % 1200);
    const outbound = 380 + ((s * 3) % 1150);
    const berth = BERTH_LIST[(s + i) % BERTH_LIST.length];
    const cargoType = CARGO_CATALOG[(s >> 2) % CARGO_CATALOG.length];
    const assignedPilot = PILOTS_LIST[(s >> 3) % PILOTS_LIST.length];
    const assignedTugs = TUGS_LIST[(s >> 4) % TUGS_LIST.length];
    const stevedoreTeam = SUPERVISORS[(s >> 5) % SUPERVISORS.length];
    const hours = 14 + (s % 18);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(2026, 5, 20); // base reference date
    d.setDate(d.getDate() - daysAgo);
    const dateStr = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

    history.push({
      date: dateStr,
      berth,
      inboundTEU: inbound,
      outboundTEU: outbound,
      cargoType,
      assignedPilot,
      assignedTugs,
      stevedoreTeam,
      dwellTime: `Turnaround: ${hours}h (Completed)`
    });
  }
  return history;
};

interface ResourceAllocationModalProps {
  vesselName: string | null;
  onClose: () => void;
  onAccept: () => void;
}

export const ResourceAllocationModal: React.FC<ResourceAllocationModalProps> = ({ vesselName, onClose, onAccept }) => {
  const vessel: VesselListItem | undefined = useMemo(
    () => listVessels.find(v => v.name === vesselName),
    [vesselName]
  );

  const vacantBerths = useMemo(() => docks.filter(d => d.status !== 'Occupied'), []);

  const suggestion = useMemo(() => {
    if (!vessel) return null;
    const seed = hashString(vessel.name);
    const tug = pickAvailable(TUG_FLEET, seed);
    const pilot = pickAvailable(PILOT_ROSTER, seed + 1);
    const crane = pickAvailable(CRANE_ROSTER, seed + 2);
    const berthPool = vacantBerths.length > 0 ? vacantBerths : docks;
    const berth = berthPool[seed % berthPool.length];
    return { tugId: tug.id, pilotId: pilot.id, craneId: crane.id, berthId: berth.id };
  }, [vessel, vacantBerths]);

  const [accepted, setAccepted] = useState(false);
  const [selectedTugId, setSelectedTugId] = useState<string>(suggestion?.tugId ?? TUG_FLEET[0].id);
  const [selectedPilotId, setSelectedPilotId] = useState<string>(suggestion?.pilotId ?? PILOT_ROSTER[0].id);
  const [selectedCraneId, setSelectedCraneId] = useState<string>(suggestion?.craneId ?? CRANE_ROSTER[0].id);
  const [selectedBerthId, setSelectedBerthId] = useState<string>(suggestion?.berthId ?? docks[0].id);

  // Custom Shadcn Dropdown visibility states
  const [openTugDropdown, setOpenTugDropdown] = useState(false);
  const [openPilotDropdown, setOpenPilotDropdown] = useState(false);
  const [openCraneDropdown, setOpenCraneDropdown] = useState(false);
  const [openBerthDropdown, setOpenBerthDropdown] = useState(false);

  // Compute live vessel container metrics & AI reasoning explanations
  const vesselMetrics = useMemo(() => {
    if (!vessel) return { inboundTEU: 0, outboundTEU: 0, availableTEU: 0, maxCapacityTEU: 10000, utilizationPct: 80, aiReasoning: { tug: '', pilot: '', crane: '', berth: '' } };
    const seed = hashString(vessel.name);
    const inboundTEU = 850 + (seed % 950);
    const outboundTEU = 720 + ((seed * 3) % 900);
    const maxCapacityTEU = 12500 + (seed % 5000);
    const loadedContainers = 9200 + (seed % 2800);
    const availableTEU = maxCapacityTEU - loadedContainers;
    const utilizationPct = Math.round((loadedContainers / maxCapacityTEU) * 100);

    const tugObj = TUG_FLEET.find(t => t.id === (suggestion?.tugId ?? selectedTugId));
    const pilotObj = PILOT_ROSTER.find(p => p.id === (suggestion?.pilotId ?? selectedPilotId));
    const craneObj = CRANE_ROSTER.find(c => c.id === (suggestion?.craneId ?? selectedCraneId));
    const berthObj = docks.find(d => d.id === (suggestion?.berthId ?? selectedBerthId));

    return {
      inboundTEU,
      outboundTEU,
      availableTEU,
      maxCapacityTEU,
      utilizationPct,
      aiReasoning: {
        tug: `Selected ${tugObj?.name || 'Tug'} (${tugObj?.bollardPull}) based on current draft (${vessel.draft}) and tide current forecast. Provides required 60t+ pull force.`,
        pilot: `Assigned ${pilotObj?.name || 'Pilot'} holding ${pilotObj?.certification} matching vessel's LOA (${vessel.loa}) and ${vessel.riskLevel.toLowerCase()} profile.`,
        crane: `Assigned ${craneObj?.name || 'Quay Crane'} (${craneObj?.capacity}) optimized for container discharge speed on quay section ${berthObj?.name || 'Berth'}.`,
        berth: `Allocated ${berthObj?.name || 'Berth'} as it has sufficient depth (${berthObj?.depth || '16m'}) and LOA tolerance (max ${berthObj?.maxLoa}) for prompt discharge.`
      }
    };
  }, [vessel, suggestion, selectedTugId, selectedPilotId, selectedCraneId, selectedBerthId]);

  React.useEffect(() => {
    if (suggestion) {
      setSelectedTugId(suggestion.tugId);
      setSelectedPilotId(suggestion.pilotId);
      setSelectedCraneId(suggestion.craneId);
      setSelectedBerthId(suggestion.berthId);
      setAccepted(false);
    }
  }, [vessel?.name, suggestion]);

  if (!vessel || !suggestion) {
    return null;
  }

  const selectedTug = TUG_FLEET.find(t => t.id === selectedTugId) || TUG_FLEET[0];
  const selectedPilot = PILOT_ROSTER.find(p => p.id === selectedPilotId) || PILOT_ROSTER[0];
  const selectedCrane = CRANE_ROSTER.find(c => c.id === selectedCraneId) || CRANE_ROSTER[0];
  const selectedBerth = docks.find(d => d.id === selectedBerthId) || docks[0];
  const statusColor = (status: string) => {
    if (status === 'Available') return '#10b981';
    if (status === 'On Assignment' || status === 'Occupied') return '#f59e0b';
    return '#ef4444';
  };
  const [showToast, setShowToast] = useState(false);

  const resetToSuggestion = () => {
    setSelectedTugId(suggestion.tugId);
    setSelectedPilotId(suggestion.pilotId);
    setSelectedBerthId(suggestion.berthId);
    setAccepted(false);
  };

  const handleAccept = () => {
    setAccepted(true);
    setShowToast(true);
    onAccept();
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50000,
      padding: '20px'
    }}>
      {/* Success Toast Notification */}
      {showToast && (
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          backgroundColor: '#059669',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 60000,
          fontWeight: 600,
          fontSize: '13px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <Check size={18} color="white" />
          Resource Allocation Confirmed Successfully for {vessel.name}!
        </div>
      )}

      <div style={{
        backgroundColor: '#EAF1F3',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '1380px',
        width: '95vw',
        maxHeight: '95vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{vessel.flag}</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{vessel.name}</h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{vessel.type}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#475569" />
          </button>
        </div>
        {/* Content Grid Container */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: '24px', padding: '24px', flex: 1, overflow: 'hidden', height: '100%', minHeight: 0 }}>

          {/* Column 1: Vessel Specifications & Image (Independent Scroll) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderRight: '1px solid rgba(0,0,0,0.08)', paddingRight: '20px', overflowY: 'auto', maxHeight: '100%', paddingBottom: '12px' }}>
            
            {/* Vessel Image Banner (Positioned at TOP of left column with transparent background) */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px 0'
            }}>
              <img 
                src={vessel.image} 
                alt={vessel.name} 
                style={{ 
                  maxHeight: '130px', 
                  maxWidth: '100%', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                }} 
              />
            </div>

            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Vessel Specifications</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>LOA</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.loa}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>DRAFT</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.draft}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>GT</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.gt}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TUGS REQ.</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.tugs}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>ETA</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.eta}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>CARGO TYPE</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.cargo}</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>RISK PROFILE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {vessel.riskLevel}
                <span style={{ fontSize: '11px', color: 'white', backgroundColor: vessel.riskLevel === 'CRITICAL RISK' ? '#ef4444' : vessel.riskLevel === 'HIGH RISK' ? '#f97316' : '#eab308', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {vessel.risk}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>OPERATOR</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.operator}</div>
            </div>
          </div>

          {/* Column 2 (Center): Vessel Port Calls & Cargo History (Independent Scroll) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderRight: '1px solid rgba(0,0,0,0.08)', paddingRight: '20px', overflowY: 'auto', maxHeight: '100%', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#EAF1F3', zIndex: 10, paddingBottom: '6px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                Port Call & Cargo History (Last 10 Visits)
              </h3>
              <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                10 Records
              </span>
            </div>

            {/* History list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {generateVesselHistory(vessel.name).map((visit, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid rgba(0,0,0,0.08)', 
                    borderRadius: '12px', 
                    padding: '14px', 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Arrival Date & Berth */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="#2563eb" /> {visit.date}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '3px 10px', borderRadius: '6px' }}>
                      {visit.berth}
                    </div>
                  </div>

                  {/* Containers stats: Inbound & Outbound */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Inbound Containers</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowDownRight size={15} color="#059669" /> {visit.inboundTEU} TEU
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Outbound Containers</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowUpRight size={15} color="#2563eb" /> {visit.outboundTEU} TEU
                      </div>
                    </div>
                  </div>

                  {/* Cargo Breakdown */}
                  <div style={{ fontSize: '11px', color: '#334155', backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: '#1e293b' }}>Cargo Manifest:</strong> <span>{visit.cargoType}</span>
                  </div>

                  {/* Assigned Personnel & Services */}
                  <div style={{ fontSize: '11px', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <div><strong>Pilot:</strong> {visit.assignedPilot}</div>
                    <div><strong>Tugs:</strong> {visit.assignedTugs}</div>
                    <div><strong>Supervisor:</strong> {visit.stevedoreTeam}</div>
                    <div style={{ color: '#10b981', fontWeight: 700, textAlign: 'right' }}>{visit.dwellTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 (Rightmost): Resource Allocation (Independent Scroll) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '100%', paddingBottom: '12px', paddingRight: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#2563eb" />
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Resource Allocation</h3>
            </div>

            {/* Current Cargo & Space Metrics for this Vessel Call */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Box size={14} color="#2563eb" /> Container & Capacity Status
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Inbound</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ArrowDownRight size={13} /> {vesselMetrics.inboundTEU} TEU
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Outbound</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ArrowUpRight size={13} /> {vesselMetrics.outboundTEU} TEU
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Available Space</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#d97706', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Layers size={13} /> {vesselMetrics.availableTEU} TEU
                  </div>
                </div>
              </div>

              {/* Progress bar of vessel deck capacity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Deck Load Factor ({vesselMetrics.utilizationPct}% Full)</span>
                  <span>Max Capacity: {vesselMetrics.maxCapacityTEU.toLocaleString()} TEU</span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${vesselMetrics.utilizationPct}%`, height: '100%', backgroundColor: vesselMetrics.utilizationPct > 85 ? '#ef4444' : '#2563eb', borderRadius: '3px' }} />
                </div>
              </div>
            </div>

            {/* Tug Boat Selector (Shadcn UI style) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={13} color="#2563eb" />
                  Tug Boat Allocation
                </label>
                {selectedTugId === suggestion.tugId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                    <div 
                      className="group"
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={14} color="#2563eb" />
                      {/* Custom UI Tooltip Card */}
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          zIndex: 9999,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }} 
                        className="group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#38bdf8" /> AI Allocation Rationale
                        </div>
                        Selected based on vessel LOA ({vessel?.loa || '280m'}) and required bollard pull efficiency for optimal maneuverability.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shadcn Custom Select Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenTugDropdown(!openTugDropdown);
                    setOpenPilotDropdown(false);
                    setOpenBerthDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedTug.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({selectedTug.bollardPull})</span>
                  </span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: openTugDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {openTugDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    padding: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {TUG_FLEET.map(tug => (
                      <div
                        key={tug.id}
                        onClick={() => {
                          if (tug.status !== 'Maintenance') {
                            setSelectedTugId(tug.id);
                            setOpenTugDropdown(false);
                          }
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: tug.id === selectedTugId ? 700 : 500,
                          backgroundColor: tug.id === selectedTugId ? '#f1f5f9' : 'transparent',
                          color: tug.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                          cursor: tug.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{tug.name} ({tug.bollardPull})</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(tug.status) }}>{tug.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Harbor Pilot Selector (Shadcn UI style) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ship size={13} color="#2563eb" />
                  Harbor Pilot Allocation
                </label>
                {selectedPilotId === suggestion.pilotId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                    <div 
                      className="group"
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={14} color="#2563eb" />
                      {/* Custom UI Tooltip Card */}
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          zIndex: 9999,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }} 
                        className="group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#38bdf8" /> AI Allocation Rationale
                        </div>
                        Matched pilot certification rank to vessel draft ({vessel?.draft || '12m'}) and current tide window.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shadcn Custom Select Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenPilotDropdown(!openPilotDropdown);
                    setOpenTugDropdown(false);
                    setOpenBerthDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <span>{selectedPilot.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({selectedPilot.certification})</span></span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: openPilotDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {openPilotDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    padding: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {PILOT_ROSTER.map(pilot => (
                      <div
                        key={pilot.id}
                        onClick={() => {
                          if (pilot.status !== 'Off Duty') {
                            setSelectedPilotId(pilot.id);
                            setOpenPilotDropdown(false);
                          }
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: pilot.id === selectedPilotId ? 700 : 500,
                          backgroundColor: pilot.id === selectedPilotId ? '#f1f5f9' : 'transparent',
                          color: pilot.status === 'Off Duty' ? '#94a3b8' : '#1e293b',
                          cursor: pilot.status === 'Off Duty' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{pilot.name} ({pilot.certification})</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(pilot.status) }}>{pilot.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quay Crane Selector (Shadcn UI style) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} color="#2563eb" />
                  Quay Crane Allocation
                </label>
                {selectedCraneId === suggestion.craneId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                    <div 
                      className="group"
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={14} color="#2563eb" />
                      {/* Custom UI Tooltip Card */}
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          zIndex: 9999,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }} 
                        className="group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#38bdf8" /> AI Allocation Rationale
                        </div>
                        High-speed gantry crane assigned to maximize container clearance rate.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shadcn Custom Select Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenCraneDropdown(!openCraneDropdown);
                    setOpenTugDropdown(false);
                    setOpenPilotDropdown(false);
                    setOpenBerthDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <span>{selectedCrane.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({selectedCrane.capacity})</span></span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: openCraneDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {openCraneDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    padding: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {CRANE_ROSTER.map(crane => (
                      <div
                        key={crane.id}
                        onClick={() => {
                          if (crane.status !== 'Maintenance') {
                            setSelectedCraneId(crane.id);
                            setOpenCraneDropdown(false);
                          }
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: crane.id === selectedCraneId ? 700 : 500,
                          backgroundColor: crane.id === selectedCraneId ? '#f1f5f9' : 'transparent',
                          color: crane.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                          cursor: crane.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{crane.name} ({crane.capacity})</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(crane.status) }}>{crane.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Berth Selector (Shadcn UI style) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Anchor size={13} color="#2563eb" />
                  Berth Assignment
                </label>
                {selectedBerthId === suggestion.berthId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                    <div 
                      className="group"
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={14} color="#2563eb" />
                      {/* Custom UI Tooltip Card */}
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          zIndex: 9999,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }} 
                        className="group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#38bdf8" /> AI Allocation Rationale
                        </div>
                        Optimal depth berth closest to assigned container yard zone.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shadcn Custom Select Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenBerthDropdown(!openBerthDropdown);
                    setOpenTugDropdown(false);
                    setOpenPilotDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <span>{selectedBerth.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>(Max LOA {selectedBerth.maxLoa})</span></span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: openBerthDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {openBerthDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    padding: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {docks.map(dock => (
                      <div
                        key={dock.id}
                        onClick={() => {
                          if (dock.status !== 'Occupied') {
                            setSelectedBerthId(dock.id);
                            setOpenBerthDropdown(false);
                          }
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: dock.id === selectedBerthId ? 700 : 500,
                          backgroundColor: dock.id === selectedBerthId ? '#f1f5f9' : 'transparent',
                          color: dock.status === 'Occupied' ? '#94a3b8' : '#1e293b',
                          cursor: dock.status === 'Occupied' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{dock.name} (Max LOA {dock.maxLoa})</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(dock.status) }}>{dock.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Unified AI Allocation Reasoning Box (Single place for all resources) */}
            <div style={{ backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#2563eb" /> AI Allocation Insights
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#1e293b', lineHeight: '1.4' }}>
                <div>
                  <strong style={{ color: '#2563eb' }}>Tug:</strong> {vesselMetrics.aiReasoning.tug}
                </div>
                <div>
                  <strong style={{ color: '#2563eb' }}>Pilot:</strong> {vesselMetrics.aiReasoning.pilot}
                </div>
                <div>
                  <strong style={{ color: '#2563eb' }}>Crane:</strong> {vesselMetrics.aiReasoning.crane}
                </div>
                <div>
                  <strong style={{ color: '#2563eb' }}>Berth:</strong> {vesselMetrics.aiReasoning.berth}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', borderTop: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.3)' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(0,0,0,0.15)',
              color: '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={resetToSuggestion}
            style={{
              height: '40px',
              padding: '0 16px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(0,0,0,0.15)',
              color: '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={13} />
            Reset
          </button>
          <button
            onClick={handleAccept}
            style={{
              flex: 1,
              height: '40px',
              borderRadius: '8px',
              backgroundColor: accepted ? 'rgba(16, 185, 129, 0.12)' : '#2563eb',
              border: accepted ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
              color: accepted ? '#047857' : 'white',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
          >
            <Check size={14} />
            {accepted ? 'Allocation Accepted' : 'Accept Allocation'}
          </button>
        </div>
      </div>
    </div>
  );
};
