export interface DockDetail {
  id: string;
  label: string;
  name: string;
  pier: string;
  lat: number;
  lng: number;
  length: number;
  width: number;
  angle: number;
  status: 'Occupied' | 'Vacant' | 'Reserved';
  vessel?: string;
  vesselType?: string;
  maxLoa: string;
  depth: string;
  nextArrival?: string;
}

export const docks: DockDetail[] = [
  {
    id: 'S',
    label: 'S',
    name: 'Moll de Barcelona Pier - Terminal S',
    pier: 'Moll de Barcelona',
    lat: 41.3712,
    lng: 2.1826,
    length: 0.0008,
    width: 0.00025,
    angle: 34,
    status: 'Occupied',
    vessel: 'COSTA FORTUNA',
    vesselType: 'Cruise Ship',
    maxLoa: '250m',
    depth: '9.5m',
    nextArrival: 'Today, 12:38'
  },
  {
    id: 'A',
    label: 'A',
    name: 'Moll de Barcelona - West Quay',
    pier: 'Moll de Barcelona (West)',
    lat: 41.3649,
    lng: 2.1774,
    length: 0.0008,
    width: 0.00022,
    angle: 115,
    status: 'Occupied',
    vessel: 'MSC BARCELONA',
    vesselType: 'Container Ship',
    maxLoa: '320m',
    depth: '12.0m',
    nextArrival: 'Today, 11:56'
  },
  {
    id: 'B',
    label: 'B',
    name: 'Moll de Ponent - Passenger Berth',
    pier: 'Moll de Ponent',
    lat: 41.3629,
    lng: 2.1741,
    length: 0.0008,
    width: 0.00022,
    angle: 31,
    status: 'Vacant',
    maxLoa: '300m',
    depth: '12.0m',
    nextArrival: 'Tomorrow, 06:00'
  },
  {
    id: 'C',
    label: 'C',
    name: 'Moll de Costa - Terminal C',
    pier: 'Moll de Costa',
    lat: 41.35544,
    lng: 2.17218,
    length: 0.0009,
    width: 0.00035,
    angle: 31,
    status: 'Occupied',
    vessel: 'ATLANTIC HORIZON',
    vesselType: 'Bulk Carrier',
    maxLoa: '290m',
    depth: '12.5m',
    nextArrival: 'Today, 10:44'
  },
  {
    id: 'D',
    label: 'D',
    name: 'Moll de Contradic - Portcemen',
    pier: 'Moll de Contradic',
    lat: 41.35024,
    lng: 2.16879,
    length: 0.0009,
    width: 0.00035,
    angle: 31,
    status: 'Vacant',
    maxLoa: '350m',
    depth: '14.0m',
    nextArrival: 'Today, 16:30'
  },
  {
    id: 'E',
    label: 'E',
    name: 'Moll Adossat Pier - Terminal E',
    pier: 'Moll Adossat',
    lat: 41.35927,
    lng: 2.17580,
    length: 0.0009,
    width: 0.00035,
    angle: 28,
    status: 'Reserved',
    vessel: 'GRAND ZEPHYR',
    vesselType: 'Ro-Ro Vessel',
    maxLoa: '260m',
    depth: '11.5m',
    nextArrival: 'Today, 14:56'
  },
  {
    id: 'H',
    label: 'H',
    name: 'Moll Adossat Pier - Terminal H',
    pier: 'Moll Adossat (MSC Cruises)',
    lat: 41.3475,
    lng: 2.1704,
    length: 0.0009,
    width: 0.00035,
    angle: 56.5,
    status: 'Occupied',
    vessel: 'EVER ONWARDS',
    vesselType: 'Container Ship',
    maxLoa: '366m',
    depth: '16.0m',
    nextArrival: 'Today, 18:26'
  }
];

export interface VesselChecklistStep {
  label: string;
  done: boolean;
  num?: number;
}

export interface VesselListItem {
  flag: string;
  status: string;
  statusLabel: string;
  name: string;
  type: string;
  image: string;
  loa: string;
  draft: string;
  gt: string;
  eta: string;
  cargo: string;
  berth: string;
  risk: number;
  riskLevel: string;
  tugs: number;
  operator: string;
  checklist: VesselChecklistStep[];
}

