import React, { useEffect, useState } from 'react';
import { Compass, AlertCircle, CheckCircle, Clock, Wind, Navigation, Shield, BookOpen, Activity, Calendar, Book, Layers, BarChart, List, Users } from 'lucide-react';

interface PilotAssignment {
  id: string;
  vessel: string;
  operation: 'Arrival' | 'Departure';
  eta: string;
  berth: string;
  status: 'Scheduled' | 'Briefed' | 'On Vessel' | 'Complete';
  certification: string;
  loa: string;
  draft: string;
  tugCount: number;
}

interface VesselManeuveringProfile {
  name: string;
  type: string;
  propellerType: string;
  bowThruster: string;
  sternThruster: string;
  rudderAngleLimit: string;
  airDraft: string;
  anchorStatus: string;
  squatConstant: string;
  turningRadius: string;
}

interface PastPilotage {
  id: string;
  date: string;
  vessel: string;
  loa: string;
  draft: string;
  berth: string;
  notes: string;
}

interface TideForecast {
  time: string;
  height: string;
  flow: 'Ebb' | 'Flood' | 'Slack';
}

interface AnchoredVessel {
  vesselName: string;
  loa: string;
  draft: string;
  anchorageArea: string;
  status: string;
}

interface SwellSensor {
  sensorId: string;
  location: string;
  waveHeight: string;
  wavePeriod: string;
  direction: string;
  status: string;
}

interface PilotRoster {
  name: string;
  watch: string;
  status: 'On Duty' | 'Standby' | 'Rest';
  currentVessel: string;
}

interface HarbourPilotProps {
  activeTab: 'dashboard' | 'assignments' | 'vessel-data' | 'conditions';
}

