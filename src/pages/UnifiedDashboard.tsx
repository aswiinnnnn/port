import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import L from 'leaflet';
import { Anchor, Clock, Ship, Info, MessageSquare } from 'lucide-react';
import { Communications } from './Communications';

interface DockDetail {
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
    eta: '08 Jul 16:12',
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
    type: 'Cruise Ship · Italy · IMO 9239783',
    image: '/ships/ship_2.png',
    loa: '272m',
    draft: '8.2m',
    gt: '103K',
    eta: '08 Jul 16:54',
    cargo: 'Passengers',
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

const getRotatedCoords = (
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

interface ShipData {
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

const shipsData: ShipData[] = [
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
    routeColor: '#5be2c8'
  },
  {
    name: 'COSTA FORTUNA',
    image: '/ships/ship_2.png',
    flag: '🇮🇹',
    status: 'APPR',
    type: 'Cruise Ship · Italy · IMO 9239783',
    loa: '272m',
    draft: '8.3m',
    gt: '102K',
    eta: '08 Jul 12:38',
    cargo: 'Passengers',
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
    image: '/ships/ship_1.png', // Reusing ship silhouettes
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
    riskLevel: 'MEDIUM RISK',
    operator: 'Atlantic Chartering',
    lat: 41.315,
    lng: 2.235,
    routeColor: '#ef4444'
  }
];

export interface UnifiedDashboardProps {
  viewMode?: string;
  onPageChange?: (pageId: any) => void;
  selectedMessageId?: string | null;
  onSelectMessageId?: (id: string | null) => void;
  onSelectVesselForAllocation?: (vesselName: string) => void;
}

const VesselArrivalsChart: React.FC = () => {
  return (
    <div className="glass-dark-panel" style={{ padding: '16px 20px', borderRadius: '14px', flex: 1, minWidth: '260px', border: '1px solid rgba(255,255,255,0.15)', background: 'var(--card-gradient-1)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px' }}>
        DAILY VESSEL ARRIVALS
      </div>
      
      <div className="dashboard-chart-box" style={{ display: 'flex', gap: '12px', height: '195px', position: 'relative' }}>
        {/* Y Axis Labels */}
        <div className="dashboard-chart-y" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', height: '150px', textAlign: 'right', width: '18px' }}>
          <span>16</span>
          <span>12</span>
          <span>8</span>
          <span>4</span>
          <span>0</span>
        </div>

        {/* Chart Canvas */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <svg className="dashboard-chart-svg" viewBox="0 0 500 125" preserveAspectRatio="none" style={{ width: '100%', height: '150px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="31" x2="500" y2="31" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="62" x2="500" y2="62" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="93" x2="500" y2="93" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="125" x2="500" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Areas */}
            <path 
              className="animate-area"
              d="M 0,55 C 125,72 125,72 250,45 C 375,50 375,50 500,80 L 500,125 L 0,125 Z" 
              fill="url(#greenGrad)" 
            />
            <path 
              className="animate-area"
              d="M 0,38 C 125,58 125,58 250,25 C 375,35 375,35 500,62 L 500,125 L 0,125 Z" 
              fill="url(#cyanGrad)" 
            />

            {/* Lines */}
            <path 
              className="animate-path"
              d="M 0,55 C 125,72 125,72 250,45 C 375,50 375,50 500,80" 
              fill="none" 
              stroke="var(--accent-green)" 
              strokeWidth="2.5" 
            />
            <path 
              className="animate-path"
              d="M 0,38 C 125,58 125,58 250,25 C 375,35 375,35 500,62" 
              fill="none" 
              stroke="var(--accent-cyan)" 
              strokeWidth="2.5" 
            />
          </svg>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>01 Jul</span>
            <span>02 Jul</span>
            <span>03 Jul</span>
            <span>04 Jul</span>
            <span>05 Jul</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TurnaroundTimeChart: React.FC = () => {
  return (
    <div className="glass-dark-panel" style={{ padding: '16px 20px', borderRadius: '14px', flex: 1, minWidth: '260px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'var(--card-gradient-1)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px' }}>
        AVG TURNAROUND TIME (HOURS)
      </div>
      
      <div className="dashboard-chart-box" style={{ display: 'flex', gap: '12px', height: '195px', position: 'relative' }}>
        {/* Y Axis Labels */}
        <div className="dashboard-chart-y" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', height: '150px', textAlign: 'right', width: '18px' }}>
          <span>18</span>
          <span>16</span>
          <span>14</span>
          <span>12</span>
        </div>

        {/* Chart Canvas */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <svg className="dashboard-chart-svg" viewBox="0 0 500 125" preserveAspectRatio="none" style={{ width: '100%', height: '150px', overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="41" x2="500" y2="41" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="83" x2="500" y2="83" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="125" x2="500" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Line Curve */}
            <path 
              className="animate-path"
              d="M 0,38 C 125,45 125,45 250,65 C 375,62 375,62 500,78" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2.5" 
            />

            {/* Dots */}
            <circle cx="0" cy="38" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0 }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="125" cy="45" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '0.4s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="250" cy="65" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '0.8s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="375" cy="62" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '1.2s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="500" cy="78" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '1.6s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
          </svg>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>01 Jul</span>
            <span>02 Jul</span>
            <span>03 Jul</span>
            <span>04 Jul</span>
            <span>05 Jul</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  viewMode = 'live-map',
  onPageChange,
  selectedMessageId,
  onSelectMessageId,
  onSelectVesselForAllocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const [selectedDock, setSelectedDock] = useState<DockDetail | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'harbor' | 'vector'>('harbor');
  if (false as boolean) setMapViewMode('harbor');
  const [selectedShipName, setSelectedShipName] = useState<string | null>(null);
  const [vesselSearch, setVesselSearch] = useState('');
  const [vesselFilter, setVesselFilter] = useState('All Vessels');

  const getBerthColor = (status: string, isSelected: boolean) => {
    if (isSelected) return '#3b82f6'; // Selected highlights blue
    if (status === 'Occupied') return '#ef4444'; // Red
    if (status === 'Reserved') return '#fbbf24'; // Yellow
    return '#4ade80'; // Green
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map centered on Barcelona port
    const map = L.map(mapContainerRef.current, {
      center: [41.3468, 2.21347],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    // Standard OpenStreetMap Tile Layer (with natural blue sea colors)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      opacity: 0.85
    }).addTo(map);

    // Fix Leaflet sizing bug on initial display
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Add 2 Nautical Miles boundary circle (3704 meters radius)
    L.circle([41.360, 2.176], {
      radius: 3704,
      color: '#3b82f6',
      weight: 1.5,
      dashArray: '6, 8',
      fillColor: '#3b82f6',
      fillOpacity: 0.02,
      interactive: false
    }).addTo(map);

    // Draw rotated polygon berths
    docks.forEach((dock) => {
      const isSelected = selectedDock?.id === dock.id;
      const rectColor = getBerthColor(dock.status, isSelected);
      const coords = getRotatedCoords(dock.lat, dock.lng, dock.length, dock.width, dock.angle);

      const polygon = L.polygon(coords, {
        color: rectColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: rectColor,
        fillOpacity: isSelected ? 0.4 : 0.2,
      }).addTo(map);

      const tooltipContent = `
        <div style="font-family: var(--font-sans, system-ui); padding: 4px; line-height: 1.4;">
          <strong style="display: block; margin-bottom: 4px; font-size: 14px;">${dock.name}</strong>
          <div style="font-size: 12px;">
            <div><strong>Status:</strong> ${dock.status}</div>
            ${dock.vessel ? `<div><strong>Vessel:</strong> ${dock.vessel} (${dock.vesselType})</div>` : ''}
            <div><strong>Max LOA:</strong> ${dock.maxLoa}</div>
            <div><strong>Depth:</strong> ${dock.depth}</div>
          </div>
        </div>
      `;
      polygon.bindTooltip(tooltipContent, {
        direction: 'top',
        className: 'dock-hover-tooltip',
        opacity: 0.95
      });

      polygon.on('click', () => {
        setSelectedDock(dock);
        setHasUserSelected(true);
      });

      polygonsRef.current.set(dock.id, polygon);
    });



    // Ship Icon SVG Silhouette (Standard Lucide Ship symbol from react-dom)
    const shipIconSvg = renderToString(<Ship size={16} color="white" />);

    shipsData.forEach((ship) => {
      const isStarred = ship.name === 'MSC BARCELONA';
      const labelBg = isStarred ? '#ffffff' : '#2563eb';
      const labelColor = isStarred ? '#0f172a' : '#ffffff';
      
      const html = `
        <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px; cursor: pointer;">
          ${isStarred ? `
            <div style="
              position: absolute;
              top: -4px;
              left: -4px;
              width: 40px;
              height: 40px;
              border: 1.5px solid #fbbf24;
              border-radius: 50%;
              opacity: 0.85;
            "></div>
          ` : ''}
          
          <!-- Circular Blue Ship Marker -->
          <div style="
            width: 32px;
            height: 32px;
            background-color: #2563eb;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${shipIconSvg}
          </div>

          ${isStarred ? `
            <div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 14px;
              height: 14px;
              background-color: #fbbf24;
              border: 1.5px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            ">
              <span style="font-size: 8px; color: white;">★</span>
            </div>
          ` : ''}

          <div style="
            position: absolute;
            top: 38px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            background-color: ${labelBg};
            color: ${labelColor};
            font-family: var(--font-sans);
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            border: 1px solid rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 2px;
          ">
            ${ship.name} ${isStarred ? '<span style="color: #fbbf24;">★</span>' : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([ship.lat, ship.lng], { icon: customIcon }).addTo(map);

      // On marker click: select ship and scroll to its card card element
      marker.on('click', () => {
        setSelectedShipName(ship.name);
        const cardId = `ship-card-${ship.name.replace(/\s+/g, '-').toLowerCase()}`;
        const cardIdAnalytics = `ship-card-analytics-${ship.name.replace(/\s+/g, '-').toLowerCase()}`;
        const cardElement = document.getElementById(cardId) || document.getElementById(cardIdAnalytics);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update styles when selection changes
  useEffect(() => {
    if (!mapRef.current) return;

    docks.forEach((dock) => {
      const polygon = polygonsRef.current.get(dock.id);
      if (polygon) {
        const isSelected = selectedDock?.id === dock.id;
        const rectColor = getBerthColor(dock.status, isSelected);

        polygon.setStyle({
          color: rectColor,
          weight: isSelected ? 3.5 : 2,
          fillColor: rectColor,
          fillOpacity: isSelected ? 0.4 : 0.2,
        });
      }
    });

    if (selectedDock && hasUserSelected) {
      const coords = getRotatedCoords(selectedDock.lat, selectedDock.lng, selectedDock.length, selectedDock.width, selectedDock.angle);
      mapRef.current.fitBounds(L.latLngBounds(coords), {
        padding: [50, 50],
        maxZoom: 16,
        animate: true
      });
    }
  }, [selectedDock, hasUserSelected]);

  // RENDER VIEW: dashboard
  if (viewMode === 'dashboard') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '24px', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
        {/* 4 Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(91, 226, 200, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ship size={20} color="var(--accent-cyan)" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                &uarr; +2 vs yesterday
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>7</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>Vessels Today</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>3 pending arrival</div>
          </div>
          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Anchor size={20} color="var(--accent-blue)" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                &uarr; +8%
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>71%</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>Berth Utilization</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>5 of 7 berths active</div>
          </div>
          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(251, 191, 36, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="var(--accent-amber)" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                &uarr; +3%
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>87%</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>On-Time Rate</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Avg turnaround: 14.2h</div>
          </div>
          {/* Card 4 */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(74, 222, 128, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px' }}>🌿</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                &uarr; +1.2T
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>18.4T</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>CO₂ Saved Today</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>6.2T fuel via JIT</div>
          </div>
        </div>

        {/* 2 Lists side-by-side */}
        <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '400px', paddingBottom: '24px' }}>
          {/* Live Vessel Status */}
          <div className="glass-panel" style={{ flex: 2.2, borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'white' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>🚢</span> LIVE VESSEL STATUS
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>View all &rarr;</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              {[
                { label: 'PA', name: 'MSC BARCELONA', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Container Ship · Containers · BEST-T1-B4', eta: 'ETA 11:56', risk: '35', riskColor: '#f59e0b' },
                { label: 'IT', name: 'COSTA FORTUNA', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Cruise Ship · Passengers · TERMINAL-C-P1', eta: 'ETA 12:38', risk: '22', riskColor: '#10b981' },
                { label: 'MH', name: 'ATLANTIC HORIZON', status: 'BERTHING', statusColor: '#3b82f6', statusBg: 'rgba(59,130,246,0.1)', desc: 'Bulk Carrier · Iron Ore · NORTH-DOCK-B8', eta: 'ETA 10:44', risk: '58', riskColor: '#f59e0b' },
                { label: 'MT', name: 'GRAND ZEPHYR', status: 'ANCHORED', statusColor: '#fbbf24', statusBg: 'rgba(251,191,36,0.1)', desc: 'Ro-Ro Vessel · Vehicles & Trucks · RO-RO-T2', eta: 'ETA 14:56', risk: '44', riskColor: '#f59e0b' },
                { label: 'ES', name: 'TANKER IBERIA', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Chemical Tanker · Chemical Products · LIQUID-T3-B2', eta: 'ETA 16:26', risk: '72', riskColor: '#ef4444' },
                { label: 'LR', name: 'EVER ONWARDS', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Container Ship · Containers · BEST-T2-B1', eta: 'ETA 18:26', risk: '82', riskColor: '#ef4444' },
                { label: 'NO', name: 'NORDIC SUPPLY', status: 'BERTHED', statusColor: '#10b981', statusBg: 'rgba(16,185,129,0.1)', desc: 'Supply Vessel · General Cargo · SOUTH-CARGO-S2', eta: 'ETA 08:26', risk: '15', riskColor: '#10b981' }
              ].map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {v.label}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>{v.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: v.statusColor, backgroundColor: v.statusBg, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${v.statusColor}33` }}>{v.status}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{v.desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{v.eta}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Risk: <span style={{ color: v.riskColor, fontWeight: 700 }}>{v.risk}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Activity */}
          <div className="glass-panel" style={{ flex: 1, borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'white' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>🤖</span> AI AGENT ACTIVITY
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>Console &rarr;</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              {[
                { name: 'Port Call Coordinator', value: '94%', time: '2 min ago', desc: 'Generating arrival workflow for MSC BARCELONA (ETA T+90m...' },
                { name: 'Multilingual Comms Agent', value: '91%', time: '45 sec ago', desc: 'Translating Arabic radio message from TANKER IBERIA crew' },
                { name: 'Risk Prediction Agent', value: '87%', time: '8 sec ago', desc: 'CRITICAL: EVER ONWARDS deep draft + tidal window conflict...' },
                { name: 'Optimization Agent', value: '89%', time: '1 min ago', desc: 'Solving tug allocation puzzle: 3 vessels arriving within 2-hour ...' },
                { name: 'Compliance Agent', value: '98%', time: '3 min ago', desc: 'ISPS check for TANKER IBERIA — chemical cargo declaration' },
                { name: 'Digital Twin Agent', value: '99%', time: '2 sec ago', desc: 'Synchronizing AIS feed — updating positions for 7 vessels' },
                { name: 'Incident Response Agent', value: '96%', time: '18 min ago', desc: 'Monitoring...' }
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'white' }}>{a.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{a.value}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{a.desc}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER VIEW: analytics
  if (viewMode === 'analytics') {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
        {/* Left Dashboard Panel (Full Width) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '12px', paddingBottom: '32px' }}>
          
          {/* Main Ship Highlight */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '48px', marginTop: '24px' }}>
              <div>
                <span className="pill-label" style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '6px' }}>Berth Utilization</span>
                <div style={{ fontSize: '38px', fontWeight: 700, marginTop: '8px', color: 'white' }}>71%</div>
              </div>
              <div>
                <span className="pill-label" style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '6px' }}>On-Time Rate</span>
                <div style={{ fontSize: '38px', fontWeight: 700, marginTop: '8px', color: 'white' }}>87%</div>
              </div>
              <div>
                <span className="pill-label" style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '6px' }}>Vessels Today</span>
                <div style={{ fontSize: '38px', fontWeight: 700, marginTop: '8px', color: 'white' }}>7 vessels</div>
              </div>
            </div>
          </div>

          {/* Vessel Performance Trend Charts */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
            <VesselArrivalsChart />
            <TurnaroundTimeChart />
          </div>

          {/* Bottom Row Stats */}
          <div className="glass-dark-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 28px', borderRadius: '12px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'var(--card-gradient-1)' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>CO₂ Saved</span> <span style={{ fontWeight: 600, marginLeft: '6px', color: 'var(--accent-cyan)' }}>18.4T</span></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Fuel Saved</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>6.2T</span></div>
            <div><span style={{ color: 'var(--accent-cyan)' }}>Active Berths</span> <span style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginLeft: '6px' }}>5/7</span></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Pending</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>3</span></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Turnaround</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>14.2h</span></div>
          </div>

          {/* Vessels Upcoming Header */}
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '0px', marginBottom: '0px' }}>
            Vessels Upcoming
          </h3>

          {/* Ship Cards Carousel */}
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', marginTop: '-12px' }}>
            {shipsData.map((ship, idx) => {
              const isFirst = idx === 0;
              const isSelected = selectedShipName === ship.name;
              return (
                <div 
                  key={idx} 
                  id={`ship-card-analytics-${ship.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className={isFirst ? "" : "glass-panel"} 
                  style={{ 
                    minWidth: '400px', 
                    borderRadius: '14px', 
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    gap: '16px',
                    background: isFirst ? 'var(--card-gradient-1)' : undefined,
                    border: isSelected 
                      ? '2px solid var(--accent-cyan)' 
                      : isFirst 
                        ? '1px solid rgba(255,255,255,0.25)' 
                        : '1px solid rgba(255,255,255,0.15)',
                    boxShadow: isSelected ? '0 0 16px rgba(91, 226, 200, 0.4)' : undefined,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Left Column (Vessel metadata, Image, Specs) */}
                  <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
                    <div>
                      {/* Flag and Status Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '18px' }}>{ship.flag}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)', backgroundColor: 'rgba(91,226,200,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(91,226,200,0.2)' }}>
                          {ship.status}
                        </span>
                      </div>
                      {/* Vessel Name */}
                      <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', lineHeight: 1.2 }}>{ship.name}</div>
                      {/* Vessel Type details */}
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{ship.type}</div>
                    </div>

                    {/* Specs overlay layout */}
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '64px', fontSize: '11px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                      <div>LOA <span style={{ fontWeight: 600 }}>{ship.loa}</span></div>
                      <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                      <div>Draft <span style={{ fontWeight: 600 }}>{ship.draft}</span></div>
                      <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                      <div>GT <span style={{ fontWeight: 600 }}>{ship.gt}</span></div>
                    </div>
                  </div>

                  {/* Ship Silhouette Image (Bleeding off bottom-left corner) */}
                  <img 
                    src={ship.image} 
                    alt={ship.name} 
                    style={{ 
                      position: 'absolute', 
                      left: '-42px', 
                      bottom: '28px', 
                      height: '110px', 
                      width: '60%', 
                      objectFit: 'contain', 
                      objectPosition: 'left bottom', 
                      pointerEvents: 'none',
                      filter: 'brightness(1.1) contrast(1.1)',
                      zIndex: 1
                    }} 
                  />

                  {/* Right Column (Operational details separated by border) */}
                  <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px', zIndex: 2, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                      {/* ETA */}
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>ETA</div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{ship.eta}</div>
                      </div>
                      {/* Cargo */}
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Cargo</div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{ship.cargo}</div>
                      </div>
                      {/* Berth */}
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Berth</div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{ship.berth}</div>
                      </div>
                      {/* Tugs & Risk */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Tugs</div>
                          <div style={{ fontWeight: 600, color: 'white' }}>{ship.tugs}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Risk</div>
                          <div style={{ fontWeight: 600, color: ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981' }}>{ship.risk}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      {/* Risk Level Badge */}
                      <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: 700, color: ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981', backgroundColor: `${ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981'}15`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981'}33` }}>
                        {ship.riskLevel}
                      </span>
                      {/* Operator Name */}
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ship.operator}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // RENDER VIEW: communications
  if (viewMode === 'communications') {
    return (
      <Communications 
        selectedMessageId={selectedMessageId}
        onSelectMessageId={onSelectMessageId}
      />
    );
  }

  // RENDER VIEW: vessels
  if (viewMode === 'vessels') {
    const filteredVessels = listVessels.filter((vessel) => {
      const matchesSearch = vessel.name.toLowerCase().includes(vesselSearch.toLowerCase()) ||
                            vessel.type.toLowerCase().includes(vesselSearch.toLowerCase()) ||
                            vessel.operator.toLowerCase().includes(vesselSearch.toLowerCase());
      
      if (vesselFilter === 'All Vessels') return matchesSearch;
      if (vesselFilter === 'Approaching') return matchesSearch && vessel.status === 'APPR';
      if (vesselFilter === 'Anchored') return matchesSearch && vessel.status === 'ANCH';
      if (vesselFilter === 'Berthing') return matchesSearch && vessel.statusLabel === 'Berthing';
      if (vesselFilter === 'Berthed') return matchesSearch && vessel.statusLabel === 'Berthed';
      if (vesselFilter === 'Departing') return matchesSearch && vessel.status === 'DEP';
      return matchesSearch;
    });

    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '24px', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
        
        {/* Search & Filter Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search Box */}
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', borderRadius: '12px', maxWidth: '400px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <input 
              type="text" 
              placeholder="Search vessels..." 
              value={vesselSearch}
              onChange={(e) => setVesselSearch(e.target.value)}
              className="dark-placeholder"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#1e293b',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All Vessels', 'Approaching', 'Anchored', 'Berthing', 'Berthed', 'Departing'].map((filter) => {
              const isActive = vesselFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setVesselFilter(filter)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid ' + (isActive ? '#1e293b' : 'rgba(0,0,0,0.08)'),
                    backgroundColor: isActive ? '#1e293b' : 'rgba(255,255,255,0.5)',
                    color: isActive ? 'white' : '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>

        </div>

        {/* Vessel Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
          {filteredVessels.length > 0 ? (
            filteredVessels.map((vessel) => {
              const getRiskColor = (level: string) => {
                if (level === 'CRITICAL RISK') return '#ef4444';
                if (level === 'HIGH RISK') return '#f97316';
                if (level === 'MEDIUM RISK') return '#eab308';
                return '#10b981';
              };

              const getStatusBg = (status: string) => {
                if (status === 'APPR') return 'rgba(59, 130, 246, 0.1)';
                if (status === 'ANCH') return 'rgba(251, 191, 36, 0.1)';
                return 'rgba(16, 185, 129, 0.1)';
              };

              const getStatusColor = (status: string) => {
                if (status === 'APPR') return '#2563eb';
                if (status === 'ANCH') return '#d97706';
                return '#16a34a';
              };

              return (
                <div 
                  key={vessel.name}
                  className="glass-panel" 
                  onClick={() => {
                    if (onPageChange) {
                      onPageChange('vessels');
                    }
                    if (onSelectVesselForAllocation) {
                      onSelectVesselForAllocation(vessel.name);
                    }
                  }}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    gap: '24px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: '#EAF1F3',
                    boxShadow: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  {/* Left Column: Ship Name and Image */}
                  <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1, borderRight: '1px solid rgba(0,0,0,0.06)', paddingRight: '20px', flexShrink: 0 }}>
                    {/* Ship Name Row */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '18px' }}>{vessel.flag}</span>
                        <div 
                          style={{ 
                            fontSize: '9px', 
                            fontWeight: 700, 
                            color: getStatusColor(vessel.status), 
                            backgroundColor: getStatusBg(vessel.status), 
                            padding: '2px 6px', 
                            borderRadius: '5px',
                            border: `1px solid ${getStatusColor(vessel.status)}15`
                          }}
                        >
                          {vessel.status}
                        </div>
                      </div>
                      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
                        {vessel.name}
                      </h2>
                      <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '3px' }}>
                        {vessel.type}
                      </div>
                    </div>

                    {/* Ship Image (Regular visible image of selected ship, not absolute bg) */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', width: '100%', minHeight: '100px' }}>
                      <img 
                        src={vessel.image} 
                        alt={vessel.name} 
                        style={{ 
                          maxHeight: '100px', 
                          maxWidth: '100%', 
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Right Column: Rest of specs & Operational Progression */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
                    {/* Operator and Show Allocation Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>OPERATOR</span>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                          {vessel.operator}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectVesselForAllocation) {
                            onSelectVesselForAllocation(vessel.name);
                          }
                          if (onPageChange) {
                            onPageChange('allocation');
                          }
                        }}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'white',
                          backgroundColor: '#2563eb',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                      >
                        Show Allocation
                      </button>
                    </div>

                    {/* Grid of Remaining Specs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>DIMENSIONS</span>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                          LOA: {vessel.loa} · Draft: {vessel.draft} · GT: {vessel.gt}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>ETA</span>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                          {vessel.eta}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>CARGO & BERTH</span>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                          {vessel.cargo} · {vessel.berth}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>RISK PROFILE & TUGS</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: getRiskColor(vessel.riskLevel) }}>
                            {vessel.riskLevel} ({vessel.risk})
                          </span>
                          <span style={{ fontSize: '11px', color: '#475569' }}>
                            · {vessel.tugs} Tugs
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Checklist */}
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>OPERATIONAL PROCESS PROGRESSION</span>
                      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', maxWidth: '800px', overflowX: 'auto', padding: '6px 0' }}>
                        {vessel.checklist.map((step, sIdx) => {
                          const isFirstUncompleted = !step.done && (sIdx === 0 || vessel.checklist[sIdx - 1].done);
                          
                          let circleBg = 'rgba(0, 0, 0, 0.02)';
                          let circleBorder = '1.5px solid rgba(0, 0, 0, 0.08)';
                          let circleColor = 'rgba(0, 0, 0, 0.35)';
                          
                          if (step.done) {
                            circleBg = 'rgba(16, 185, 129, 0.08)';
                            circleBorder = '1.5px solid #10b981';
                            circleColor = '#10b981';
                          } else if (isFirstUncompleted) {
                            circleBg = 'rgba(59, 130, 246, 0.08)';
                            circleBorder = '1.5px solid #3b82f6';
                            circleColor = '#3b82f6';
                          }

                          const hasLine = sIdx < vessel.checklist.length - 1;
                          const lineColors = step.done ? '#10b981' : 'rgba(0, 0, 0, 0.08)';

                          return (
                            <React.Fragment key={sIdx}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
                                <div style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: circleBg,
                                  border: circleBorder,
                                  color: circleColor,
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  marginBottom: '4px'
                                }}>
                                  {step.done ? '✓' : (step.num || sIdx + 1)}
                                </div>
                                <span style={{ fontSize: '10px', color: isFirstUncompleted ? '#0f172a' : '#475569', fontWeight: isFirstUncompleted ? 600 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                  {step.label}
                                </span>
                              </div>
                              
                              {hasLine && (
                                <div style={{
                                  flex: 1,
                                  height: '1.5px',
                                  backgroundColor: lineColors,
                                  minWidth: '16px',
                                  maxWidth: '50px',
                                  marginTop: '15px'
                                }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
              No vessels match search or filter.
            </div>
          )}
        </div>

      </div>
    );
  }

  // DEFAULT VIEW (live-map side-by-side map + list view)
  return (
    <div className="animate-fade-in dashboard-main-container" style={{ display: 'flex', width: '100%', height: '100%', gap: '16px', padding: '16px 20px 0 20px', overflow: 'hidden' }}>
      
      {/* Left Dashboard Panel */}
      <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px', minWidth: '300px' }}>
        
        {/* Main Stats Header */}
        <div className="dashboard-kpi-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', marginTop: '8px', padding: '0 4px' }}>
          
          {/* Card 1: Berth Utilization */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Berth Utilization</span>
              <div className="dashboard-kpi-val" style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>71%</div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ↑ 6% vs yesterday
              </span>
            </div>
            {/* Mini Sparkline Graph */}
            <div style={{ width: '60px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="berth-grad-white" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 0 35 C 15 28, 25 35, 40 18 C 55 10, 65 30, 80 15 C 90 8, 95 10, 100 5 L 100 40 L 0 40 Z" 
                  fill="url(#berth-grad-white)" 
                />
                <path 
                  d="M 0 35 C 15 28, 25 35, 40 18 C 55 10, 65 30, 80 15 C 90 8, 95 10, 100 5" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 2: On-Time Rate */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>On-Time Rate</span>
              <div className="dashboard-kpi-val" style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>87%</div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ↑ 4% vs yesterday
              </span>
            </div>
            {/* Mini Sparkline Graph */}
            <div style={{ width: '60px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="ontime-grad-white" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 0 38 C 125,32 25,38 40 22 C 55 15, 65 25, 80 10 C 90 5, 95 8, 100 2 L 100 40 L 0 40 Z" 
                  fill="url(#ontime-grad-white)" 
                />
                <path 
                  d="M 0 38 C 15 32, 25 38, 40 22 C 55 15, 65 25, 80 10 C 90 5, 95 8, 100 2" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Vessels Today */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vessels Today</span>
              <div className="dashboard-kpi-val" style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>7</div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ↑ 2 vs yesterday
              </span>
            </div>
            {/* Mini Sparkline Graph */}
            <div style={{ width: '60px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="vessels-grad-white" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 0 30 C 15 35, 30 15, 45 25 C 60 10, 75 28, 90 12 C 95 8, 100 5, 100 5 L 100 40 L 0 40 Z" 
                  fill="url(#vessels-grad-white)" 
                />
                <path 
                  d="M 0 30 C 15 35, 30 15, 45 25 C 60 10, 75 28, 90 12 C 95 8, 100 5, 100 5" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Vessel Performance Trend Charts */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <VesselArrivalsChart />
          <TurnaroundTimeChart />
        </div>

        {/* Bottom Row Stats */}
        <div className="glass-dark-panel dashboard-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', padding: '18px 24px', borderRadius: '14px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'var(--card-gradient-1)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>CO₂ Saved</span> <span style={{ fontWeight: 600, marginLeft: '6px', color: 'var(--accent-cyan)' }}>18.4T</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Fuel Saved</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>6.2T</span></div>
          <div><span style={{ color: 'var(--accent-cyan)' }}>Active Berths</span> <span style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginLeft: '6px' }}>5/7</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Pending</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>3</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Turnaround</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>14.2h</span></div>
        </div>

        {/* Vessels Upcoming Header */}
        <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '4px', marginBottom: '0px' }}>
          Vessels Upcoming
        </h3>

        {/* Ship Cards Carousel */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginTop: '-4px' }}>
          {shipsData.map((ship, idx) => {
            const isSelected = selectedShipName === ship.name;
            const hasUnread = ship.name === 'MSC BARCELONA' || ship.name === 'ATLANTIC HORIZON' || ship.name === 'GRAND ZEPHYR';
            const unreadMsgId = ship.name === 'MSC BARCELONA' ? '2' : ship.name === 'GRAND ZEPHYR' ? '4' : '6';
            
            return (
              <div
                key={idx}
                id={`ship-card-${ship.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="dashboard-vessel-card"
                style={{
                  minWidth: '340px',
                  maxWidth: '380px',
                  minHeight: '200px',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  background: 'var(--card-gradient-1)',
                  border: isSelected
                    ? '2px solid var(--accent-cyan)'
                    : '1px solid rgba(255,255,255,0.25)',
                  boxShadow: isSelected ? '0 0 16px rgba(91, 226, 200, 0.4)' : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                {hasUnread && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPageChange) {
                        onPageChange('communications');
                      }
                      if (onSelectMessageId) {
                        onSelectMessageId(unreadMsgId);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#fbbf24',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
                      zIndex: 10
                    }}
                    title="New unread communication"
                  >
                    <MessageSquare size={12} fill="white" />
                  </button>
                )}
                {/* Left Column (Vessel metadata, Image, Specs) */}
                <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
                  <div>
                    {/* Flag and Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{ship.flag}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)', backgroundColor: 'rgba(91,226,200,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(91,226,200,0.2)' }}>
                        {ship.status}
                      </span>
                    </div>
                    {/* Vessel Name */}
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', lineHeight: 1.2 }}>{ship.name}</div>
                    {/* Vessel Type details */}
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{ship.type}</div>
                  </div>

                  {/* Specs overlay layout */}
                  <div className="dashboard-vessel-specs" style={{ display: 'flex', flexDirection: 'row', gap: '6px', marginTop: '36px', fontSize: '11px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                    <div>LOA <span style={{ fontWeight: 600 }}>{ship.loa}</span></div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                    <div>Draft <span style={{ fontWeight: 600 }}>{ship.draft}</span></div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                    <div>GT <span style={{ fontWeight: 600 }}>{ship.gt}</span></div>
                  </div>
                </div>

                {/* Ship Silhouette Image (Bleeding off bottom-left corner) */}
                <img 
                  src={ship.image} 
                  alt={ship.name} 
                  className="dashboard-vessel-img"
                  style={{ 
                    position: 'absolute', 
                    left: '-42px', 
                    bottom: '24px', 
                    height: '135px', 
                    width: '65%', 
                    objectFit: 'contain', 
                    objectPosition: 'left bottom', 
                    pointerEvents: 'none',
                    filter: 'brightness(1.1) contrast(1.1)',
                    zIndex: 1
                  }} 
                />

                {/* Right Column (Operational details separated by border) */}
                <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px', zIndex: 2, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                    {/* ETA */}
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>ETA</div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{ship.eta}</div>
                    </div>
                    {/* Cargo */}
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Cargo</div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{ship.cargo}</div>
                    </div>
                    {/* Berth */}
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Berth</div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{ship.berth}</div>
                    </div>
                    {/* Tugs & Risk */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Tugs</div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{ship.tugs}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Risk</div>
                        <div style={{ fontWeight: 600, color: ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981' }}>{ship.risk}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    {/* Risk Level Badge */}
                    <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: 700, color: ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981', backgroundColor: `${ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981'}15`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981'}33` }}>
                      {ship.riskLevel}
                    </span>
                    {/* Operator Name */}
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ship.operator}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
          
          {/* Leaflet Map canvas (Always rendered but hidden in vector mode to keep Leaflet instance alive) */}
          <div 
            className="custom-map" 
            ref={mapContainerRef} 
            style={{ 
              width: '100%', 
              height: '100%', 
              display: mapViewMode === 'harbor' ? 'block' : 'none' 
            }} 
          />

          {/* VECTOR MAP MODE: Stylized Vector Map Graphic */}
          {mapViewMode === 'vector' && (
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
              {/* Country Labels positioned to exactly match the map graphic */}
              <div style={{ position: 'absolute', left: '67%', top: '10%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>NORWAY</div>
              <div style={{ position: 'absolute', left: '76%', top: '15%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>SWEDEN</div>
              <div style={{ position: 'absolute', left: '90%', top: '18%', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>ESTONIA</div>
              <div style={{ position: 'absolute', left: '90%', top: '24%', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>LATVIA</div>
              <div style={{ position: 'absolute', left: '87%', top: '29%', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>LITHUANIA</div>
              
              <div style={{ position: 'absolute', left: '65%', top: '28%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>DENMARK</div>
              <div style={{ position: 'absolute', left: '43%', top: '30%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>UNITED<br/>KINGDOM</div>
              <div style={{ position: 'absolute', left: '36%', top: '36%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>IRELAND</div>
              <div style={{ position: 'absolute', left: '56%', top: '38%', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>NETHERLANDS</div>
              <div style={{ position: 'absolute', left: '65%', top: '41%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>GERMANY</div>
              <div style={{ position: 'absolute', left: '80%', top: '38%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px' }}>POLAND</div>
              
              <div style={{ position: 'absolute', left: '52%', top: '53%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>FRANCE</div>
              <div style={{ position: 'absolute', left: '71%', top: '63%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>ITALY</div>
              
              <div style={{ position: 'absolute', left: '42%', top: '71%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>SPAIN</div>
              
              <div style={{ position: 'absolute', left: '85%', top: '72%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px' }}>GREECE</div>
              <div style={{ position: 'absolute', left: '36%', top: '88%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>MOROCCO</div>
              <div style={{ position: 'absolute', left: '54%', top: '95%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>ALGERIA</div>

              {/* Custom SVG Graphic of Dashed Routes, striped land areas and Glowing Nodes */}
              <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                {/* Striped pattern for highlighted countries */}
                <defs>
                  <pattern id="stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(91, 226, 200, 0.15)" strokeWidth="4" />
                  </pattern>
                  <pattern id="stripes-ireland" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" />
                  </pattern>
                </defs>

                {/* Spain outline approximation */}
                <path d="M 330 670 L 480 670 L 510 740 L 470 820 L 320 810 Z" fill="url(#stripes)" stroke="#5be2c8" strokeWidth="1" strokeDasharray="3, 3" />

                {/* Ireland outline approximation */}
                <path d="M 320 330 Q 380 320 390 360 T 330 400 Z" fill="url(#stripes-ireland)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                {/* Route 1: Ireland to Spain */}
                <path 
                  d="M 355 355 Q 400 480 340 500 T 360 720" 
                  fill="none" 
                  stroke="#5be2c8" 
                  strokeWidth="2.5" 
                  strokeDasharray="6, 6" 
                  style={{ filter: 'drop-shadow(0 0 4px rgba(91, 226, 200, 0.4))' }}
                />

                {/* Route 2: Netherlands to Norway */}
                <path 
                  d="M 570 380 Q 620 270 680 170" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4, 4" 
                />
              </svg>

              {/* Route 1 Cyan Node */}
              <div style={{ 
                position: 'absolute', 
                left: '335px', 
                top: '495px', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#5be2c8', 
                border: '2px solid white',
                boxShadow: '0 0 12px #5be2c8' 
              }} />

              {/* Route 1 Blue Node */}
              <div style={{ 
                position: 'absolute', 
                left: '355px', 
                top: '715px', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#3b82f6', 
                border: '2px solid white',
                boxShadow: '0 0 12px #3b82f6' 
              }} />

              {/* Route 2 Green Node */}
              <div style={{ 
                position: 'absolute', 
                left: '565px', 
                top: '375px', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#4ade80', 
                border: '2px solid white',
                boxShadow: '0 0 12px #4ade80' 
              }} />

              {/* Middle Left overlay: Containers TEU & Delivery time */}
              <div className="glass-dark-panel" style={{ position: 'absolute', top: '88px', left: '24px', zIndex: 1000, padding: '20px', borderRadius: '12px', width: '180px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Containers</div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'white' }}>2,150 TEU</div>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '16px', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '6px', color: 'white' }}>
                    <span style={{ fontSize: '16px' }}>🇮🇪</span> Dublin
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>Delivery time</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-cyan)' }}>2/3 days</div>
                </div>
              </div>

              {/* Bottom Left overlay: Compass Widget */}
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 1000 }}>
                <div style={{ 
                  width: '130px', 
                  height: '130px', 
                  borderRadius: '50%', 
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.3) 100%)', 
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', color: 'var(--text-secondary)', fontSize: '11px', top: '6px', fontWeight: 600 }}>N</div>
                  <div style={{ position: 'absolute', color: 'var(--text-secondary)', fontSize: '11px', bottom: '6px', fontWeight: 600 }}>S</div>
                  <div style={{ position: 'absolute', color: 'var(--text-secondary)', fontSize: '11px', left: '8px', fontWeight: 600 }}>W</div>
                  <div style={{ position: 'absolute', color: 'var(--text-secondary)', fontSize: '11px', right: '8px', fontWeight: 600 }}>E</div>
                  
                  {/* Dial markings */}
                  <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.15)' }}></div>
                  
                  <div style={{ 
                    width: '0', 
                    height: '0', 
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderBottom: '32px solid var(--accent-cyan)',
                    transform: 'rotate(55deg)',
                    transformOrigin: 'bottom center',
                    marginBottom: '32px'
                  }}></div>
                </div>
              </div>

              {/* Bottom Right overlay: Comparison of efficient routes */}
              <div className="glass-dark-panel" style={{ position: 'absolute', bottom: '24px', right: '80px', zIndex: 1000, padding: '24px', borderRadius: '12px', width: '280px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'white', textTransform: 'none' }}>Comparison of efficient routes</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.9)' }}>
                      <span>Lisboa &rarr; Dublin</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>80%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, height: '4px', backgroundColor: i < 16 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.15)', borderRadius: '1px' }}></div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.9)' }}>
                      <span>Rotterdam &rarr; Oslo</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>72%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, height: '4px', backgroundColor: i < 14 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)', borderRadius: '1px' }}></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.9)' }}>
                      <span>Valencia &rarr; Marseille</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>89%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, height: '4px', backgroundColor: i < 18 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)', borderRadius: '1px' }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Dock details panel - Overlayed on the right side of the map (only visible when a berth is selected) */}
          {selectedDock && mapViewMode === 'harbor' && (
            <div 
              className="glass-dark-panel"
              style={{
                position: 'absolute',
                top: '24px',
                right: '80px',
                bottom: '24px',
                width: '320px',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(255,255,255,0.15)',
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span 
                      style={{
                        backgroundColor: 'var(--accent-cyan)',
                        color: '#121c22',
                        fontWeight: 800,
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}
                    >
                      {selectedDock.label}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0 }}>Terminal {selectedDock.label}</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{selectedDock.pier}</p>
                    </div>
                  </div>
                  
                  <div 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 600,
                      display: 'inline-block',
                      borderRadius: '4px',
                      padding: '3px 10px',
                      backgroundColor: 
                        selectedDock.status === 'Occupied' ? 'rgba(239, 68, 68, 0.15)' :
                        selectedDock.status === 'Reserved' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                      color: 
                        selectedDock.status === 'Occupied' ? '#ef4444' :
                        selectedDock.status === 'Reserved' ? '#fbbf24' : '#4ade80',
                      border: `1px solid ${
                        selectedDock.status === 'Occupied' ? 'rgba(239, 68, 68, 0.3)' :
                        selectedDock.status === 'Reserved' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(74, 222, 128, 0.3)'
                      }`,
                      marginTop: '8px'
                    }}
                  >
                    Berth Status: {selectedDock.status}
                  </div>
                </div>

                {/* Vessel Information */}
                <div 
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '10px', fontWeight: 600 }}>
                    <Ship size={12} />
                    <span>VESSEL AT BERTH</span>
                  </div>
                  
                  {selectedDock.vessel ? (
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>
                        {selectedDock.vessel}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Type: {selectedDock.vesselType}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No vessel currently berthed
                    </div>
                  )}
                </div>

                {/* Technical specs */}
                <div 
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>
                    <Info size={12} />
                    <span>BERTH METRICS</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Max LOA Cap:</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>{selectedDock.maxLoa}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Berth Depth:</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>{selectedDock.depth}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Next Schedule:</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>{selectedDock.nextArrival || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Click map to clear focus</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDock(null);
                  }}
                  style={{ 
                    background: 'rgba(255,255,255,0.12)', 
                    border: '1px solid rgba(255,255,255,0.15)', 
                    borderRadius: '6px', 
                    color: 'white', 
                    fontSize: '11px', 
                    padding: '6px 12px', 
                    cursor: 'pointer' 
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
};
