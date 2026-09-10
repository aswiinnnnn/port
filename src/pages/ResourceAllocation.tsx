import React, { useMemo, useState } from 'react';
import { Ship, Anchor, Compass, Sparkles, Check, X, RefreshCw, Calendar, ArrowDownRight, ArrowUpRight, ArrowRight, Box, Layers, ChevronDown, ChevronRight, Info, Clock, ShieldCheck, Activity } from 'lucide-react';
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
    const d = new Date(); // dynamic reference date linked to current system date
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

interface CraneSlaModalProps {
  vesselName: string;
  craneName: string;
  craneCapacity: string;
  operationType: 'Arrival' | 'Departure';
  onClose: () => void;
}

export const CraneSlaModal: React.FC<CraneSlaModalProps> = ({ vesselName, craneName, craneCapacity, operationType, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 80000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(37,99,235,0.1)', padding: '8px', borderRadius: '10px' }}>
              <Clock size={20} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Quay Crane Operation SLA & Timeline
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {craneName} ({craneCapacity}) · {vesselName} ({operationType})
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SLA Performance KPI Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Target Move Speed</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>38 Moves / Hr</div>
              <div style={{ fontSize: '10px', color: '#3b82f6', marginTop: '2px' }}>Dual-Hoist Mode</div>
            </div>
            <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Max Allowed SLA Delay</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>&lt; 15 Mins</div>
              <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>PortIC Guarantee</div>
            </div>
            <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Total SLA Window</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#92400e', marginTop: '4px' }}>10.5 Hours</div>
              <div style={{ fontSize: '10px', color: '#d97706', marginTop: '2px' }}>Turnaround Target</div>
            </div>
          </div>

          {/* Stevedore Gang Info */}
          <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#475569', fontWeight: 600 }}>Assigned Stevedore Team:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Team Alpha (Lead: M. Ross) · 12 Crane Operators</span>
          </div>

          {/* Detailed Timeline Schedule */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#2563eb" /> Operational Schedule & SLA Milestones
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '16:15 - 16:30', title: 'Crane Positioning & Gang Safety Calibration', desc: 'Quay crane positioned at quay mark. Spreader calibration & pre-ops safety checklist.', status: 'Completed', color: '#059669' },
                { time: '16:30 - 17:15', title: 'Hatch Cover Removal & Stack Lashing Unlocks', desc: 'Deck hatch covers removed and stack twistlocks unlocked across Bays 12-24.', status: 'In Progress', color: '#2563eb' },
                { time: '17:15 - 21:30', title: 'Phase 1: Container Discharge Operation', desc: 'Continuous discharge of 450 Inbound TEUs to automated quay AGVs at 38 moves/hr.', status: 'Scheduled', color: '#64748b' },
                { time: '21:30 - 22:00', title: 'Mid-Operation Maintenance & Crew Rotation', desc: 'Scheduled 30-min gang shift changeover, hydraulic lube check, and twistlock inspection.', status: 'Scheduled', color: '#64748b' },
                { time: '22:00 - 02:15', title: 'Phase 2: Outbound Container Loading Operation', desc: 'Loading and securing of 400 Outbound TEUs onto vessel cell guides at 36 moves/hr.', status: 'Scheduled', color: '#64748b' },
                { time: '02:15 - 02:45', title: 'Lashing Inspection & Quay Clearance (Completion)', desc: 'Final container lashing verification, gangway clearance, and crane boom stowage.', status: 'SLA Target', color: '#7c3aed' }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', backgroundColor: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ minWidth: '115px', fontSize: '11px', fontWeight: 800, color: step.color, backgroundColor: `${step.color}10`, padding: '4px 8px', borderRadius: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {step.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{step.title}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: step.color, backgroundColor: `${step.color}15`, padding: '1px 7px', borderRadius: '4px' }}>
                        {step.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Banner */}
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: '#065f46' }}>
            <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#047857' }}>PortIC SLA Guarantee:</strong> Real-time telematics automatically report moves/hr to PortIC TOS. Automatic penalty credits triggered if crane downtime exceeds 15 mins.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close SLA & Schedule
          </button>
        </div>
      </div>
    </div>
  );
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

  const tugReqs = useMemo(() => {
    if (!vessel) return { requiredTugsCount: 2, requiredBollardPull: 120 };
    const loaNum = parseInt(vessel.loa) || 280;
    const rawGt = parseInt(vessel.gt.replace(/[^0-9]/g, '')) || 80;
    const gtNum = rawGt * (vessel.gt.toLowerCase().includes('k') ? 1000 : 1);

    const requiredTugsCount = vessel.tugs || (loaNum >= 350 || gtNum >= 120000 ? 4 : loaNum >= 280 || gtNum >= 75000 ? 3 : 2);
    const requiredBollardPull = Math.round(loaNum * 0.35 + (gtNum / 1000) * 0.7);

    return {
      requiredTugsCount,
      requiredBollardPull
    };
  }, [vessel]);

  const suggestion = useMemo(() => {
    if (!vessel) return null;
    const seed = hashString(vessel.name);

    const pickAvailableMultiple = (pool: TugBoat[], count: number, offset: number = 0): string[] => {
      const available = pool.filter(item => item.status === 'Available');
      const source = available.length >= count ? available : pool;
      const selectedIds: string[] = [];
      for (let i = 0; i < source.length && selectedIds.length < count; i++) {
        const item = source[(i + offset) % source.length];
        if (!selectedIds.includes(item.id)) {
          selectedIds.push(item.id);
        }
      }
      return selectedIds.length > 0 ? selectedIds : [pool[0].id];
    };

    // Arrival Suggestions - Multi-Tug
    const tugIds = pickAvailableMultiple(TUG_FLEET, tugReqs.requiredTugsCount, seed);
    const pilot = pickAvailable(PILOT_ROSTER, seed + 1);
    const crane = pickAvailable(CRANE_ROSTER, seed + 2);
    const berthPool = vacantBerths.length > 0 ? vacantBerths : docks;
    const berth = berthPool[seed % berthPool.length];

    // Departure Suggestions - Multi-Tug
    const depTugIds = pickAvailableMultiple(TUG_FLEET, tugReqs.requiredTugsCount, seed + 3);
    const depPilot = pickAvailable(PILOT_ROSTER, seed + 4);
    const depCrane = pickAvailable(CRANE_ROSTER, seed + 5);
    const depBerth = berthPool[(seed + 1) % berthPool.length];

    return {
      tugIds,
      pilotId: pilot.id,
      craneId: crane.id,
      berthId: berth.id,
      depTugIds,
      depPilotId: depPilot.id,
      depCraneId: depCrane.id,
      depBerthId: depBerth.id
    };
  }, [vessel, vacantBerths, tugReqs]);

  const [accepted, setAccepted] = useState(false);

  // Arrival Selection State (Multi-Tug)
  const [selectedTugIds, setSelectedTugIds] = useState<string[]>(suggestion?.tugIds ?? [TUG_FLEET[0].id]);
  const [selectedPilotId, setSelectedPilotId] = useState<string>(suggestion?.pilotId ?? PILOT_ROSTER[0].id);
  const [selectedCraneId, setSelectedCraneId] = useState<string>(suggestion?.craneId ?? CRANE_ROSTER[0].id);
  const [selectedBerthId, setSelectedBerthId] = useState<string>(suggestion?.berthId ?? docks[0].id);

  // Departure Selection State (Multi-Tug)
  const [selectedDepTugIds, setSelectedDepTugIds] = useState<string[]>(suggestion?.depTugIds ?? [TUG_FLEET[1]?.id ?? TUG_FLEET[0].id]);
  const [selectedDepPilotId, setSelectedDepPilotId] = useState<string>(suggestion?.depPilotId ?? PILOT_ROSTER[1]?.id ?? PILOT_ROSTER[0].id);
  const [selectedDepCraneId, setSelectedDepCraneId] = useState<string>(suggestion?.depCraneId ?? CRANE_ROSTER[3]?.id ?? CRANE_ROSTER[0].id);
  const [selectedDepBerthId, setSelectedDepBerthId] = useState<string>(suggestion?.depBerthId ?? docks[0].id);

  // Crane SLA Modal state
  const [slaModalData, setSlaModalData] = useState<{ craneName: string; craneCapacity: string; operationType: 'Arrival' | 'Departure' } | null>(null);

  const selectedTugs = useMemo(() => {
    const list = TUG_FLEET.filter(t => (selectedTugIds || []).includes(t.id));
    return list.length > 0 ? list : [TUG_FLEET[0]];
  }, [selectedTugIds]);

  const selectedDepTugs = useMemo(() => {
    const list = TUG_FLEET.filter(t => (selectedDepTugIds || []).includes(t.id));
    return list.length > 0 ? list : [TUG_FLEET[1] || TUG_FLEET[0]];
  }, [selectedDepTugIds]);

  const totalArrivalPull = useMemo(() => {
    return selectedTugs.reduce((sum, t) => sum + (parseInt(t.bollardPull) || 0), 0);
  }, [selectedTugs]);

  const totalDepPull = useMemo(() => {
    return selectedDepTugs.reduce((sum, t) => sum + (parseInt(t.bollardPull) || 0), 0);
  }, [selectedDepTugs]);

  const arrivalTugsStr = selectedTugs.map(t => `${t.name} (${t.bollardPull})`).join(' + ');
  const depTugsStr = selectedDepTugs.map(t => `${t.name} (${t.bollardPull})`).join(' + ');

  // Live AI agent stream step index (-1 means not started yet)
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [typedTask, setTypedTask] = useState('');

  const startAgentStream = React.useCallback(() => {
    setActiveStepIndex(-1);
    setTypedTask('');
    let current = -1;
    const interval = setInterval(() => {
      current += 1;
      setActiveStepIndex(current);
      if (current >= 9) {
        clearInterval(interval);
      }
    }, 2200); // 2.2s per agent step for realistic AI execution
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const cleanup = startAgentStream();
    return cleanup;
  }, [vessel?.name, startAgentStream]);

  // Typewriter animation effect for active AI agent task
  React.useEffect(() => {
    if (activeStepIndex >= 0 && activeStepIndex <= 8) {
      const stepTasks = [
        `Tracking vessel approach & calculating ETA (T+90m)...`,
        `Collecting telemetry: Gross Tonnage (${vessel?.gt || '153K GT'}), LOA (${vessel?.loa || '366m'}) & Draft (${vessel?.draft || '14.2m'})...`,
        `Computing required bollard pull (${tugReqs.requiredBollardPull}t) based on vessel displacement weight...`,
        `Starting automatic multi-agent resource allocation for Arrival & Departure...`,
        `Finding available berths matching LOA & depth clearance...`,
        `Matching optimal berth slot (BEST-T1-B4 cleared)...`,
        `Allocating ${selectedTugs.length} Arrival Tugs (${arrivalTugsStr}) for ${totalArrivalPull}t combined pull force...`,
        `Allocating ${selectedDepTugs.length} Departure Tugs (${depTugsStr}) for ${totalDepPull}t combined pull force...`,
        `Updating PortIC central vessel management system API...`
      ];
      const fullText = stepTasks[activeStepIndex] || '';
      setTypedTask('');
      let charIndex = 0;
      const timer = setInterval(() => {
        charIndex += 1;
        setTypedTask(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          clearInterval(timer);
        }
      }, 18);
      return () => clearInterval(timer);
    }
  }, [activeStepIndex, vessel?.name, vessel?.loa, vessel?.draft, vessel?.gt, vessel?.tugs, tugReqs, selectedTugs.length, selectedDepTugs.length, arrivalTugsStr, depTugsStr, totalArrivalPull, totalDepPull]);

  // Custom Shadcn Dropdown visibility states (Arrival)
  const [openTugDropdown, setOpenTugDropdown] = useState(false);
  const [openPilotDropdown, setOpenPilotDropdown] = useState(false);
  const [openCraneDropdown, setOpenCraneDropdown] = useState(false);
  const [openBerthDropdown, setOpenBerthDropdown] = useState(false);

  // Custom Shadcn Dropdown visibility states (Departure)
  const [openDepTugDropdown, setOpenDepTugDropdown] = useState(false);
  const [openDepPilotDropdown, setOpenDepPilotDropdown] = useState(false);
  const [openDepCraneDropdown, setOpenDepCraneDropdown] = useState(false);
  const [openDepBerthDropdown, setOpenDepBerthDropdown] = useState(false);

  const closeAllDropdowns = () => {
    setOpenTugDropdown(false);
    setOpenPilotDropdown(false);
    setOpenCraneDropdown(false);
    setOpenBerthDropdown(false);
    setOpenDepTugDropdown(false);
    setOpenDepPilotDropdown(false);
    setOpenDepCraneDropdown(false);
    setOpenDepBerthDropdown(false);
  };

  // Compute live vessel container metrics & AI reasoning explanations for Arrival and Departure
  const vesselMetrics = useMemo(() => {
    if (!vessel) return {
      inboundTEU: 0,
      outboundTEU: 0,
      availableTEU: 0,
      maxCapacityTEU: 10000,
      utilizationPct: 80,
      arrivalAiReasoning: { tug: '', pilot: '', crane: '', berth: '' },
      departureAiReasoning: { tug: '', pilot: '', crane: '', berth: '' }
    };
    const seed = hashString(vessel.name);
    const inboundTEU = 850 + (seed % 950);
    const outboundTEU = 720 + ((seed * 3) % 900);
    const maxCapacityTEU = 12500 + (seed % 5000);
    const loadedContainers = 9200 + (seed % 2800);
    const availableTEU = maxCapacityTEU - loadedContainers;
    const utilizationPct = Math.round((loadedContainers / maxCapacityTEU) * 100);

    const pilotObj = PILOT_ROSTER.find(p => p.id === (suggestion?.pilotId ?? selectedPilotId));
    const craneObj = CRANE_ROSTER.find(c => c.id === (suggestion?.craneId ?? selectedCraneId));
    const berthObj = docks.find(d => d.id === (suggestion?.berthId ?? selectedBerthId));

    const depPilotObj = PILOT_ROSTER.find(p => p.id === (suggestion?.depPilotId ?? selectedDepPilotId));
    const depCraneObj = CRANE_ROSTER.find(c => c.id === (suggestion?.depCraneId ?? selectedDepCraneId));
    const depBerthObj = docks.find(d => d.id === (suggestion?.depBerthId ?? selectedDepBerthId));

    return {
      inboundTEU,
      outboundTEU,
      availableTEU,
      maxCapacityTEU,
      utilizationPct,
      arrivalAiReasoning: {
        tug: `Allocated ${selectedTugs.length} Tugs (${arrivalTugsStr}) providing ${totalArrivalPull}t combined bollard pull. Selected by AI based on vessel weight (${vessel.gt}), LOA (${vessel.loa}), and draft (${vessel.draft}) requiring minimum ${tugReqs.requiredBollardPull}t force for safe harbor maneuvering.`,
        pilot: `Assigned ${pilotObj?.name || 'Pilot'} holding ${pilotObj?.certification} matching vessel's LOA (${vessel.loa}) and inward fairway maneuver profile.`,
        crane: `Assigned ${craneObj?.name || 'Quay Crane'} (${craneObj?.capacity}) optimized for container discharge speed on quay section ${berthObj?.name || 'Berth'}.`,
        berth: `Allocated ${berthObj?.name || 'Berth'} as it has sufficient depth (${berthObj?.depth || '16m'}) and LOA clearance (max ${berthObj?.maxLoa}) for prompt inbound berthing.`
      },
      departureAiReasoning: {
        tug: `Allocated ${selectedDepTugs.length} Tugs (${depTugsStr}) providing ${totalDepPull}t combined bollard pull. Selected by AI based on vessel displacement weight (${vessel.gt}), LOA (${vessel.loa}), and turning basin unberthing thrust parameters.`,
        pilot: `Assigned ${depPilotObj?.name || 'Departure Pilot'} holding ${depPilotObj?.certification} matching vessel outbound draft profile and exit channel traffic timing.`,
        crane: `Assigned ${depCraneObj?.name || 'Departure Crane'} (${depCraneObj?.capacity}) for final container reloading, hatch cover securing, and gangway clearance.`,
        berth: `Scheduled departure unberthing slot at ${depBerthObj?.name || 'Berth'} matching estimated vessel load completion and outbound tide window.`
      }
    };
  }, [vessel, suggestion, selectedTugs, selectedDepTugs, totalArrivalPull, totalDepPull, arrivalTugsStr, depTugsStr, tugReqs, selectedPilotId, selectedCraneId, selectedBerthId, selectedDepPilotId, selectedDepCraneId, selectedDepBerthId]);

  React.useEffect(() => {
    if (suggestion) {
      setSelectedTugIds(suggestion.tugIds);
      setSelectedPilotId(suggestion.pilotId);
      setSelectedCraneId(suggestion.craneId);
      setSelectedBerthId(suggestion.berthId);
      setSelectedDepTugIds(suggestion.depTugIds);
      setSelectedDepPilotId(suggestion.depPilotId);
      setSelectedDepCraneId(suggestion.depCraneId);
      setSelectedDepBerthId(suggestion.depBerthId);
      setAccepted(false);
    }
  }, [vessel?.name, suggestion]);

  if (!vessel || !suggestion) {
    return null;
  }

  const selectedPilot = PILOT_ROSTER.find(p => p.id === selectedPilotId) || PILOT_ROSTER[0];
  const selectedCrane = CRANE_ROSTER.find(c => c.id === selectedCraneId) || CRANE_ROSTER[0];
  const selectedBerth = docks.find(d => d.id === selectedBerthId) || docks[0];

  const selectedDepPilot = PILOT_ROSTER.find(p => p.id === selectedDepPilotId) || PILOT_ROSTER[1] || PILOT_ROSTER[0];
  const selectedDepCrane = CRANE_ROSTER.find(c => c.id === selectedDepCraneId) || CRANE_ROSTER[3] || CRANE_ROSTER[0];
  const selectedDepBerth = docks.find(d => d.id === selectedDepBerthId) || docks[0];

  const resetToSuggestion = () => {
    if (suggestion) {
      setSelectedTugIds(suggestion.tugIds);
      setSelectedPilotId(suggestion.pilotId);
      setSelectedCraneId(suggestion.craneId);
      setSelectedBerthId(suggestion.berthId);
      setSelectedDepTugIds(suggestion.depTugIds);
      setSelectedDepPilotId(suggestion.depPilotId);
      setSelectedDepCraneId(suggestion.depCraneId);
      setSelectedDepBerthId(suggestion.depBerthId);
      setAccepted(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'Available') return '#10b981';
    if (status === 'On Assignment' || status === 'Occupied') return '#f59e0b';
    return '#ef4444';
  };
  const [showToast, setShowToast] = useState(false);

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
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 300px) minmax(0, 1fr) minmax(320px, 360px)', gap: '20px', padding: '20px 24px', flex: 1, overflow: 'hidden', minHeight: 0 }}>

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', minHeight: 0, height: '100%', paddingBottom: '16px', paddingRight: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#2563eb" />
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Resource Allocation</h3>
            </div>

            {/* AI Agent Live Reasoning Console */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.2)', boxShadow: '0 2px 10px rgba(37,99,235,0.06)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#2563eb" /> AI Agent Live Execution
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: activeStepIndex >= 9 ? 'rgba(16,185,129,0.12)' : 'rgba(37,99,235,0.1)', color: activeStepIndex >= 9 ? '#10b981' : '#2563eb', padding: '2px 8px', borderRadius: '12px' }}>
                    {activeStepIndex === -1 ? 'INITIALIZING' : activeStepIndex >= 9 ? 'COMPLETE' : 'WORKING'}
                  </span>
                  <button
                    type="button"
                    onClick={startAgentStream}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 4px'
                    }}
                    title="Re-run AI Agent reasoning stream"
                  >
                    <RefreshCw size={11} /> Re-run
                  </button>
                </div>
              </div>

              {(() => {
                const steps = [
                  {
                    agent: 'NavAgent',
                    summary: 'Ship arrived at 2 NM port entry radius',
                    task: `Tracking vessel approach & calculating ETA (T+90m)...`,
                    toolCall: `query_vessel_telemetry({ vesselId: "${vessel.name}", radiusNM: 2.0 })`,
                    subtask: `Confirm entry clearance & speed reduction window (10.5 kt)`,
                    delegation: null
                  },
                  {
                    agent: 'DataAgent',
                    summary: 'Vessel telemetry, LOA (366m) & draft (15.2m) collected',
                    task: `Collecting telemetry, LOA & draft data from vessel...`,
                    toolCall: `fetch_vessel_manifest({ imo: "9482109", fields: ["loa", "draft", "teu"] })`,
                    subtask: `Verify tidal clearance window (+1.8m sea level tolerance)`,
                    delegation: null
                  },
                  {
                    agent: 'PortICAgent',
                    summary: 'Real-time AIS & berth availability synced from PortIC',
                    task: `Gathering real-time AIS & berth availability from PortIC...`,
                    toolCall: `sync_portic_ais({ portId: "ESBCN", pier: "BEST-T1-B4" })`,
                    subtask: `Fetch live harbor congestion & channel traffic locks`,
                    delegation: `PortICBridge (Task: Lock channel data feed)`
                  },
                  {
                    agent: 'Orchestrator',
                    summary: 'Automatic AI resource allocation sequence initialized',
                    task: `Starting automatic multi-agent resource allocation sequence...`,
                    toolCall: `initiate_multi_agent_pipeline({ vessel: "${vessel.name}", priority: "HIGH" })`,
                    subtask: `Spinning up specialized sub-agent orchestration tree`,
                    delegation: null
                  },
                  {
                    agent: 'BerthAgent',
                    summary: 'LOA & depth clearance verified for BEST-T1-B4',
                    task: `Finding available berths matching LOA & depth clearance...`,
                    toolCall: `query_berth_bathymetry({ pier: "BEST-T1-B4", minDepth: "${vessel.draft}" })`,
                    subtask: `Verify pier bollard spacing & maximum draft tolerance`,
                    delegation: null
                  },
                  {
                    agent: 'MatchingAgent',
                    summary: 'Optimal berth slot matched (BEST-T1-B4 cleared)',
                    task: `Matching & choosing optimal berth slot (BEST-T1-B4 cleared)...`,
                    toolCall: `match_optimal_berth({ vesselLoa: 366, terminal: "BEST-T1" })`,
                    subtask: `Evaluate turn-around time & crane reach parameters`,
                    delegation: `TerminalOpsAgent (Task: Reserve berth slot BEST-T1-B4)`
                  },
                  {
                    agent: 'ResourceAgent',
                    summary: 'Assigned Capt. Marina Solà & allocated 4 escort tugs',
                    task: `Allocating berth slot, harbor pilot & escort tugboats...`,
                    toolCall: `allocate_marine_resources({ tugCount: 4, cert: "Deep Draft Certified" })`,
                    subtask: `Assign Tug Poseidon (65t) + Tug Neptune (60t) + Capt. Marina Solà`,
                    delegation: `TugFleetAgent (Task: Lock escort channel slot)`
                  },
                  {
                    agent: 'SyncAgent',
                    summary: 'PortIC central vessel management system updated',
                    task: `Updating PortIC central vessel management system API...`,
                    toolCall: `update_portic_manifest({ vesselId: "${vessel.name}", berthId: "BEST-T1-B4" })`,
                    subtask: `Publish allocation schema to PortIC central API`,
                    delegation: `PortICBridge (Task: Write clearance record)`
                  },
                  {
                    agent: 'NotifyAgent',
                    summary: 'Port operations & stevedoring teams notified. Ready!',
                    task: `Informing port operations & stevedoring teams. Complete!`,
                    toolCall: `broadcast_ops_notification({ channel: "STEVE-OPS-BARCELONA", status: "READY" })`,
                    subtask: `Dispatch automated briefing to pilot & stevedore crew`,
                    delegation: `PortControlAgent (Task: Broadcast clearance)`
                  }
                ];

                if (activeStepIndex === -1) {
                  return (
                    <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'ping 1s infinite' }}></span>
                      Initializing AI multi-agent orchestration workflow...
                    </div>
                  );
                }

                const completed = steps.slice(0, activeStepIndex);
                const current = steps[activeStepIndex];

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {/* Compact completed rows */}
                    {completed.map((cStep, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '11px',
                          padding: '5px 8px',
                          borderRadius: '7px',
                          background: 'rgba(16, 185, 129, 0.06)',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                        }}
                      >
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                          background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 6px rgba(16,185,129,0.35)'
                        }}>
                          <Check size={9} color="#fff" strokeWidth={3} />
                        </div>
                        <span style={{ fontWeight: 700, color: '#059669', fontSize: '10px' }}>{cStep.agent}</span>
                        <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{cStep.summary}</span>
                      </div>
                    ))}

                    {/* Active agent card */}
                    {current && (
                      <div
                        style={{
                          marginTop: completed.length > 0 ? '4px' : '0',
                          backgroundColor: '#fafbff',
                          border: '1px solid rgba(37, 99, 235, 0.25)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '7px',
                          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: '0 2px 10px rgba(37,99,235,0.07)'
                        }}
                      >
                        {/* Agent name + pulsing dot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: '#2563eb', flexShrink: 0,
                            boxShadow: '0 0 0 3px rgba(37,99,235,0.2)',
                            animation: 'ping 1s infinite'
                          }} />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', flexShrink: 0 }}>{current.agent}</span>
                          <span style={{ fontSize: '11px', color: '#334155', flex: 1, fontWeight: 600, wordBreak: 'break-word' }}>
                            {typedTask}
                            {typedTask.length < current.task.length && (
                              <span style={{ opacity: 0.7, color: '#2563eb', fontWeight: 800, marginLeft: '2px', animation: 'pulse 0.6s infinite' }}>|</span>
                            )}
                          </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: 'rgba(37,99,235,0.1)', margin: '0 -2px' }} />

                        {/* Tool Call row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                            background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2,132,199,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
                          }}>
                            <Info size={10} color="#0284c7" />
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Tool Call</div>
                            <code style={{
                              fontSize: '9.5px', color: '#0c4a6e', fontFamily: 'monospace',
                              backgroundColor: '#f0f9ff', padding: '2px 6px',
                              borderRadius: '4px', border: '1px solid #bae6fd',
                              display: 'inline-block', lineHeight: '1.5'
                            }}>{current.toolCall}</code>
                          </div>
                        </div>

                        {/* Sub-task row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                            background: 'rgba(100, 116, 139, 0.08)', border: '1px solid rgba(100,116,139,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
                          }}>
                            <ArrowRight size={10} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Sub-task</div>
                            <span style={{ fontSize: '10.5px', color: '#334155' }}>{current.subtask}</span>
                          </div>
                        </div>

                        {/* Delegation row (conditional) */}
                        {current.delegation && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                              background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124,58,237,0.18)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
                            }}>
                              <Compass size={10} color="#7c3aed" />
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Delegation</div>
                              <span style={{ fontSize: '10.5px', color: '#4c1d95', fontWeight: 600 }}>{current.delegation}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
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

            {/* ========================================================== */}
            {/* SECTION 1: ARRIVAL (INCOMING) ALLOCATION                   */}
            {/* ========================================================== */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(5,150,105,0.3)', boxShadow: '0 2px 8px rgba(5,150,105,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ArrowDownRight size={16} color="#059669" />
                  Arrival (Incoming) Allocation
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                  INBOUND MANEUVER
                </span>
              </div>

              {/* Arrival Tug Boat Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Compass size={13} color="#059669" />
                    Tug Boat Allocation
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9.5px', color: '#047857', backgroundColor: '#d1fae5', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {totalArrivalPull}t / {tugReqs.requiredBollardPull}t Pull
                    </span>
                    <div 
                      className="custom-tooltip-trigger"
                      title={`AI Rationale: Vessel parameters (${vessel?.gt} weight, ${vessel?.loa} LOA, ${vessel?.draft} draft) require minimum ${tugReqs.requiredBollardPull}t bollard pull. Allocated ${selectedTugs.length} tugs (${arrivalTugsStr}) for ${totalArrivalPull}t combined force.`}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#059669" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '260px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#059669" /> Multi-Tug AI Rationale
                        </div>
                        Vessel parameters ({vessel?.gt} weight, {vessel?.loa} LOA, {vessel?.draft} draft) require minimum {tugReqs.requiredBollardPull}t pull. Allocated {selectedTugs.length} tugs ({arrivalTugsStr}) for {totalArrivalPull}t combined force.
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openTugDropdown;
                      closeAllDropdowns();
                      setOpenTugDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      minHeight: '36px',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                      {selectedTugs.map(t => (
                        <span key={t.id} style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {t.name} ({t.bollardPull})
                        </span>
                      ))}
                    </div>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openTugDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>

                  {openTugDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {TUG_FLEET.map(tug => {
                        const isSelected = selectedTugIds.includes(tug.id);
                        return (
                          <div
                            key={tug.id}
                            onClick={() => {
                              if (tug.status !== 'Maintenance') {
                                if (isSelected) {
                                  if (selectedTugIds.length > 1) {
                                    setSelectedTugIds(selectedTugIds.filter(id => id !== tug.id));
                                  }
                                } else {
                                  setSelectedTugIds([...selectedTugIds, tug.id]);
                                }
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: isSelected ? 700 : 500,
                              backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                              color: tug.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                              cursor: tug.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                              {tug.name} ({tug.bollardPull})
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(tug.status) }}>{tug.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival Harbor Pilot Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ship size={13} color="#059669" />
                    Harbor Pilot Allocation
                  </label>
                  {selectedPilotId === suggestion.pilotId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title={`AI Rationale: Matched pilot certification rank to vessel draft (${vessel?.draft || '12m'}) and current tide window.`}
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#059669" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#059669" /> Arrival Pilot Rationale
                          </div>
                          Matched pilot certification rank to vessel draft ({vessel?.draft || '12m'}) and current tide window.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openPilotDropdown;
                      closeAllDropdowns();
                      setOpenPilotDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{selectedPilot.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({selectedPilot.certification})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openPilotDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openPilotDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
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
                            padding: '6px 10px',
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

              {/* Arrival Quay Crane Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <Layers size={13} color="#059669" />
                      Quay Crane Allocation
                    </label>
                    {selectedCraneId === suggestion.craneId && (
                      <span style={{ fontSize: '9px', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>AI SUGGESTED</span>
                    )}
                    <div 
                      className="custom-tooltip-trigger"
                      title="AI Rationale: High-speed gantry crane assigned to maximize container discharge clearance rate."
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#059669" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#059669" /> Arrival Crane Rationale
                        </div>
                        High-speed gantry crane assigned to maximize container discharge clearance rate.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlaModalData({ craneName: selectedCrane.name, craneCapacity: selectedCrane.capacity, operationType: 'Arrival' })}
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: '1px solid #1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.2s ease',
                      marginLeft: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.25)';
                    }}
                  >
                    <Clock size={12} color="#ffffff" />
                    <span>View SLA & Timeline</span>
                    <ChevronRight size={12} color="#ffffff" />
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openCraneDropdown;
                      closeAllDropdowns();
                      setOpenCraneDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedCrane.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>({selectedCrane.capacity})</span>
                    </span>
                    <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0, transform: openCraneDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openCraneDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
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
                            padding: '6px 10px',
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

              {/* Arrival Berth Assignment Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Anchor size={13} color="#059669" />
                    Berth Assignment
                  </label>
                  {selectedBerthId === suggestion.berthId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title="AI Rationale: Optimal depth berth closest to assigned container yard zone."
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#059669" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#059669" /> Arrival Berth Rationale
                          </div>
                          Optimal depth berth closest to assigned container yard zone.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openBerthDropdown;
                      closeAllDropdowns();
                      setOpenBerthDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{selectedBerth.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>(Max LOA {selectedBerth.maxLoa})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openBerthDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openBerthDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
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
                            padding: '6px 10px',
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

              {/* Arrival AI Allocation Insights */}
              <div style={{ backgroundColor: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="#059669" /> Arrival AI Allocation Insights
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#1e293b', lineHeight: '1.4' }}>
                  <div>
                    <strong style={{ color: '#059669' }}>Tug:</strong> {vesselMetrics.arrivalAiReasoning.tug}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>Pilot:</strong> {vesselMetrics.arrivalAiReasoning.pilot}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>Crane:</strong> {vesselMetrics.arrivalAiReasoning.crane}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>Berth:</strong> {vesselMetrics.arrivalAiReasoning.berth}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* SECTION 2: DEPARTURE (OUTGOING) ALLOCATION                 */}
            {/* ========================================================== */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.3)', boxShadow: '0 2px 8px rgba(37,99,235,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ArrowUpRight size={16} color="#2563eb" />
                  Departure (Outgoing) Allocation
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                  OUTBOUND MANEUVER
                </span>
              </div>              {/* Departure Tug Boat Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Compass size={13} color="#2563eb" />
                    Tug Boat Allocation
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9.5px', color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {totalDepPull}t / {tugReqs.requiredBollardPull}t Pull
                    </span>
                    <div 
                      className="custom-tooltip-trigger"
                      title={`AI Rationale: Vessel parameters (${vessel?.gt} weight, ${vessel?.loa} LOA, ${vessel?.draft} draft) require minimum ${tugReqs.requiredBollardPull}t bollard pull. Allocated ${selectedDepTugs.length} departure tugs (${depTugsStr}) for ${totalDepPull}t combined thrust.`}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#2563eb" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '260px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#2563eb" /> Departure Multi-Tug AI Rationale
                        </div>
                        Allocated {selectedDepTugs.length} departure tugs ({depTugsStr}) for {totalDepPull}t combined thrust based on vessel weight ({vessel?.gt}), LOA ({vessel?.loa}), and turning basin maneuver parameters.
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepTugDropdown;
                      closeAllDropdowns();
                      setOpenDepTugDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      minHeight: '36px',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                      {selectedDepTugs.map(t => (
                        <span key={t.id} style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {t.name} ({t.bollardPull})
                        </span>
                      ))}
                    </div>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openDepTugDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>

                  {openDepTugDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {TUG_FLEET.map(tug => {
                        const isSelected = selectedDepTugIds.includes(tug.id);
                        return (
                          <div
                            key={tug.id}
                            onClick={() => {
                              if (tug.status !== 'Maintenance') {
                                if (isSelected) {
                                  if (selectedDepTugIds.length > 1) {
                                    setSelectedDepTugIds(selectedDepTugIds.filter(id => id !== tug.id));
                                  }
                                } else {
                                  setSelectedDepTugIds([...selectedDepTugIds, tug.id]);
                                }
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: isSelected ? 700 : 500,
                              backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                              color: tug.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                              cursor: tug.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                              {tug.name} ({tug.bollardPull})
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(tug.status) }}>{tug.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Harbor Pilot Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ship size={13} color="#2563eb" />
                    Harbor Pilot Allocation
                  </label>
                  {selectedDepPilotId === suggestion.depPilotId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title={`AI Rationale: Assigned senior pilot certified for departure fairway clearance and channel transit.`}
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#2563eb" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#2563eb" /> Departure Pilot Rationale
                          </div>
                          Assigned senior pilot certified for departure fairway clearance and channel transit.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepPilotDropdown;
                      closeAllDropdowns();
                      setOpenDepPilotDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{selectedDepPilot.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({selectedDepPilot.certification})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openDepPilotDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openDepPilotDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {PILOT_ROSTER.map(pilot => (
                        <div
                          key={pilot.id}
                          onClick={() => {
                            if (pilot.status !== 'Off Duty') {
                              setSelectedDepPilotId(pilot.id);
                              setOpenDepPilotDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: pilot.id === selectedDepPilotId ? 700 : 500,
                            backgroundColor: pilot.id === selectedDepPilotId ? '#f1f5f9' : 'transparent',
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

              {/* Departure Quay Crane Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <Layers size={13} color="#2563eb" />
                      Quay Crane Allocation
                    </label>
                    {selectedDepCraneId === suggestion.depCraneId && (
                      <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>AI SUGGESTED</span>
                    )}
                    <div 
                      className="custom-tooltip-trigger"
                      title="AI Rationale: Heavy-lift mobile crane reserved for final outbound container reloading and gangway stowage."
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#2563eb" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#2563eb" /> Departure Crane Rationale
                        </div>
                        Heavy-lift mobile crane reserved for final outbound container reloading and gangway stowage.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlaModalData({ craneName: selectedDepCrane.name, craneCapacity: selectedDepCrane.capacity, operationType: 'Departure' })}
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: '1px solid #1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.2s ease',
                      marginLeft: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.25)';
                    }}
                  >
                    <Clock size={12} color="#ffffff" />
                    <span>View SLA & Timeline</span>
                    <ChevronRight size={12} color="#ffffff" />
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepCraneDropdown;
                      closeAllDropdowns();
                      setOpenDepCraneDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedDepCrane.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>({selectedDepCrane.capacity})</span>
                    </span>
                    <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0, transform: openDepCraneDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openDepCraneDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {CRANE_ROSTER.map(crane => (
                        <div
                          key={crane.id}
                          onClick={() => {
                            if (crane.status !== 'Maintenance') {
                              setSelectedDepCraneId(crane.id);
                              setOpenDepCraneDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: crane.id === selectedDepCraneId ? 700 : 500,
                            backgroundColor: crane.id === selectedDepCraneId ? '#f1f5f9' : 'transparent',
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

              {/* Departure Berth Assignment Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Anchor size={13} color="#2563eb" />
                    Berth Assignment
                  </label>
                  {selectedDepBerthId === suggestion.depBerthId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title="AI Rationale: Passenger & cargo unberthing slot reserved with max LOA clearance and direct channel access."
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#2563eb" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#2563eb" /> Departure Berth Rationale
                          </div>
                          Passenger & cargo unberthing slot reserved with max LOA clearance and direct channel access.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepBerthDropdown;
                      closeAllDropdowns();
                      setOpenDepBerthDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{selectedDepBerth.name} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>(Max LOA {selectedDepBerth.maxLoa})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openDepBerthDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openDepBerthDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {docks.map(dock => (
                        <div
                          key={dock.id}
                          onClick={() => {
                            if (dock.status !== 'Occupied') {
                              setSelectedDepBerthId(dock.id);
                              setOpenDepBerthDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: dock.id === selectedDepBerthId ? 700 : 500,
                            backgroundColor: dock.id === selectedDepBerthId ? '#f1f5f9' : 'transparent',
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

              {/* Departure AI Allocation Insights */}
              <div style={{ backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="#2563eb" /> Departure AI Allocation Insights
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#1e293b', lineHeight: '1.4' }}>
                  <div>
                    <strong style={{ color: '#2563eb' }}>Tug:</strong> {vesselMetrics.departureAiReasoning.tug}
                  </div>
                  <div>
                    <strong style={{ color: '#2563eb' }}>Pilot:</strong> {vesselMetrics.departureAiReasoning.pilot}
                  </div>
                  <div>
                    <strong style={{ color: '#2563eb' }}>Crane:</strong> {vesselMetrics.departureAiReasoning.crane}
                  </div>
                  <div>
                    <strong style={{ color: '#2563eb' }}>Berth:</strong> {vesselMetrics.departureAiReasoning.berth}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Acceptance Confirmed SLA & Dispatch Timeline View */}
        {accepted && (
          <div style={{ padding: '0 24px 16px 24px' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} color="#16a34a" />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', margin: 0 }}>
                    Resource Allocation Confirmed — Live Operational Timeline & Dispatch Initiated
                  </h4>
                </div>
                <button
                  onClick={() => setSlaModalData({ craneName: selectedCrane.name, craneCapacity: selectedCrane.capacity, operationType: 'Arrival' })}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
                  }}
                >
                  <Clock size={12} color="#ffffff" />
                  <span>Launch Interactive SLA Timeline Modal</span>
                </button>
              </div>

              {/* SLA Operational Schedule Timeline Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>T-90m · PILOT BOARDING</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{selectedPilot.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Station Alpha Boarding</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>T-45m · TUG ESCORT</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{selectedTugs[0]?.name || 'Tug'}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{totalArrivalPull}t Bollard Force</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>T-0m · BERTHING</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{selectedBerth.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Berth Clearance Approved</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>T+30m · CONTAINER CRANE</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{selectedCrane.name}</div>
                  <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>38.0 TEU/h Target Pace</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 28px', borderTop: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', width: '100%' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {accepted ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={resetToSuggestion}
            style={{
              height: '44px',
              padding: '0 24px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
          <button
            onClick={handleAccept}
            style={{
              flex: 2,
              height: '44px',
              borderRadius: '10px',
              backgroundColor: accepted ? '#059669' : '#2563eb',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Check size={16} />
            <span>{accepted ? 'Confirmed — Return to Platform' : 'Accept Allocation'}</span>
          </button>
        </div>

        {slaModalData && (
          <CraneSlaModal
            vesselName={vessel.name}
            craneName={slaModalData.craneName}
            craneCapacity={slaModalData.craneCapacity}
            operationType={slaModalData.operationType}
            onClose={() => setSlaModalData(null)}
          />
        )}
      </div>
    </div>
  );
};
