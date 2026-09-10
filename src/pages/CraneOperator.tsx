import React, { useState } from 'react';
import { 
  Layers, 
  Clock, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  Cpu,
  Users,
  Shield,
  Hammer,
  Calendar,
  Radio,
  HardDrive,
  Wrench,
  BarChart2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { CraneSlaModal } from './ResourceAllocation';

interface CraneAssignmentItem {
  id: string;
  vesselName: string;
  craneName: string;
  craneCapacity: string;
  berth: string;
  operationType: 'Discharge (Arrival)' | 'Reloading (Departure)';
  status: 'In Operation' | 'Scheduled' | 'Completed';
  targetMoveRate: string;
  currentMoveRate: string;
  totalTeu: number;
  completedTeu: number;
  estimatedCompletion: string;
  stevedoreTeam: string;
  aiRationale: string;
  hoistTension: string;
  trolleySpeed: string;
  spreaderAngle: string;
}

const CRANE_ASSIGNMENTS: CraneAssignmentItem[] = [
  {
    id: 'ca-1',
    vesselName: 'MSC BARCELONA',
    craneName: 'Liebherr LHM 550 Mobile Harbor Crane',
    craneCapacity: '100t Heavy-Lift',
    berth: 'BEST-T1-B4',
    operationType: 'Discharge (Arrival)',
    status: 'In Operation',
    targetMoveRate: '36 TEU/hr',
    currentMoveRate: '38 TEU/hr',
    totalTeu: 1187,
    completedTeu: 842,
    estimatedCompletion: 'Today, 18:45',
    stevedoreTeam: 'Squad Alfa (Supervisor M. Bosch)',
    aiRationale: 'High-speed gantry crane assigned by PortICAgent to maximize container clearance rate for priority arrival window.',
    hoistTension: '48.2 tonnes',
    trolleySpeed: '3.4 m/s',
    spreaderAngle: 'Starboard 4° Vector'
  },
  {
    id: 'ca-2',
    vesselName: 'EVER ONWARDS',
    craneName: 'ZPMC Super Post-Panamax Gantry #2',
    craneCapacity: '65t Twin-Lift',
    berth: 'Moll Adossat - Terminal H',
    operationType: 'Reloading (Departure)',
    status: 'In Operation',
    targetMoveRate: '32 TEU/hr',
    currentMoveRate: '34 TEU/hr',
    totalTeu: 791,
    completedTeu: 310,
    estimatedCompletion: 'Today, 21:15',
    stevedoreTeam: 'Squad Bravo (Supervisor J. Soler)',
    aiRationale: 'Twin-lift spreader configured to accelerate outbound bay stowage and meet evening fairway departure slot.',
    hoistTension: '32.1 tonnes',
    trolleySpeed: '3.8 m/s',
    spreaderAngle: 'Port 2° Vector'
  },
  {
    id: 'ca-3',
    vesselName: 'COSTA FORTUNA',
    craneName: 'Gottwald HMK 8410 Harbor Crane',
    craneCapacity: '120t Heavy-Lift',
    berth: 'TERMINAL-C-P1',
    operationType: 'Discharge (Arrival)',
    status: 'Scheduled',
    targetMoveRate: '30 TEU/hr',
    currentMoveRate: '0 TEU/hr',
    totalTeu: 450,
    completedTeu: 0,
    estimatedCompletion: 'Tomorrow, 08:30',
    stevedoreTeam: 'Squad Charlie (Supervisor A. Roca)',
    aiRationale: 'Heavy-lift crane reserved for dual passenger provision loading and specialized cargo container discharge.',
    hoistTension: '0.0 tonnes (Standby)',
    trolleySpeed: '0.0 m/s',
    spreaderAngle: 'Neutral 0° Vector'
  }
];

const CRANE_ROSTER_DATA = [
  { id: 'cr-1', name: 'Liebherr LHM 550', capacity: '100t Heavy-Lift', status: 'Active (Assigned)', vessel: 'MSC BARCELONA', health: '98%', operator: 'Mateo Silva', type: 'Mobile Harbor', motorTemp: '78°C', hydraulicPress: '4.2 bar', cableWear: 'Nominal (2%)', lastInspection: '2026-07-01', totalHours: '1,420h' },
  { id: 'cr-2', name: 'ZPMC Super Post-Panamax #2', capacity: '65t Twin-Lift', status: 'Active (Assigned)', vessel: 'EVER ONWARDS', health: '95%', operator: 'Carlos Mendez', type: 'Quay Gantry', motorTemp: '81°C', hydraulicPress: '4.1 bar', cableWear: 'Nominal (4%)', lastInspection: '2026-06-28', totalHours: '2,890h' },
  { id: 'cr-3', name: 'Gottwald HMK 8410', capacity: '120t Heavy-Lift', status: 'Standby (Assigned)', vessel: 'COSTA FORTUNA', health: '99%', operator: 'Mateo Silva', type: 'Mobile Harbor', motorTemp: '72°C', hydraulicPress: '4.4 bar', cableWear: 'Optimal (1%)', lastInspection: '2026-07-03', totalHours: '980h' },
  { id: 'cr-4', name: 'Super Post-Panamax #4', capacity: '65t Twin-Lift', status: 'Standby', vessel: 'None (Vacant)', health: '100%', operator: 'Unassigned', type: 'Quay Gantry', motorTemp: '24°C', hydraulicPress: '4.0 bar', cableWear: 'New (0%)', lastInspection: '2026-07-05', totalHours: '450h' },
  { id: 'cr-5', name: 'Fantuzzi Reggiane MHC-200', capacity: '80t Standard', status: 'Maintenance', vessel: 'None', health: '74% (Service Req.)', operator: 'Engineering Tech', type: 'Mobile Harbor', motorTemp: '20°C', hydraulicPress: '0.8 bar', cableWear: 'Service Req. (18%)', lastInspection: '2026-07-07', totalHours: '4,120h' }
];

interface PastShiftMission {
  id: string;
  date: string;
  vessel: string;
  crane: string;
  operation: string;
  moves: string;
  status: string;
  stevedore: string;
}

interface IncidentLog {
  time: string;
  crane: string;
  event: string;
  severity: 'Info' | 'Warning' | 'Urgent';
}

interface SparePartItem {
  id: string;
  partName: string;
  craneCompatibility: string;
  stockLevel: number;
  unitCost: string;
  status: 'In Stock' | 'Low Stock' | 'Reordered';
}

const SPARE_PARTS_INVENTORY: SparePartItem[] = [
  { id: 'sp-1', partName: 'Liebherr Hoist Wire Rope (32mm Steel Core)', craneCompatibility: 'Liebherr LHM 550', stockLevel: 4, unitCost: '€4,200', status: 'In Stock' },
  { id: 'sp-2', partName: 'ZPMC Spreader Twistlock Sensor Pack', craneCompatibility: 'ZPMC Super Post-Panamax #2', stockLevel: 12, unitCost: '€850', status: 'In Stock' },
  { id: 'sp-3', partName: 'Gottwald Main Hydraulic Pump Seal Kit', craneCompatibility: 'Gottwald HMK 8410', stockLevel: 2, unitCost: '€1,450', status: 'Low Stock' },
  { id: 'sp-4', partName: 'Fantuzzi Cylinder 3 Heavy Rebuild Kit', craneCompatibility: 'Fantuzzi MHC-200', stockLevel: 1, unitCost: '€6,800', status: 'Reordered' }
];

interface CraneOperatorProps {
  viewSubMode?: string;
  onPageChange?: (pageId: any) => void;
  isMscBarcelonaAccepted?: boolean;
  onAcceptMscBarcelona?: () => void;
}

export const CraneOperator: React.FC<CraneOperatorProps> = ({
  viewSubMode = 'crane-dashboard',
  isMscBarcelonaAccepted = false,
  onAcceptMscBarcelona
}) => {
  const [slaModalData, setSlaModalData] = useState<{ craneName: string; craneCapacity: string; operationType: 'Arrival' | 'Departure'; vesselName: string } | null>(null);

  const activeTab = viewSubMode ? viewSubMode.replace('crane-', '') : 'dashboard';

  const [selectedVessel, setSelectedVessel] = useState<string>('MSC BARCELONA');
  const [selectedCraneId, setSelectedCraneId] = useState<string>('cr-1');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'pending' | 'accepted' | 'declined'>(
    isMscBarcelonaAccepted ? 'accepted' : 'pending'
  );

  React.useEffect(() => {
    if (isMscBarcelonaAccepted) {
      setDispatchStatus('accepted');
    }
  }, [isMscBarcelonaAccepted]);

  const [pastShifts] = useState<PastShiftMission[]>([
    { id: 'ps-1', date: '2026-07-08', vessel: 'ATLANTIC HORIZON', crane: 'Liebherr LHM 550', operation: 'Discharge', moves: '940 TEU (38 TEU/h)', status: 'Success', stevedore: 'Squad Alfa' },
    { id: 'ps-2', date: '2026-07-08', vessel: 'COSTA FORTUNA', crane: 'Gottwald HMK 8410', operation: 'Provision Loading', moves: '120 Units (24 U/h)', status: 'Success', stevedore: 'Squad Charlie' },
    { id: 'ps-3', date: '2026-07-07', vessel: 'NORDIC SUPPLY', crane: 'Super Post-Panamax #4', operation: 'Reloading', moves: '450 TEU (35 TEU/h)', status: 'Success', stevedore: 'Squad Bravo' }
  ]);

  const [incidentLogs] = useState<IncidentLog[]>([
    { time: '16:42', crane: 'Liebherr LHM 550', event: 'Bay 14 discharge complete. Shifting to Cell Guide 08.', severity: 'Info' },
    { time: '16:15', crane: 'ZPMC #2', event: 'Outbound reloading slot reserved for EVER ONWARDS.', severity: 'Info' },
    { time: '15:30', crane: 'Gottwald HMK', event: 'Twistlock sensor recalibration verified.', severity: 'Warning' },
    { time: '14:10', crane: 'Quay Gate 4', event: 'Wind speed 12 knots (Nominal safe lifting limits).', severity: 'Info' }
  ]);

  const [vesselChecklists, setVesselChecklists] = useState<{ [vesselName: string]: { [key: string]: boolean } }>({
    'MSC BARCELONA': {
      'Hoist Winch Tension Test Passed': true,
      'Spreader Twistlock Sensor Locked': true,
      'Anti-Sway System Calibrated': true,
      'Operator Cab Controls Verified': true,
      'Stevedore Radio VHF CH 14 Clear': true
    },
    'EVER ONWARDS': {
      'Hoist Winch Tension Test Passed': true,
      'Spreader Twistlock Sensor Locked': true,
      'Anti-Sway System Calibrated': true,
      'Operator Cab Controls Verified': false,
      'Stevedore Radio VHF CH 14 Clear': true
    },
    'COSTA FORTUNA': {
      'Hoist Winch Tension Test Passed': false,
      'Spreader Twistlock Sensor Locked': false,
      'Anti-Sway System Calibrated': false,
      'Operator Cab Controls Verified': false,
      'Stevedore Radio VHF CH 14 Clear': true
    }
  });

  const [delayReason, setDelayReason] = useState<string>('');
  const [delayDuration, setDelayDuration] = useState<string>('15 mins');

  const getStatusColor = (status: string) => {
    if (status === 'In Operation' || status === 'Active (Assigned)' || status === 'Success' || status === 'In Stock') return '#10b981';
    if (status === 'Scheduled' || status === 'Standby (Assigned)' || status === 'Standby' || status === 'Low Stock') return '#f59e0b';
    if (status === 'Completed') return '#3b82f6';
    return '#ef4444';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'In Operation' || status === 'Active (Assigned)' || status === 'Success' || status === 'In Stock') return <CheckCircle size={13} />;
    if (status === 'Scheduled' || status === 'Standby (Assigned)' || status === 'Standby' || status === 'Low Stock') return <Clock size={13} />;
    return <AlertCircle size={13} />;
  };

  const toggleChecklistItem = (item: string) => {
    setVesselChecklists(prev => {
      const current = prev[selectedVessel] || {};
      return {
        ...prev,
        [selectedVessel]: {
          ...current,
          [item]: !current[item]
        }
      };
    });
  };

  const activeAssignment = CRANE_ASSIGNMENTS.find(a => a.vesselName === selectedVessel) || CRANE_ASSIGNMENTS[0];
  const selectedCraneDetail = CRANE_ROSTER_DATA.find(c => c.id === selectedCraneId) || CRANE_ROSTER_DATA[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', width: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', width: '100%' }}>
            {/* Stat Cards */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Active Quay Cranes</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>2 Active</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                Liebherr LHM 550 & ZPMC Super Post-Panamax #2 operating at peak capacity.
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Avg Clearance Pace</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb' }}>36.0 TEU/h</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                Exceeding target SLA move pace (34 TEU/h) for priority arrival window.
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>AI Agent Status</h4>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#2563eb" /> Synchronized
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                PortICAgent, NavAgent & DataAgent telemetry synchronized live.
              </div>
            </div>

            {/* Next Shift Dispatch Authorization */}
            {dispatchStatus === 'pending' ? (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Pending Crane Dispatch</span>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '6px', margin: 0 }}>Vessel Container Clearance Assignment</h3>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Crane: <strong>Liebherr LHM 550 (100t)</strong></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>TARGET VESSEL</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>MSC BARCELONA</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>OPERATION & CARGO</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>1,187 TEU Discharge</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>LOCATION / BERTH</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>BEST-T1-B4 (Quay 4)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setDispatchStatus('declined')} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'transparent', color: '#475569', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>Decline</button>
                  <button onClick={() => { setDispatchStatus('accepted'); onAcceptMscBarcelona?.(); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>Accept Crane Shift Mission</button>
                </div>
              </div>
            ) : (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px' }}>
                {dispatchStatus === 'accepted' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} color="#10b981" />
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#047857', margin: 0 }}>
                          Crane Shift Mission Accepted — Live Operational Timeline & Telemetry Active
                        </h4>
                      </div>
                      <button
                        onClick={() => setSlaModalData({ craneName: 'Liebherr LHM 550 Mobile Harbor Crane', craneCapacity: '100t Heavy-Lift', operationType: 'Arrival', vesselName: 'MSC BARCELONA' })}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#ffffff',
                          backgroundColor: '#2563eb',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        <Clock size={12} color="#ffffff" />
                        <span>Launch SLA Timeline</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>16:12 - BERTHING & SPREADER</div>
                        <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>✓ Completed</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>17:30 - BAY 01-12 DISCHARGE</div>
                        <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>✓ Completed (320 TEU)</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>IN PROGRESS - MAIN DISCHARGE</div>
                        <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>842 / 1,187 TEU (38 TEU/h)</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>18:45 - EST. COMPLETION</div>
                        <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>On Schedule</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>Crane shift mission declined — terminal dispatcher notified for reassignment.</span>
                  </div>
                )}
              </div>
            )}

            {/* Stevedore Duty Roster */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Stevedore Squad Roster</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#000000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>Squad Alfa (M. Silva)</span>
                  <strong style={{ color: '#10b981' }}>Active Quay 4</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>Squad Bravo (C. Mendez)</span>
                  <strong style={{ color: '#10b981' }}>Active Quay H</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>Squad Charlie (M. Silva)</span>
                  <strong style={{ color: '#2563eb' }}>Standby Terminal C</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>Tech Team (Engineering)</span>
                  <strong style={{ color: '#ef4444' }}>Maintenance Dock</strong>
                </div>
              </div>
            </div>

            {/* Incident Logs Feed & Terminal Signals */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Incident Feed & System Signals</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {incidentLogs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '11.5px', color: '#000000' }}>
                    <div>
                      <strong style={{ color: log.severity === 'Urgent' ? '#ef4444' : log.severity === 'Warning' ? '#f59e0b' : '#2563eb' }}>[{log.severity}]</strong>{' '}
                      <strong>{log.crane}:</strong> {log.event}
                    </div>
                    <span style={{ color: '#000000' }}>{log.time} UTC+2</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Regulations */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}><Shield size={14} /> Safety Regulations</h3>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
                1. Max heavy-lift rating is 100t for Liebherr LHM 550.<br/>
                2. Auto-shutdown activates at wind speeds above 25 knots.<br/>
                3. Maintain 2.0m clearance above vessel hatch guides.<br/>
                4. VHF dual watch required on Channels 14 & 16.
              </div>
            </div>

            {/* Maintenance Schedule */}
            <div style={{ gridColumn: '1 / -1', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Hammer size={14} /> Quay Crane Maintenance & Inspections</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '11px' }}>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>Liebherr LHM 550 Wire Check</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>Due: 2026-07-12</div>
                  <div style={{ color: '#10b981', fontWeight: 600, marginTop: '6px' }}>✓ Scheduled</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>ZPMC #2 Spreader Calibration</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>Due: In Progress</div>
                  <div style={{ color: '#f59e0b', fontWeight: 600, marginTop: '6px' }}>⚠ Urgent Service</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>Gottwald HMK Hydraulic Service</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>Due: 2026-07-18</div>
                  <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '6px' }}>Planned</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>Fantuzzi MHC Motor Overhaul</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>Due: 2026-07-22</div>
                  <div style={{ color: '#ef4444', fontWeight: 600, marginTop: '6px' }}>Critical Service</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '16px', width: '100%' }}>
            {/* Left Column: Active Assignments & Past Shifts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Active Crane Assignments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CRANE_ASSIGNMENTS.map(asn => (
                  <div 
                    key={asn.id} 
                    onClick={() => setSelectedVessel(asn.vesselName)}
                    style={{ 
                      backgroundColor: selectedVessel === asn.vesselName ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.5)', 
                      border: selectedVessel === asn.vesselName ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.06)', 
                      borderRadius: '12px', 
                      padding: '16px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{asn.vesselName}</h4>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Op: <strong>{asn.operationType}</strong> at {asn.berth}</div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: getStatusColor(asn.status), backgroundColor: `${getStatusColor(asn.status)}15`, border: `1px solid ${getStatusColor(asn.status)}25`, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {getStatusIcon(asn.status)}
                        {asn.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '11px', color: '#475569' }}>
                      <div>
                        <div>Pace</div>
                        <div style={{ fontWeight: 600, color: '#10b981', marginTop: '2px' }}>{asn.currentMoveRate}</div>
                      </div>
                      <div>
                        <div>Crane</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asn.craneName.split(' ')[0]}</div>
                      </div>
                      <div>
                        <div>Target TEU</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{asn.completedTeu}/{asn.totalTeu}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Completed Shifts */}
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '16px 0 4px 0' }}><Calendar size={14} /> Completed Crane Shifts (Past 24h)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pastShifts.map(ps => (
                  <div key={ps.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '11px', color: '#000000' }}>
                    <div>
                      <strong>{ps.vessel}</strong> ({ps.operation})
                      <div style={{ color: '#000000', fontSize: '9px', marginTop: '2px' }}>Crane: {ps.crane} • {ps.stevedore}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Success</span>
                      <div style={{ color: '#000000', fontSize: '9px', marginTop: '2px' }}>{ps.moves}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column: Interactive Pre-Operational Checklist & Downtime Logger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Crane Pre-Operational Protocol</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Active Vessel: <strong>{selectedVessel}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.keys(vesselChecklists[selectedVessel] || vesselChecklists['MSC BARCELONA']).map(item => {
                    const checked = (vesselChecklists[selectedVessel] || vesselChecklists['MSC BARCELONA'])[item];
                    return (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#1e293b', cursor: 'pointer', padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <input 
                          type="checkbox" 
                          checked={checked} 
                          onChange={() => toggleChecklistItem(item)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ textDecoration: checked ? 'line-through' : 'none', color: checked ? '#64748b' : '#1e293b' }}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <button 
                  onClick={() => {
                    setToastMsg(`Pre-op protocol for ${selectedVessel} updated.`);
                    setTimeout(() => setToastMsg(null), 4000);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                >
                  Send Protocol Update
                </button>
              </div>

              {/* Downtime Logger */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Report Shift Downtime / Delay</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <select 
                    value={delayDuration} 
                    onChange={(e) => setDelayDuration(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px' }}
                  >
                    <option>10 mins</option>
                    <option>15 mins</option>
                    <option>30 mins</option>
                    <option>45 mins+</option>
                  </select>
                  <textarea 
                    placeholder="Describe downtime reason (e.g. twistlock jam, wind surge)..."
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', minHeight: '60px', fontFamily: 'inherit' }}
                  />
                  <button 
                    onClick={() => {
                      setToastMsg(`Downtime of ${delayDuration} logged for ${selectedVessel}`);
                      setDelayReason('');
                      setTimeout(() => setToastMsg(null), 4000);
                    }}
                    style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                  >
                    Log Downtime
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Telemetry & Crane Signal Codes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="#2563eb" /> Live Crane Operational Telemetry</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Assigned Unit: <strong>{activeAssignment.craneName}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>HOIST LINE TENSION</span>
                      <span style={{ color: '#10b981' }}>NOMINAL</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{activeAssignment.hoistTension}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: '78%', height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>TROLLEY TRAVERSE SPEED</span>
                      <span style={{ color: '#10b981' }}>NOMINAL</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{activeAssignment.trolleySpeed}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: '68%', height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>SPREADER SWAY VECTOR</span>
                      <span style={{ color: '#2563eb' }}>AUTO-STABILIZED</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{activeAssignment.spreaderAngle}</div>
                  </div>
                </div>
              </div>

              {/* Signal Codes Reference */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>VHF Crane Hand Signals</h3>
                <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Code 1:</strong> Commencing cell guide discharge</div>
                  <div><strong>Code 2:</strong> Twistlock engaged & locked on bay</div>
                  <div><strong>Code 3:</strong> Outbound lashing complete for clearance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roster Tab */}
        {(activeTab === 'roster' || activeTab === 'crane-roster') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Top Stat Summary Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Crane Fleet</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>5 Units</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>3 Quay Gantries, 2 Mobile Harbors</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fleet Availability</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>80% Active</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>4 Operational / 1 Scheduled Service</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Avg Equipment Health</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>93.2%</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Hydraulics & Hoist Cables Nominal</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Shift Hoist Hours</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>38.5 Hours</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Current Shift Operating Load</div>
              </div>
            </div>

            {/* Main Content Grid: Equipment Roster (Left) + Live Diagnostics & Inventory (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '16px', width: '100%' }}>
              
              {/* Left Column: Full Equipment Roster Cards & Spare Parts Inventory */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Roster Cards List */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={16} color="#2563eb" /> Quay Crane Equipment Roster
                    </h3>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Select crane for diagnostics</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {CRANE_ROSTER_DATA.map(crane => (
                      <div 
                        key={crane.id}
                        onClick={() => setSelectedCraneId(crane.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          borderRadius: '10px',
                          border: selectedCraneId === crane.id ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.06)',
                          backgroundColor: selectedCraneId === crane.id ? 'rgba(37,99,235,0.04)' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer',
                          flexWrap: 'wrap',
                          gap: '12px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: selectedCraneId === crane.id ? '#2563eb' : 'rgba(37, 99, 235, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}>
                            <Layers size={20} color={selectedCraneId === crane.id ? '#ffffff' : '#2563eb'} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                              {crane.name} <span style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 500 }}>({crane.capacity})</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              Type: {crane.type} · Operator: <strong>{crane.operator}</strong> · Vessel: <strong>{crane.vessel}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            <span style={{ color: '#64748b' }}>Motor:</span> <strong>{crane.motorTemp}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            <span style={{ color: '#64748b' }}>Hydraulics:</span> <strong>{crane.hydraulicPress}</strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>HEALTH</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>{crane.health}</div>
                          </div>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            color: getStatusColor(crane.status),
                            backgroundColor: `${getStatusColor(crane.status)}15`,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {crane.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal Spare Parts & Equipment Inventory */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wrench size={16} color="#2563eb" /> Terminal Heavy Spare Parts & Component Stock
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SPARE_PARTS_INVENTORY.map(part => (
                      <div key={part.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', fontSize: '11.5px' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>{part.partName}</strong>
                          <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>Compatibility: {part.craneCompatibility}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{part.stockLevel} units</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{part.unitCost} / unit</div>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: getStatusColor(part.status), backgroundColor: `${getStatusColor(part.status)}15`, padding: '3px 8px', borderRadius: '4px' }}>
                            {part.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Selected Crane Telemetry & Duty Roster */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Live Diagnostics Card for Selected Crane */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={15} color="#2563eb" /> Live Crane Telemetry & Health
                    </h3>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '2px 6px', borderRadius: '4px' }}>
                      LIVE SENSOR
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{selectedCraneDetail.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{selectedCraneDetail.capacity} · {selectedCraneDetail.type}</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', fontSize: '11px' }}>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>OPERATOR</div>
                        <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{selectedCraneDetail.operator}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>CABLE WEAR</div>
                        <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{selectedCraneDetail.cableWear}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>TOTAL HOURS</div>
                        <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{selectedCraneDetail.totalHours}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>LAST INSPECTION</div>
                        <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{selectedCraneDetail.lastInspection}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                        <span>HYDRAULIC PRESSURE</span>
                        <span style={{ color: '#10b981' }}>NOMINAL</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '3px' }}>{selectedCraneDetail.hydraulicPress}</div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                        <span>MOTOR TEMP</span>
                        <span style={{ color: '#2563eb' }}>STABLE</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '3px' }}>{selectedCraneDetail.motorTemp}</div>
                    </div>
                  </div>
                </div>

                {/* Operator Duty Roster */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} color="#2563eb" /> Quay Crane Operators Roster
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>Mateo Silva</strong>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>Senior Crane Specialist</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>On Duty (Shift A)</span>
                    </div>

                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>Carlos Mendez</strong>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>Quay Gantry Lead</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>On Duty (Shift A)</span>
                    </div>

                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>Engineering Tech</strong>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>Maintenance Specialist</div>
                      </div>
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>Service Dock</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* SLA Timeline Tab */}
        {(activeTab === 'sla-timeline' || activeTab === 'timeline' || activeTab === 'crane-sla-timeline') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Top Stat Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Overall SLA Compliance</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>98.4%</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>On-Time Clearance Rate</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Avg Clearance Speed</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>36.0 TEU/h</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Exceeding 34.0 TEU/h Target</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Turnaround Time Saved</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>+42 mins</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Saved via PortICAgent Sync</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active SLA Monitored</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>3 Vessels</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>MSC Barcelona, Ever Onwards, Costa Fortuna</div>
              </div>
            </div>

            {/* Main Content Grid: Move Timelines (Left 2 cols) + Launch SLA & Hourly Chart (Right col) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '16px', width: '100%' }}>
              
              {/* Left Column: Comprehensive Vessel Move Timelines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="#2563eb" /> Active Vessel Clearance SLA Schedules & Milestones
                    </h3>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Shift Timeline Feed</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* MSC BARCELONA Timeline Row */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>MSC BARCELONA</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>(Berth BEST-T1-B4)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '3px 8px', borderRadius: '4px' }}>
                            38.0 TEU/h (Exceeding SLA)
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>16:12 - BERTHING & SPREADER</div>
                          <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>✓ Completed</div>
                          <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Liebherr LHM 550 locked</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>17:30 - BAY 01-12 DISCHARGE</div>
                          <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>✓ Completed (320 TEU)</div>
                          <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Pace: 38 TEU/h</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>IN PROGRESS - MAIN DISCHARGE</div>
                          <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>842 / 1,187 TEU</div>
                          <div style={{ fontSize: '9.5px', color: '#2563eb', marginTop: '2px' }}>71% Progress</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>18:45 - EST. COMPLETION</div>
                          <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>On Schedule</div>
                          <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Unberthing reserved</div>
                        </div>
                      </div>
                    </div>

                    {/* EVER ONWARDS Timeline Row */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>EVER ONWARDS</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>(Moll Adossat - Terminal H)</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '3px 8px', borderRadius: '4px' }}>
                          34.0 TEU/h (On Track)
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>15:00 - INBOUND DISCHARGE</div>
                          <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>✓ Completed</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>IN PROGRESS - RELOADING</div>
                          <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>310 / 791 TEU</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>20:30 - HATCH LOCKOUT</div>
                          <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>Scheduled</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>21:15 - EST. COMPLETION</div>
                          <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>On Schedule</div>
                        </div>
                      </div>
                    </div>

                    {/* COSTA FORTUNA Timeline Row */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>COSTA FORTUNA</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>(Terminal C - Pier 1)</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', backgroundColor: '#f59e0b15', padding: '3px 8px', borderRadius: '4px' }}>
                          Scheduled Tomorrow 08:30
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>07:00 - PRE-CHECK & CRANE POSITION</div>
                          <div style={{ fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>Scheduled</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>08:30 - PROVISION LOADING</div>
                          <div style={{ fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>Scheduled</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>11:00 - CARGO CONTAINER CLEARANCE</div>
                          <div style={{ fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>Scheduled</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>14:00 - COMPLETED</div>
                          <div style={{ fontWeight: 700, color: '#64748b', marginTop: '2px' }}>Pending Arrival</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* AI Rationale & Optimization Insights Log */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#2563eb" /> AI Agent SLA Optimization Insights
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', color: '#334155' }}>
                    <div style={{ backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px' }}>PortICAgent Move Rate Optimization</div>
                      Assigned dual-spreader configuration to Liebherr LHM 550 for MSC BARCELONA, boosting clearance speed to 38.0 TEU/h (+11.7% above baseline SLA target).
                    </div>
                    <div style={{ backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px' }}>NavAgent Departure Slot Sync</div>
                      Synchronized EVER ONWARDS reloading completion at 21:15 to match high-tide exit window, saving 25 minutes of anchorage delay.
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Launch SLA Control Center & Hourly Throughput Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* SLA Launch Card */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} color="#2563eb" /> Interactive SLA Control
                  </h3>

                  <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' }}>
                    Launch the full interactive SLA Modal to simulate crane speed changes, inspect berth bottlenecks, or trigger stevedore dispatch updates.
                  </p>

                  <button
                    onClick={() => setSlaModalData({ craneName: 'Liebherr LHM 550 Mobile Harbor Crane', craneCapacity: '100t Heavy-Lift', operationType: 'Arrival', vesselName: 'MSC BARCELONA' })}
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Clock size={16} color="#ffffff" />
                    <span>Launch MSC BARCELONA SLA Modal</span>
                  </button>
                </div>

                {/* Hourly Throughput Bar Chart Breakdown */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart2 size={16} color="#2563eb" /> Hourly Move Pace (TEU/h)
                    </h3>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>+8.2% vs Avg</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        <span>14:00 - 15:00 UTC+2</span>
                        <strong style={{ color: '#2563eb' }}>32 TEU/h</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '80%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        <span>15:00 - 16:00 UTC+2</span>
                        <strong style={{ color: '#2563eb' }}>35 TEU/h</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '88%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        <span>16:00 - 17:00 UTC+2 (Current)</span>
                        <strong style={{ color: '#10b981' }}>38 TEU/h (Peak)</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '95%', height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* SLA Modal Trigger */}
      {slaModalData && (
        <CraneSlaModal
          vesselName={slaModalData.vesselName}
          craneName={slaModalData.craneName}
          craneCapacity={slaModalData.craneCapacity}
          operationType={slaModalData.operationType}
          onClose={() => setSlaModalData(null)}
        />
      )}
    </div>
  );
};