const getCurrentEtaString = (offsetDays = 0, hour?: number, min?: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (hour !== undefined) d.setHours(hour);
  if (min !== undefined) d.setMinutes(min);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${hh}:${mm}`;
};

export const listVessels: VesselListItem[] = [
  {
    flag: '🇵🇦',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'MSC BARCELONA',
    type: 'Container Ship · Panama · IMO 9705217',
    image: '/ships/ship_1.png',
    loa: '366m',
    draft: '14.2m',
    gt: '153K',
    eta: getCurrentEtaString(0),
    cargo: 'Containers',
    berth: 'BEST-T1-B4',
    risk: 35,
    riskLevel: 'MEDIUM RISK',
    tugs: 4,
    operator: 'Maritima Barcelonesa',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Pilot', done: false, num: 2 },
      { label: 'Tug', done: false, num: 3 },
      { label: 'Berthing', done: false, num: 4 },
      { label: 'Customs', done: false, num: 5 },
      { label: 'Cargo', done: false, num: 6 },
      { label: 'Departure', done: false, num: 7 }
    ]
  },
  {
    flag: '🇮🇹',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'COSTA FORTUNA',
    type: 'Container Cargo Ship · Italy · IMO 9239783',
    image: '/ships/ship_2.png',
    loa: '272m',
    draft: '8.2m',
    gt: '103K',
    eta: '09 Jul 08:00',
    cargo: 'Containers',
    berth: 'TERMINAL-C-P1',
    risk: 22,
    riskLevel: 'LOW RISK',
    tugs: 2,
    operator: 'Costa Crociere',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Pilot', done: false, num: 2 },
      { label: 'Berthing', done: false, num: 3 },
      { label: 'Passenger', done: false, num: 4 },
      { label: 'Provisioning', done: false, num: 5 },
      { label: 'Departure', done: false, num: 6 }
    ]
  },
  {
    flag: '🇲🇭',
    status: 'BERT',
    statusLabel: 'Berthing',
    name: 'ATLANTIC HORIZON',
    type: 'Bulk Carrier · Marshall Islands · IMO 9456123',
    image: '/ships/ship_3.png',
    loa: '225m',
    draft: '13.5m',
    gt: '44K',
    eta: '08 Jul 15:00',
    cargo: 'Iron Ore',
    berth: 'NORTH-DOCK-B8',
    risk: 58,
    riskLevel: 'HIGH RISK',
    tugs: 3,
    operator: 'Transmediterranea',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Pilot', done: true },
      { label: 'Berthing', done: false, num: 3 },
      { label: 'Mooring', done: false, num: 4 },
      { label: 'Cargo', done: false, num: 5 }
    ]
  },
  {
    flag: '🇲🇹',
    status: 'ANCH',
    statusLabel: 'Anchored',
    name: 'GRAND ZEPHYR',
    type: 'Ro-Ro Vessel · Malta · IMO 9812345',
    image: '/ships/ship_4.png',
    loa: '198m',
    draft: '6.8m',
    gt: '31K',
    eta: '08 Jul 19:12',
    cargo: 'Vehicles & Trucks',
    berth: 'RO-RO-T2',
    risk: 44,
    riskLevel: 'MEDIUM RISK',
    tugs: 1,
    operator: 'Grimaldi Lines',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Waiting', done: false, num: 2 },
      { label: 'Berthing', done: false, num: 3 },
      { label: 'Cargo', done: false, num: 4 }
    ]
  },
  {
    flag: '🇪🇸',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'TANKER IBERIA',
    type: 'Chemical Tanker · Spain · IMO 9234567',
    image: '/ships/ship_6.png',
    loa: '183m',
    draft: '11.2m',
    gt: '28K',
    eta: '08 Jul 20:42',
    cargo: 'Chemical Products',
    berth: 'LIQUID-T3-B2',
    risk: 72,
    riskLevel: 'HIGH RISK',
    tugs: 2,
    operator: 'Boluda Corporación',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'ISPS', done: false, num: 2 },
      { label: 'Hazmat', done: false, num: 3 },
      { label: 'Berthing', done: false, num: 4 }
    ]
  },
  {
    flag: '🇱🇷',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'EVER ONWARDS',
    type: 'Container Ship · Liberia · IMO 9890123',
    image: '/ships/ship_1.png',
    loa: '399m',
    draft: '15.8m',
    gt: '215K',
    eta: '08 Jul 22:42',
    cargo: 'Containers',
    berth: 'BEST-T2-B1',
    risk: 82,
    riskLevel: 'CRITICAL RISK',
    tugs: 6,
    operator: 'Evergreen Marine',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Deep', done: false, num: 2 },
      { label: 'Special', done: false, num: 3 },
      { label: 'Berthing', done: false, num: 4 }
    ]
  },
  {
    flag: '🇳🇴',
    status: 'BERT',
    statusLabel: 'Berthed',
    name: 'NORDIC SUPPLY',
    type: 'General Cargo · Norway · IMO 9345678',
    image: '/ships/ship_3.png',
    loa: '142m',
    draft: '7.4m',
    gt: '9K',
    eta: '08 Jul 12:42',
    cargo: 'General Cargo',
    berth: 'SOUTH-CARGO-B3',
    risk: 15,
    riskLevel: 'LOW RISK',
    tugs: 0,
    operator: 'Nordisk Shipping',
    checklist: [
      { label: 'AIS', done: true }
    ]
  }
];

export const getRotatedCoords = (
  centerLat: number,
  centerLng: number,
  length: number,
  width: number,
  angleDeg: number
): [number, number][] => {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const hl = (length * 2.5) / 2;
  const hw = (width * 2.5) / 2;

  const corners = [
    [-hl, -hw],
    [hl, -hw],
    [hl, hw],
    [-hl, hw]
  ];

  return corners.map(([x, y]) => {
    const rotLat = x * cos - (y * sin * 0.75);
    const rotLng = (x * sin) / 0.75 + y * cos;
    return [centerLat + rotLat, centerLng + rotLng] as [number, number];
  });
};

export interface ShipData {
  name: string;
  image: string;
  flag: string;
  status: string;
  type: string;
  loa: string;
  draft: string;
  gt: string;
  eta: string;
  cargo: string;
  berth: string;
  risk: number;
  tugs: number;
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
  operator: string;
  lat: number;
  lng: number;
  routeColor: string;
}

export const shipsData: ShipData[] = [
  {
    name: 'GRAND ZEPHYR',
    image: '/ships/ship_3.png',
    flag: '🇲🇹',
    status: 'ANCH',
    type: 'Ro-Ro Vessel · Malta · IMO 9482933',
    loa: '200m',
    draft: '9.2m',
    gt: '56K',
    eta: '08 Jul 14:56',
    cargo: 'Vehicles & Trucks',
    berth: 'RO-RO-T2',
    risk: 44,
    tugs: 2,
    riskLevel: 'MEDIUM RISK',
    operator: 'Grimaldi Lines Agency',
    lat: 41.335,
    lng: 2.205,
    routeColor: '#fbbf24'
  },
  {
    name: 'MSC BARCELONA',
    image: '/ships/ship_1.png',
    flag: '🇵🇦',
    status: 'APPR',
    type: 'Container Ship · Panama · IMO 9705217',
    loa: '366m',
    draft: '14.2m',
    gt: '153K',
    eta: '08 Jul 16:12',
    cargo: 'Containers',
    berth: 'BEST-T1-B4',
    risk: 35,
    tugs: 4,
    riskLevel: 'MEDIUM RISK',
    operator: 'Maritima Barcelonesa',
    lat: 41.365,
    lng: 2.225,
    routeColor: '#10b981'
  },
  {
    name: 'COSTA FORTUNA',
    image: '/ships/ship_1.png',
    flag: '🇮🇹',
    status: 'APPR',
    type: 'Container Cargo Ship · Italy · IMO 9239783',
    loa: '272m',
    draft: '8.3m',
    gt: '102K',
    eta: '08 Jul 16:54',
    cargo: 'Containers',
    berth: 'TERMINAL-C-P1',
    risk: 22,
    tugs: 2,
    riskLevel: 'LOW RISK',
    operator: 'Costa Crociere',
    lat: 41.360,
    lng: 2.195,
    routeColor: '#3b82f6'
  },
  {
    name: 'ATLANTIC HORIZON',
    image: '/ships/ship_3.png',
    flag: '🇲🇭',
    status: 'BERTH',
    type: 'Bulk Carrier · Marshall Is. · IMO 9482933',
    loa: '225m',
    draft: '12.5m',
    gt: '43K',
    eta: '08 Jul 10:44',
    cargo: 'Iron Ore',
    berth: 'NORTH-DOCK-B8',
    risk: 58,
    tugs: 3,
    riskLevel: 'HIGH RISK',
    operator: 'Horizon Shipping',
    lat: 41.345,
    lng: 2.195,
    routeColor: '#4ade80'
  },
  {
    name: 'OCEAN EXPLORER',
    image: '/ships/ship_1.png',
    flag: '🇩🇪',
    status: 'APPR',
    type: 'LNG Tanker · Germany · IMO 9810456',
    loa: '299m',
    draft: '11.8m',
    gt: '110K',
    eta: '09 Jul 04:15',
    cargo: 'Gas',
    berth: 'BEST-T2-B1',
    risk: 18,
    tugs: 2,
    riskLevel: 'LOW RISK',
    operator: 'Hamburg Marine',
    lat: 41.385,
    lng: 2.215,
    routeColor: '#fbbf24'
  },
  {
    name: 'SEA BREEZE',
    image: '/ships/ship_2.png',
    flag: '🇬🇧',
    status: 'APPR',
    type: 'General Cargo · UK · IMO 9301245',
    loa: '180m',
    draft: '7.8m',
    gt: '28K',
    eta: '09 Jul 08:30',
    cargo: 'Grain',
    berth: 'SOUTH-DOCK-B1',
    risk: 42,
    tugs: 2,
    riskLevel: 'MEDIUM RISK',
    operator: 'Atlantic Chartering',
    lat: 41.315,
    lng: 2.235,
    routeColor: '#ef4444'
  }
];
