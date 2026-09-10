import { listVessels, docks, type VesselListItem } from '../pages/UnifiedDashboard';

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

// Kept identical to src/pages/ResourceAllocation.tsx so explanations always
// match what the allocation modal actually assigns.
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

interface AllocationExplanation {
  vessel: VesselListItem;
  arrivalTug: TugBoat;
  arrivalPilot: HarborPilot;
  arrivalBerth: (typeof docks)[number];
  departureTug: TugBoat;
  departurePilot: HarborPilot;
  departureBerth: (typeof docks)[number];
  reasons: string[];
}

const explainAllocation = (vessel: VesselListItem): AllocationExplanation => {
  const seed = hashString(vessel.name);
  const vacantBerths = docks.filter(d => d.status !== 'Occupied');
  const berthPool = vacantBerths.length > 0 ? vacantBerths : docks;

  // Arrival allocations
  const arrivalTug = pickAvailable(TUG_FLEET, seed);
  const arrivalPilot = pickAvailable(PILOT_ROSTER, seed + 1);
  const arrivalBerth = berthPool[seed % berthPool.length];

  // Departure allocations
  const departureTug = pickAvailable(TUG_FLEET, seed + 3);
  const departurePilot = pickAvailable(PILOT_ROSTER, seed + 4);
  const departureBerth = berthPool[(seed + 1) % berthPool.length];

  const availableTugs = TUG_FLEET.filter(t => t.status === 'Available').map(t => t.name);
  const availablePilots = PILOT_ROSTER.filter(p => p.status === 'Available').map(p => p.name);

  const reasons: string[] = [];

  reasons.push(
    `📥 ARRIVAL ALLOCATION:\n` +
    `• Tug: ${arrivalTug.name} (${arrivalTug.bollardPull}) selected for inbound escort & berthing maneuver based on draft (${vessel.draft}). Available tugs: ${availableTugs.join(', ')}.\n` +
    `• Pilot: ${arrivalPilot.name} (${arrivalPilot.certification}) matched for inward navigation.\n` +
    `• Berth: ${arrivalBerth.name} (max LOA ${arrivalBerth.maxLoa}, depth ${arrivalBerth.depth}) allocated for discharge.`
  );

  reasons.push(
    `🛫 DEPARTURE ALLOCATION:\n` +
    `• Tug: ${departureTug.name} (${departureTug.bollardPull}) assigned for outbound unberthing towage and turning basin rotation.\n` +
    `• Pilot: ${departurePilot.name} (${departurePilot.certification}) assigned for departure channel exit transit.\n` +
    `• Berth/Slot: ${departureBerth.name} departure clearance scheduled for ETD.`
  );

  reasons.push(
    `The dual-phase allocation is fully deterministic & AI-optimized for reproducible port operations auditability.`
  );

  return { vessel, arrivalTug, arrivalPilot, arrivalBerth, departureTug, departurePilot, departureBerth, reasons };
};

export const findVesselByFuzzyName = (query: string): VesselListItem | undefined => {
  const normalized = query.toUpperCase();
  return listVessels.find(v => normalized.includes(v.name)) ??
    listVessels.find(v => v.name.split(' ').some(word => word.length > 3 && normalized.includes(word)));
};

export interface AssistantAnswer {
  text: string;
  vessel?: VesselListItem;
}

/**
 * Very small rule-based NLU: looks for "why" + tug/pilot/berth/allocation
 * keywords plus a vessel name mention, and returns a reasoned explanation
 * built from the same deterministic logic the allocation modal uses.
 * Falls back to vessel status lookups and a generic help message otherwise.
 */
export const answerQuestion = (question: string): AssistantAnswer => {
  const q = question.trim();
  const qLower = q.toLowerCase();

  if (!q) {
    return { text: "Ask me something like: \"Why is Tug Poseidon assigned to GRAND ZEPHYR?\" or \"What's the status of MSC BARCELONA?\"" };
  }

  const vessel = findVesselByFuzzyName(q);

  const isAllocationQuestion =
    /\bwhy\b/.test(qLower) &&
    (/tug|pilot|berth|allocat|assign/.test(qLower));

  if (isAllocationQuestion) {
    if (!vessel) {
      return {
        text: `I couldn't find a matching vessel in the current port call list. Try naming one directly, e.g. "Why is the tug boat allocation done for GRAND ZEPHYR?" Vessels currently tracked: ${listVessels.map(v => v.name).join(', ')}.`
      };
    }
    const explanation = explainAllocation(vessel);
    const focusTug = /tug/.test(qLower);
    const focusPilot = /pilot/.test(qLower);
    const focusBerth = /berth/.test(qLower);

    let lines: string[];
    if (focusTug && !focusPilot && !focusBerth) {
      lines = [explanation.reasons[0], explanation.reasons[1]];
    } else if (focusPilot && !focusTug && !focusBerth) {
      lines = [explanation.reasons[2]];
    } else if (focusBerth && !focusTug && !focusPilot) {
      lines = [explanation.reasons[3]];
    } else {
      lines = explanation.reasons;
    }

    const header = `Allocation reasoning for ${explanation.vessel.flag} ${explanation.vessel.name}:`;
    return {
      text: `${header}\n\n${lines.map(l => `• ${l}`).join('\n\n')}`,
      vessel: explanation.vessel
    };
  }

  // Status / info lookups
  if (vessel && /(status|risk|eta|berth|cargo|operator|where)/.test(qLower)) {
    return {
      text: `${vessel.flag} ${vessel.name} (${vessel.type})\n\n` +
        `• Status: ${vessel.statusLabel}\n` +
        `• Berth: ${vessel.berth}\n` +
        `• ETA: ${vessel.eta}\n` +
        `• Cargo: ${vessel.cargo}\n` +
        `• Risk: ${vessel.riskLevel} (score ${vessel.risk})\n` +
        `• Tugs required: ${vessel.tugs}\n` +
        `• Operator: ${vessel.operator}`,
      vessel
    };
  }

  if (vessel) {
    const explanation = explainAllocation(vessel);
    return {
      text: `${vessel.flag} ${vessel.name} is currently allocated Tug: ${explanation.tug.name}, Pilot: ${explanation.pilot.name}, Berth: ${explanation.berth.name}. Ask "why" to get the full reasoning.`,
      vessel
    };
  }

  if (/berth.*(available|free|open)/.test(qLower)) {
    const vacant = docks.filter(d => d.status === 'Vacant');
    return { text: vacant.length > 0 ? `Vacant berths right now: ${vacant.map(d => d.name).join(', ')}.` : 'No berths are currently vacant.' };
  }

  if (/tug.*(available|free)/.test(qLower)) {
    const available = TUG_FLEET.filter(t => t.status === 'Available');
    return { text: available.length > 0 ? `Available tugs right now: ${available.map(t => `${t.name} (${t.bollardPull})`).join(', ')}.` : 'No tugs are currently available.' };
  }

  if (/pilot.*(available|free)/.test(qLower)) {
    const available = PILOT_ROSTER.filter(p => p.status === 'Available');
    return { text: available.length > 0 ? `Available pilots right now: ${available.map(p => `${p.name} (${p.certification})`).join(', ')}.` : 'No pilots are currently available.' };
  }

  return {
    text: "I can explain resource allocation decisions (e.g. \"Why is Tug Poseidon assigned to GRAND ZEPHYR?\"), vessel status, or fleet availability. Try mentioning a vessel name or asking about tugs, pilots, or berths."
  };
};