export const HarbourPilot: React.FC<HarbourPilotProps> = ({ activeTab }) => {
  const [assignments] = useState<PilotAssignment[]>([
    { id: 'pa-1', vessel: 'GRAND ZEPHYR', operation: 'Arrival', eta: '2026-07-09 14:30', berth: 'South T2', status: 'Scheduled', certification: 'Deep Draft Certified', loa: '198m', draft: '11.2m', tugCount: 2 },
    { id: 'pa-2', vessel: 'MARITIME STAR', operation: 'Arrival', eta: '2026-07-10 08:00', berth: 'RoRo Terminal', status: 'Scheduled', certification: 'Cruise Vessel Certified', loa: '240m', draft: '8.5m', tugCount: 2 },
    { id: 'pa-3', vessel: 'CARGO EXPRESS', operation: 'Departure', eta: '2026-07-09 18:00', berth: 'Container T1', status: 'Briefed', certification: 'Standard Certified', loa: '150m', draft: '7.8m', tugCount: 1 }
  ]);

  const [pastPilotages] = useState<PastPilotage[]>([
    { id: 'pp-1', date: '2026-07-08', vessel: 'ATLANTIC HORIZON', loa: '225m', draft: '9.8m', berth: 'Bulk Pier 1', notes: 'Completed without incidents. Wind gusting 15kts.' },
    { id: 'pp-2', date: '2026-07-07', vessel: 'MSC BARCELONA', loa: '366m', draft: '14.5m', berth: 'Container T2', notes: 'Required 3 tugs due to strong flooding currents.' },
    { id: 'pp-3', date: '2026-07-05', vessel: 'COSTA FORTUNA', loa: '272m', draft: '8.2m', berth: 'Cruise Pier A', notes: 'Smooth mooring, Azipods fully functional.' }
  ]);

  const [tideTable] = useState<TideForecast[]>([
    { time: '12:00', height: '+0.8m', flow: 'Flood' },
    { time: '13:00', height: '+1.1m', flow: 'Flood' },
    { time: '14:00', height: '+1.3m', flow: 'Slack' },
    { time: '15:00', height: '+1.2m', flow: 'Ebb' },
    { time: '16:00', height: '+0.9m', flow: 'Ebb' }
  ]);

  const [anchoredVessels] = useState<AnchoredVessel[]>([
    { vesselName: 'PACIFIC TRADER', loa: '185m', draft: '9.2m', anchorageArea: 'Anchorage A (Inner)', status: 'Awaiting Berth Clearance' },
    { vesselName: 'OCEAN GALAXY', loa: '210m', draft: '10.5m', anchorageArea: 'Anchorage B (Outer)', status: 'Vessel Maintenance' },
    { vesselName: 'VALE BRASIL', loa: '362m', draft: '18.2m', anchorageArea: 'Deep anchorage C', status: 'Awaiting Tide window' }
  ]);

  const [swellSensors] = useState<SwellSensor[]>([
    { sensorId: 'SNS-01', location: 'Station Alpha', waveHeight: '0.8m', wavePeriod: '6.2s', direction: 'SW 220°', status: 'Nominal' },
    { sensorId: 'SNS-02', location: 'Breakwater Gate', waveHeight: '1.2m', wavePeriod: '7.5s', direction: 'WSW 245°', status: 'Nominal' },
    { sensorId: 'SNS-03', location: 'Inner Basin', waveHeight: '0.2m', wavePeriod: '3.1s', direction: 'Calm', status: 'Nominal' }
  ]);

  const [pilotRoster] = useState<PilotRoster[]>([
    { name: 'Capt. Davies', watch: 'Shift A (06:00 - 18:00)', status: 'On Duty', currentVessel: 'GRAND ZEPHYR' },
    { name: 'Capt. Henderson', watch: 'Shift A (06:00 - 18:00)', status: 'On Duty', currentVessel: 'MARITIME STAR' },
    { name: 'Capt. Martinez', watch: 'Shift B (18:00 - 06:00)', status: 'Standby', currentVessel: 'CARGO EXPRESS' },
    { name: 'Capt. Vance', watch: 'Shift B (18:00 - 06:00)', status: 'Rest', currentVessel: 'None' }
  ]);

  const [selectedVessel, setSelectedVessel] = useState<string>('GRAND ZEPHYR');

  const [vesselProfiles] = useState<{ [key: string]: VesselManeuveringProfile }>({
    'GRAND ZEPHYR': {
      name: 'GRAND ZEPHYR',
      type: 'Ro-Ro Cargo Vessel',
      propellerType: 'Single Variable Pitch',
      bowThruster: '1x 1200 kW (Operational)',
      sternThruster: 'None',
      rudderAngleLimit: '35 degrees (Spade Rudder)',
      airDraft: '38.5m',
      anchorStatus: 'Port & Starboard anchors fully cleared',
      squatConstant: '1.45 (High Squat risk in shallow canals)',
      turningRadius: '320 meters'
    },
    'MARITIME STAR': {
      name: 'MARITIME STAR',
      type: 'Passenger Cruise Ship',
      propellerType: 'Dual Azipod Propulsion',
      bowThruster: '3x 2000 kW (Operational)',
      sternThruster: 'None (Azipod controlled)',
      rudderAngleLimit: '360 degrees (Omnidirectional)',
      airDraft: '52.0m',
      anchorStatus: 'Fully operational',
      squatConstant: '1.10 (Moderate)',
      turningRadius: '180 meters'
    },
    'CARGO EXPRESS': {
      name: 'CARGO EXPRESS',
      type: 'General Container Vessel',
      propellerType: 'Single Fixed Pitch Right-Handed',
      bowThruster: '1x 800 kW (Operational)',
      sternThruster: 'None',
      rudderAngleLimit: '35 degrees',
      airDraft: '32.1m',
      anchorStatus: 'Starboard anchor cleared only',
      squatConstant: '1.30 (Moderate)',
      turningRadius: '280 meters'
    }
  });

  const defaultChecklist = {
    'Pre-Arrival Master Exchange Completed': true,
    'Vessel Drafts Verified': true,
    'Thrusters & Rudder Response Checked': false,
    'Towage Tug Lines Secured': false,
    'Turning Basin Speed Under 3 knots': false,
    'First Mooring Line Secured': false
  };

  // Passage checklist is keyed per vessel so toggling one vessel's items
  // doesn't leak into another vessel's checklist state.
  const [passageChecklistByVessel, setPassageChecklistByVessel] = useState<{ [vessel: string]: { [key: string]: boolean } }>({
    'GRAND ZEPHYR': { ...defaultChecklist },
    'MARITIME STAR': { ...defaultChecklist, 'Pre-Arrival Master Exchange Completed': true, 'Vessel Drafts Verified': true, 'Thrusters & Rudder Response Checked': true },
    'CARGO EXPRESS': { ...defaultChecklist, 'Pre-Arrival Master Exchange Completed': true, 'Vessel Drafts Verified': false }
  });
  const passageChecklist = passageChecklistByVessel[selectedVessel] ?? defaultChecklist;

  // Live telemetry keyed per vessel — each vessel has its own speed, UKC, and
  // turning-basin readings so the panel actually changes when selection changes.
  const telemetryByVessel: { [vessel: string]: { speed: string; speedPercent: number; ukc: string; ukcPercent: number; ukcStatus: string; basin: string } } = {
    'GRAND ZEPHYR': { speed: '6.4 knots', speedPercent: 64, ukc: '+2.45 meters', ukcPercent: 85, ukcStatus: 'NOMINAL', basin: 'Basin B Cleared' },
    'MARITIME STAR': { speed: '5.1 knots', speedPercent: 51, ukc: '+4.80 meters', ukcPercent: 95, ukcStatus: 'NOMINAL', basin: 'RoRo Basin Cleared' },
    'CARGO EXPRESS': { speed: '3.8 knots', speedPercent: 38, ukc: '+1.10 meters', ukcPercent: 55, ukcStatus: 'CAUTION', basin: 'Container T1 — Awaiting Clearance' }
  };
  const activeTelemetry = telemetryByVessel[selectedVessel] ?? telemetryByVessel['GRAND ZEPHYR'];

  // Under Keel Clearance Calculator State — default draft syncs to the
  // selected vessel's actual draft from its assignment record.
  const [ukcDraft, setUkcDraft] = useState<number>(11.2);
  const [ukcTide, setUkcTide] = useState<number>(1.2);
  const [ukcSafetyMargin, setUkcSafetyMargin] = useState<number>(1.0);
  const [ukcDepthResult, setUkcDepthResult] = useState<number>(13.4);

  // Passage planner state
  const [planBoardingPt, setPlanBoardingPt] = useState<string>('Station Alpha');
  const [planTransitSpeed, setPlanTransitSpeed] = useState<string>('8 knots');
  const [planTurningPoint, setPlanTurningPoint] = useState<string>('Basin B');

  // Keep the UKC calculator's default draft in sync with whichever vessel is
  // currently selected, so switching vessels updates the starting point.
  useEffect(() => {
    const asn = assignments.find(a => a.vessel === selectedVessel);
    if (asn) {
      const draftValue = parseFloat(asn.draft);
      if (!Number.isNaN(draftValue)) {
        setUkcDraft(draftValue);
        setUkcDepthResult(draftValue + ukcSafetyMargin - ukcTide);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVessel]);

  const getStatusColor = (status: string) => {
    if (status === 'Complete') return '#10b981';
    if (status === 'Briefed' || status === 'Scheduled') return '#f59e0b';
    if (status === 'On Vessel') return '#3b82f6';
    return '#ef4444';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Complete') return <CheckCircle size={14} />;
    if (status === 'On Vessel') return <Navigation size={14} />;
    if (status === 'Briefed' || status === 'Scheduled') return <Clock size={14} />;
    return <AlertCircle size={14} />;
  };

  const toggleChecklistItem = (item: string) => {
    setPassageChecklistByVessel(prev => ({
      ...prev,
      [selectedVessel]: {
        ...(prev[selectedVessel] ?? defaultChecklist),
        [item]: !(prev[selectedVessel] ?? defaultChecklist)[item]
      }
    }));
  };

  const calculateUKC = () => {
    const requiredDepth = ukcDraft + ukcSafetyMargin - ukcTide;
    setUkcDepthResult(requiredDepth);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', width: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', width: '100%' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Licensed Pilotage</h4>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>Class A Master</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                Unrestricted tonnage license. Deep draft, tankers, and Azipod cruise ships endorsements active.
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Today's Shifts</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>3 Assigned</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                1 high-priority arrival (GRAND ZEPHYR), 1 standard arrival, 1 container departure.
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Channel Speed Alert</h4>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ef4444' }}>Ebb Current E-1</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                Max ebb current at outer channel 2.2 kt. Maintain transit speeds above 5 knots for rudder control.
              </div>
            </div>

            {/* Upcoming Shift Briefing Card */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Upcoming Shift Briefing</span>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '6px', margin: 0 }}>GRAND ZEPHYR Passage Plan</h3>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Pilot: <strong>Capt. Davies</strong></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>PILOT BOARDING AREA</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>Station Alpha (3 NM Ext)</div>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>MAX SHIFT DRAFT</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>11.2m (Deep Draft)</div>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>TUGS ASSIGNED</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>2 Tugs (Poseidon, Triton)</div>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>TARGET BERTH</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>South T2</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'transparent', color: '#475569', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>Print Passage Plan</button>
                <button onClick={() => setSelectedVessel('GRAND ZEPHYR')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>Begin Briefing &amp; Checklists</button>
              </div>
            </div>

            {/* Pilot Mileage & Shift Log */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><BarChart size={14} /> Monthly Statistics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '4px' }}>
                  <span>Total Shifts Logged</span>
                  <strong>48 Shifts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '4px' }}>
                  <span>Total Transit Mileage</span>
                  <strong>192 Nautical Miles</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '4px' }}>
                  <span>Deep Draft Handled</span>
                  <strong>14 Transits</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Incident-Free Record</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>100% Nominal</span>
                </div>
              </div>
            </div>

            {/* Anchored Vessels Registry */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Vessels at Port Outer Anchorages</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                {anchoredVessels.map((vsl, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px' }}>
                    <div>
                      <strong>{vsl.vesselName}</strong> • LOA: {vsl.loa} • Draft: {vsl.draft}
                      <div style={{ color: '#64748b', fontSize: '9px', marginTop: '2px' }}>{vsl.anchorageArea}</div>
                    </div>
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>{vsl.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety guidelines log */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}><Shield size={14} /> Boarding Regulations</h3>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
                1. Pilot ladder must be rigged on lee side 1.5m above water.<br/>
                2. Lifejacket and safety harness mandatory for transfers.<br/>
                3. Master-Pilot exchange checklist must be signed immediately.<br/>
                4. Handover steering test to manual control at outer channel marker.
              </div>
            </div>

            {/* Port Pilot duty watches roster (Fills the bottom half of Dashboard page!) */}
            <div style={{ gridColumn: 'span 3', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', width: '100%' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={14} color="#2563eb" /> Active Port Pilots Duty Watch Roster</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#64748b' }}>
                    <th style={{ padding: '8px 12px' }}>Pilot Name</th>
                    <th style={{ padding: '8px 12px' }}>Watch Schedule</th>
                    <th style={{ padding: '8px 12px' }}>Duty Status</th>
                    <th style={{ padding: '8px 12px' }}>Assigned Transit Vessel</th>
                  </tr>
                </thead>
                <tbody>
                  {pilotRoster.map((pilot, idx) => (
                    <tr key={pilot.name} style={{ borderBottom: idx < pilotRoster.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700 }}>{pilot.name}</td>
                      <td style={{ padding: '8px 12px' }}>{pilot.watch}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: pilot.status === 'On Duty' ? '#10b981' : pilot.status === 'Standby' ? '#2563eb' : '#64748b' }}>
                        {pilot.status === 'On Duty' ? 'Active On Duty' : pilot.status === 'Standby' ? 'On Standby' : 'Rest Period'}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: pilot.currentVessel === 'None' ? 400 : 600 }}>
                        {pilot.currentVessel === 'None' ? 'None Assigned' : pilot.currentVessel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '16px', width: '100%' }}>
            {/* Left Side: Schedule and Historical Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Assigned Shifts</h3>
              {assignments.map(asn => (
                <div 
                  key={asn.id} 
                  onClick={() => setSelectedVessel(asn.vessel)}
                  style={{ 
                    backgroundColor: selectedVessel === asn.vessel ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.5)', 
                    border: selectedVessel === asn.vessel ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.06)', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{asn.vessel}</h4>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Clearance: <strong>{asn.certification}</strong></div>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: getStatusColor(asn.status), backgroundColor: `${getStatusColor(asn.status)}15`, border: `1px solid ${getStatusColor(asn.status)}25`, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {getStatusIcon(asn.status)}
                      {asn.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', fontSize: '11px', color: '#475569' }}>
                    <div>
                      <div>ETA / ETD</div>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{asn.eta.split(' ')[1]}</div>
                    </div>
                    <div>
                      <div>LOA</div>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{asn.loa}</div>
                    </div>
                    <div>
                      <div>Draft</div>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{asn.draft}</div>
                    </div>
                    <div>
                      <div>Tugs</div>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{asn.tugCount}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Historical Pilotage Records */}
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '16px 0 4px 0' }}><Calendar size={14} /> Historical Passage Logs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pastPilotages.map(pp => (
                  <div key={pp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '11px' }}>
                    <div>
                      <strong>{pp.vessel}</strong> — Berth: {pp.berth}
                      <div style={{ color: '#64748b', fontSize: '9px', marginTop: '2px' }}>LOA: {pp.loa} • Draft: {pp.draft} • Date: {pp.date}</div>
                      <div style={{ color: '#475569', fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>Notes: {pp.notes}</div>
                    </div>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Complete</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column: Passage Checklist & Plan Customizer Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Passage Protocol</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Active Vessel: <strong>{selectedVessel}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.keys(passageChecklist).map((item) => (
                    <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#1e293b', cursor: 'pointer', padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <input 
                        type="checkbox" 
                        checked={passageChecklist[item]} 
                        onChange={() => toggleChecklistItem(item)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ textDecoration: passageChecklist[item] ? 'line-through' : 'none', color: passageChecklist[item] ? '#64748b' : '#1e293b' }}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>

                <button 
                  onClick={() => alert(`Passage checklist for ${selectedVessel} transmitted successfully.`)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                >
                  Send Protocol Update
                </button>
              </div>

              {/* Passage Plan Planner Form */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Transit Plan Customizer</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>BOARDING POINT</label>
                    <input 
                      type="text" 
                      value={planBoardingPt} 
                      onChange={(e) => setPlanBoardingPt(e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', marginTop: '2px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>TRANSIT SPEED LIMIT</label>
                    <input 
                      type="text" 
                      value={planTransitSpeed} 
                      onChange={(e) => setPlanTransitSpeed(e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', marginTop: '2px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>TURNING AREA</label>
                    <input 
                      type="text" 
                      value={planTurningPoint} 
                      onChange={(e) => setPlanTurningPoint(e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', marginTop: '2px' }}
                    />
                  </div>
                  <button 
                    onClick={() => alert(`Customized plan saved.`)}
                    style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer', marginTop: '4px' }}
                  >
                    Save Transit Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Pilotage Operations Center & Ship Safety Monitor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="#2563eb" /> Live Transit Telemetry</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Target: <strong>{selectedVessel}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>VESSEL SPEED (SOG)</span>
                      <span style={{ color: '#10b981' }}>SAFE LIMIT</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{activeTelemetry.speed}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: `${activeTelemetry.speedPercent}%`, height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>UNDER-KEEL METRIC (UKC)</span>
                      <span style={{ color: activeTelemetry.ukcStatus === 'CAUTION' ? '#f59e0b' : '#2563eb' }}>{activeTelemetry.ukcStatus}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{activeTelemetry.ukc}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: `${activeTelemetry.ukcPercent}%`, height: '100%', backgroundColor: activeTelemetry.ukcStatus === 'CAUTION' ? '#f59e0b' : '#2563eb' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>TURNING BASIN STATUS</span>
                      <span style={{ color: '#10b981' }}>CLEAR</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{activeTelemetry.basin}</div>
                  </div>
                </div>
              </div>

              {/* Standard Pilot VHF commands */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>VHF Pilot Signals</h3>
                <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>"Pilot Onboard":</strong> Boarding at Station Alpha completed</div>
                  <div><strong>"Steer Channel 042":</strong> Heading alignment signal sent</div>
                  <div><strong>"Tugs Secure Aft/Bow":</strong> Line assist deployment authorized</div>
                  <div><strong>"First Line Secured":</strong> Mooring operation commenced</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vessel Specifications Tab */}
        {activeTab === 'vessel-data' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Selected Maneuvering Profile</h3>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Active Vessel: <strong>{selectedVessel}</strong></p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>PROPULSION DESIGN</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vesselProfiles[selectedVessel]?.propellerType}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>BOW THRUSTER STATUS</div>
                  <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{vesselProfiles[selectedVessel]?.bowThruster}</div>
                </div>
                {vesselProfiles[selectedVessel]?.sternThruster !== 'None' && (
                  <div>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>STERN THRUSTER STATUS</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vesselProfiles[selectedVessel]?.sternThruster}</div>
                  </div>
                )}
                <div>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>RUDDER SPECIFICATION</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vesselProfiles[selectedVessel]?.rudderAngleLimit}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>MAX AIR DRAFT</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{vesselProfiles[selectedVessel]?.airDraft}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>ANCHORS READINESS</div>
                  <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{vesselProfiles[selectedVessel]?.anchorStatus}</div>
                </div>
              </div>
            </div>

            {/* Hydrodynamic Effects & Safety Warnings */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}><BookOpen size={14} /> Hydrodynamic Navigation Notes</h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Reference constants and safety parameters for transit channel:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', color: '#1e293b' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>Squat Calculation Constant</div>
                  <div style={{ marginTop: '4px' }}>{vesselProfiles[selectedVessel]?.squatConstant}</div>
                  <div style={{ color: '#64748b', fontSize: '9.5px', marginTop: '4px' }}>Estimate squat effect in shallow segments where UKC drops below 1.5m.</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>Turning Basin Radius limit</div>
                  <div style={{ marginTop: '4px' }}>Turning Circle Radius: {vesselProfiles[selectedVessel]?.turningRadius}</div>
                  <div style={{ color: '#64748b', fontSize: '9.5px', marginTop: '4px' }}>Assigned space at Basin B satisfies turning circle without active tug pull assist in calm states.</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'rgba(239,68,68,0.05)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <div style={{ fontWeight: 700, color: '#ef4444' }}>⚠ Hydrodynamic Interaction warning</div>
                  <div style={{ color: '#64748b', fontSize: '9.5px', marginTop: '4px' }}>Maintain a minimum separation distance of 1.5x LOA when overtaking or meeting large container carriers in the outer canal.</div>
                </div>
              </div>
            </div>

            {/* Port Vessel Maneuverability Directory / Comparison Table (Fills bottom half of Vessel Specs page!) */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', width: '100%', marginTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Book size={14} color="#2563eb" /> Port Vessel Maneuverability Directory</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left', color: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#000000' }}>
                    <th style={{ padding: '8px 12px' }}>Vessel Name</th>
                    <th style={{ padding: '8px 12px' }}>Vessel Type</th>
                    <th style={{ padding: '8px 12px' }}>Length (LOA)</th>
                    <th style={{ padding: '8px 12px' }}>Max Draft</th>
                    <th style={{ padding: '8px 12px' }}>Propulsion Type</th>
                    <th style={{ padding: '8px 12px' }}>Bow Thrusters</th>
                    <th style={{ padding: '8px 12px' }}>Turning Radius</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>GRAND ZEPHYR</td>
                    <td style={{ padding: '8px 12px' }}>Ro-Ro Cargo</td>
                    <td style={{ padding: '8px 12px' }}>198 meters</td>
                    <td style={{ padding: '8px 12px' }}>11.2 meters</td>
                    <td style={{ padding: '8px 12px' }}>Single Variable Pitch</td>
                    <td style={{ padding: '8px 12px' }}>1x 1200 kW</td>
                    <td style={{ padding: '8px 12px' }}>320 meters</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>MARITIME STAR</td>
                    <td style={{ padding: '8px 12px' }}>Passenger Cruise</td>
                    <td style={{ padding: '8px 12px' }}>240 meters</td>
                    <td style={{ padding: '8px 12px' }}>8.5 meters</td>
                    <td style={{ padding: '8px 12px' }}>Dual Azipod Propulsion</td>
                    <td style={{ padding: '8px 12px' }}>3x 2000 kW</td>
                    <td style={{ padding: '8px 12px' }}>180 meters</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>CARGO EXPRESS</td>
                    <td style={{ padding: '8px 12px' }}>General Container</td>
                    <td style={{ padding: '8px 12px' }}>150 meters</td>
                    <td style={{ padding: '8px 12px' }}>7.8 meters</td>
                    <td style={{ padding: '8px 12px' }}>Single Fixed Pitch</td>
                    <td style={{ padding: '8px 12px' }}>1x 800 kW</td>
                    <td style={{ padding: '8px 12px' }}>280 meters</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Dynamic Water & Safety Conditions Tab */}
        {activeTab === 'conditions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
            {/* Meteorological Logs & Alerts */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wind size={16} /> Real-Time Weather Logs
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.06)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#d97706', textTransform: 'uppercase' }}>WIND SPEED & VECTOR</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>SW 14 kt (Gusting 18 kt)</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Moderate crosswinds at breakwater entrance. Acknowledge vector angle.</div>
                </div>

                <div style={{ padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.06)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.12)' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>VISIBILITY LIMIT</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>12 Nautical Miles (Excellent)</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Clear daylight visual navigation. No radar assist required for alignment.</div>
                </div>

                <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.06)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.12)' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#047857', textTransform: 'uppercase' }}>SEA STATE</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>Wave height 0.8m (Moderate)</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>No safety impact for pilot boarding at Station Alpha.</div>
                </div>
              </div>
            </div>

            {/* UKC Safety Calculator */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={16} /> Under-Keel Clearance (UKC) Calculator
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#475569' }}>Vessel Draft (m):</span>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={ukcDraft} 
                    onChange={(e) => setUkcDraft(parseFloat(e.target.value) || 0)}
                    style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', textAlign: 'right' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#475569' }}>Tide Level Height (m):</span>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={ukcTide} 
                    onChange={(e) => setUkcTide(parseFloat(e.target.value) || 0)}
                    style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', textAlign: 'right' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#475569' }}>Required Safety Margin (m):</span>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={ukcSafetyMargin} 
                    onChange={(e) => setUkcSafetyMargin(parseFloat(e.target.value) || 0)}
                    style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', textAlign: 'right' }}
                  />
                </div>

                <button 
                  onClick={calculateUKC}
                  style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, marginTop: '8px', cursor: 'pointer' }}
                >
                  Calculate Safety Depth Requirement
                </button>

                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(37,99,235,0.08)', borderRadius: '8px', border: '1.5px dashed #2563eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>MINIMUM DEPTH REQUIRED</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>{ukcDepthResult.toFixed(1)} meters</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>Calculated</span>
                </div>
              </div>
            </div>

            {/* Dynamic Tide Forecast Table */}
            <div style={{ gridColumn: '1 / -1', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', width: '100%' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={14} /> Port Tidal Height Predictions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', fontSize: '11px', width: '100%' }}>
                {tideTable.map((tide, idx) => (
                  <div key={idx} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>TIME {tide.time}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{tide.height}</div>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: tide.flow === 'Flood' ? '#10b981' : tide.flow === 'Slack' ? '#2563eb' : '#f59e0b', marginTop: '6px' }}>{tide.flow} tide</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wave Height & Swell Sensor Feed Table (Fills bottom half of Conditions page!) */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', width: '100%', marginTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><List size={14} color="#2563eb" /> Outer Channel Swell & Wave Height Sensor Feed</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#64748b' }}>
                    <th style={{ padding: '8px 12px' }}>Sensor ID</th>
                    <th style={{ padding: '8px 12px' }}>Station Location</th>
                    <th style={{ padding: '8px 12px' }}>Significant Wave Height</th>
                    <th style={{ padding: '8px 12px' }}>Wave Period (Tz)</th>
                    <th style={{ padding: '8px 12px' }}>Swell Direction</th>
                    <th style={{ padding: '8px 12px' }}>Sensor Status</th>
                  </tr>
                </thead>
                <tbody>
                  {swellSensors.map((sensor, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < swellSensors.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700 }}>{sensor.sensorId}</td>
                      <td style={{ padding: '8px 12px' }}>{sensor.location}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{sensor.waveHeight}</td>
                      <td style={{ padding: '8px 12px' }}>{sensor.wavePeriod}</td>
                      <td style={{ padding: '8px 12px' }}>{sensor.direction}</td>
                      <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 600 }}>{sensor.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
