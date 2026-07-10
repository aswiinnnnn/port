import React, { useMemo, useState } from 'react';
import { Ship, Anchor, Compass, Sparkles, Check, X, RefreshCw } from 'lucide-react';
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
    const berthPool = vacantBerths.length > 0 ? vacantBerths : docks;
    const berth = berthPool[seed % berthPool.length];
    return { tugId: tug.id, pilotId: pilot.id, berthId: berth.id };
  }, [vessel, vacantBerths]);

  const [accepted, setAccepted] = useState(false);
  const [selectedTugId, setSelectedTugId] = useState<string>(suggestion?.tugId ?? TUG_FLEET[0].id);
  const [selectedPilotId, setSelectedPilotId] = useState<string>(suggestion?.pilotId ?? PILOT_ROSTER[0].id);
  const [selectedBerthId, setSelectedBerthId] = useState<string>(suggestion?.berthId ?? docks[0].id);

  React.useEffect(() => {
    if (suggestion) {
      setSelectedTugId(suggestion.tugId);
      setSelectedPilotId(suggestion.pilotId);
      setSelectedBerthId(suggestion.berthId);
      setAccepted(false);
    }
  }, [vessel?.name, suggestion]);

  if (!vessel || !suggestion) {
    return null;
  }

  const selectedTug = TUG_FLEET.find(t => t.id === selectedTugId)!;
  const selectedPilot = PILOT_ROSTER.find(p => p.id === selectedPilotId)!;
  const selectedBerth = docks.find(d => d.id === selectedBerthId)!;

  const suggestedTug = TUG_FLEET.find(t => t.id === suggestion.tugId)!;
  const suggestedPilot = PILOT_ROSTER.find(p => p.id === suggestion.pilotId)!;
  const suggestedBerth = docks.find(d => d.id === suggestion.berthId)!;

  const statusColor = (status: string) => {
    if (status === 'Available') return '#10b981';
    if (status === 'On Assignment' || status === 'Occupied') return '#f59e0b';
    return '#ef4444';
  };

  const resetToSuggestion = () => {
    setSelectedTugId(suggestion.tugId);
    setSelectedPilotId(suggestion.pilotId);
    setSelectedBerthId(suggestion.berthId);
  };

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
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
      <div style={{
        backgroundColor: '#EAF1F3',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
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

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px', flex: 1 }}>

          {/* Left: Vessel Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Vessel Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>LOA</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.loa}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>DRAFT</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.draft}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>GT</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.gt}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TUGS</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.tugs}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>ETA</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.eta}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>CARGO</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.cargo}</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>RISK PROFILE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {vessel.riskLevel}
                <span style={{ fontSize: '12px', color: 'white', backgroundColor: vessel.riskLevel === 'CRITICAL RISK' ? '#ef4444' : vessel.riskLevel === 'HIGH RISK' ? '#f97316' : '#eab308', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {vessel.risk}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>OPERATOR</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vessel.operator}</div>
            </div>

            {/* Vessel Image */}
            <div style={{ 
              marginTop: 'auto', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '120px'
            }}>
              <img 
                src={vessel.image} 
                alt={vessel.name} 
                style={{ 
                  maxHeight: '120px', 
                  maxWidth: '100%', 
                  objectFit: 'contain'
                }} 
              />
            </div>
          </div>

          {/* Right: Resource Allocation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#2563eb" />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Resource Allocation</h3>
            </div>

            {/* Tug Boat */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={12} />
                  Tug Boat
                </span>
                {selectedTugId === suggestion.tugId && (
                  <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                )}
              </label>
              <select
                value={selectedTugId}
                onChange={(e) => setSelectedTugId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  fontSize: '13px',
                  color: '#1e293b',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '32px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e293b' d='M1 4l5 4 5-4'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center'
                }}
              >
                {TUG_FLEET.map(tug => (
                  <option key={tug.id} value={tug.id} disabled={tug.status === 'Maintenance'}>
                    {tug.name} — {tug.bollardPull} {tug.status !== 'Available' ? `(${tug.status})` : ''}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{selectedTug.name}</span>
                <span style={{ color: statusColor(selectedTug.status), fontWeight: 700 }}>{selectedTug.status}</span>
              </div>
              {selectedTugId !== suggestion.tugId && (
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                  AI suggested: {suggestedTug.name}
                </div>
              )}
            </div>

            {/* Harbor Pilot */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ship size={12} />
                  Harbor Pilot
                </span>
                {selectedPilotId === suggestion.pilotId && (
                  <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                )}
              </label>
              <select
                value={selectedPilotId}
                onChange={(e) => setSelectedPilotId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  fontSize: '13px',
                  color: '#1e293b',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '32px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e293b' d='M1 4l5 4 5-4'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center'
                }}
              >
                {PILOT_ROSTER.map(pilot => (
                  <option key={pilot.id} value={pilot.id} disabled={pilot.status === 'Off Duty'}>
                    {pilot.name} — {pilot.certification} {pilot.status !== 'Available' ? `(${pilot.status})` : ''}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{selectedPilot.name}</span>
                <span style={{ color: statusColor(selectedPilot.status), fontWeight: 700 }}>{selectedPilot.status}</span>
              </div>
              {selectedPilotId !== suggestion.pilotId && (
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                  AI suggested: {suggestedPilot.name}
                </div>
              )}
            </div>

            {/* Berth */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Anchor size={12} />
                  Berth
                </span>
                {selectedBerthId === suggestion.berthId && (
                  <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>AI SUGGESTED</span>
                )}
              </label>
              <select
                value={selectedBerthId}
                onChange={(e) => setSelectedBerthId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  fontSize: '13px',
                  color: '#1e293b',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '32px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e293b' d='M1 4l5 4 5-4'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center'
                }}
              >
                {docks.map(dock => (
                  <option key={dock.id} value={dock.id} disabled={dock.status === 'Occupied'}>
                    {dock.name} — Max LOA {dock.maxLoa} {dock.status !== 'Vacant' ? `(${dock.status})` : ''}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{selectedBerth.name}</span>
                <span style={{ color: statusColor(selectedBerth.status), fontWeight: 700 }}>{selectedBerth.status}</span>
              </div>
              {selectedBerthId !== suggestion.berthId && (
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                  AI suggested: {suggestedBerth.name}
                </div>
              )}
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
