import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Ship, Info, RotateCcw } from 'lucide-react';

const SHIP_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10V2"/></svg>`;

interface DockDetail {
  id: string;
  label: string;
  name: string;
  pier: string;
  lat: number;
  lng: number;
  length: number; // Length along the dock in coordinate delta
  width: number;  // Width perpendicular to the dock in coordinate delta
  angle: number;  // Rotation angle in degrees
  status: 'Occupied' | 'Vacant' | 'Reserved';
  vessel?: string;
  vesselType?: string;
  maxLoa: string;
  depth: string;
  nextArrival?: string;
}

const docks: DockDetail[] = [
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

// Helper to compute rotated rectangle corner coordinates
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

  // 4 corners of standard rectangle
  const corners = [
    [-hl, -hw],
    [hl, -hw],
    [hl, hw],
    [-hl, hw]
  ];

  return corners.map(([x, y]) => {
    // Coordinate space rotation (adjust longitude offset for Cosine latitude stretching)
    const rotLat = x * cos - (y * sin * 0.75);
    const rotLng = (x * sin) / 0.75 + y * cos;
    return [centerLat + rotLat, centerLng + rotLng] as [number, number];
  });
};

export const LivePortMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const [selectedDock, setSelectedDock] = useState<DockDetail | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  const handleResetZoom = () => {
    if (mapRef.current) {
      mapRef.current.setView([41.3518, 2.21347], 14, { animate: true });
      setSelectedDock(null);
      setHasUserSelected(false);
    }
  };

  // Color helper for berths
  const getBerthColor = (status: string, isSelected: boolean) => {
    if (isSelected) return '#3b82f6'; // Selected highlights blue
    if (status === 'Occupied') return '#ef4444'; // Red
    if (status === 'Reserved') return '#fbbf24'; // Yellow
    return '#4ade80'; // Green
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [41.3518, 2.21347],
      zoom: 4,
      zoomControl: true,
      attributionControl: false
    });

    mapRef.current = map;

    // CartoDB Dark Matter Tile Layer (Dark Theme Map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      opacity: 0.65
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
      fillOpacity: 0.03,
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

    // Temporary Helper: Click to get coordinates for calibration
    map.on('click', (e) => {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`Lat: ${e.latlng.lat.toFixed(5)}<br>Lng: ${e.latlng.lng.toFixed(5)}`)
        .openOn(map);
    });

    // Add dynamic ship markers and routes
    const centerLatLng = L.latLng(41.360, 2.176);

    const shipsData = [
      {
        name: 'Nordic Empress',
        lat: 41.365,
        lng: 2.225,
        heading: 218,
        hasStar: true,
        route: [
          [41.375, 2.250],
          [41.365, 2.225],
          [41.355, 2.200]
        ],
        routeColor: '#fbbf24'
      },
      {
        name: 'Emerald Spirit',
        lat: 41.345,
        lng: 2.195,
        heading: 38,
        hasStar: false,
        route: [
          [41.335, 2.170],
          [41.345, 2.195],
          [41.355, 2.220]
        ],
        routeColor: '#3b82f6'
      },
      {
        name: 'Pacific Venture',
        lat: 41.358,
        lng: 2.185,
        heading: 310,
        hasStar: false,
        route: [
          [41.348, 2.195],
          [41.358, 2.185]
        ],
        routeColor: '#10b981'
      },
      {
        name: 'Ocean Explorer',
        lat: 41.372,
        lng: 2.205,
        heading: 218,
        hasStar: false,
        route: [
          [41.385, 2.220],
          [41.372, 2.205]
        ],
        routeColor: '#ec4899'
      },
      {
        name: 'Sea Breeze',
        lat: 41.330,
        lng: 2.240,
        heading: 290,
        hasStar: false,
        route: [
          [41.320, 2.260],
          [41.330, 2.240]
        ],
        routeColor: '#8b5cf6'
      }
    ];

    shipsData.forEach((ship) => {
      const shipLatLng = L.latLng(ship.lat, ship.lng);
      const isInsideRadius = shipLatLng.distanceTo(centerLatLng) < 3704;

      if (ship.route) {
        L.polyline(ship.route as [number, number][], {
          color: ship.routeColor,
          weight: 1.5,
          dashArray: '4, 6',
          opacity: 0.5
        }).addTo(map);
      }

      const vesselBgColor = isInsideRadius ? '#2563eb' : '#10b981';

      // Inside radius style: blue background with white text
      // Outside radius style: green background with white text
      const bgStyle = isInsideRadius 
        ? 'background: #2563eb; color: #ffffff; border: 1px solid rgba(255,255,255,0.2);' 
        : 'background: #10b981; color: #ffffff; border: 1px solid rgba(255,255,255,0.2);';

      const labelStar = ship.hasStar ? '<span style="color: #fbbf24; font-size: 9px; margin-left: 2px;">★</span>' : '';

      // Sleek AIS vessel target shape (vessel hull viewed from top, pointed bow)
      const shipIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px;">
            ${ship.hasStar ? `
              <!-- Outer gold ring highlight -->
              <div style="
                position: absolute;
                top: -4px;
                left: -4px;
                width: 40px;
                height: 40px;
                border: 1.5px solid #fbbf24;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.85;
              "></div>
            ` : ''}
            <!-- Main circle -->
            <div style="
              width: 32px;
              height: 32px;
              background-color: ${vesselBgColor};
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            ">
              ${SHIP_SVG_STRING}
            </div>
            ${ship.hasStar ? `
              <!-- Star badge -->
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
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
            ` : ''}
            <!-- Label -->
            <div style="
              position: absolute;
              top: 38px;
              left: 50%;
              transform: translateX(-50%);
              white-space: nowrap;
              font-family: 'Inter', sans-serif;
              font-size: 10px;
              font-weight: 700;
              padding: 3px 8px;
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              ${bgStyle}
            ">
              ${ship.name}${labelStar}
            </div>
          </div>
        `,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([ship.lat, ship.lng], { icon: shipIcon }).addTo(map);
    });

    // Clean up
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

    // Pan to selected dock polygon (only when user actively clicks a dock)
    if (selectedDock && hasUserSelected) {
      const coords = getRotatedCoords(selectedDock.lat, selectedDock.lng, selectedDock.length, selectedDock.width, selectedDock.angle);
      mapRef.current.fitBounds(L.latLngBounds(coords), {
        padding: [50, 50],
        maxZoom: 16,
        animate: true
      });
    }
  }, [selectedDock, hasUserSelected]);

  return (
    <div 
      style={{
        position: 'relative',
        height: 'calc(100vh - 70px)', // Full height under 70px header
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Map Panel */}
      <div 
        className="dark-map"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: 'rgba(15, 23, 42, 0.4)', // Dark slate translucent background
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />
        
        {/* Reset Zoom Button */}
        <button
          onClick={handleResetZoom}
          title="Reset Map View"
          style={{
            position: 'absolute',
            top: '80px',
            left: '10px',
            width: '34px',
            height: '34px',
            backgroundColor: 'rgba(26, 26, 26, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
            e.currentTarget.style.color = 'var(--accent-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.65)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <RotateCcw size={16} />
        </button>
        
        {/* Quick Map Legend Overlay */}
        <div 
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(26, 26, 26, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '12px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
            PORT BERTH LEGEND
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '8px', border: '1px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' }} />
            <span>Occupied Berth</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '8px', border: '1px solid #4ade80', backgroundColor: 'rgba(74, 222, 128, 0.15)' }} />
            <span>Vacant Berth</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '8px', border: '1px solid #fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.15)' }} />
            <span>Reserved Berth</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '8px', border: '2px solid #3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.35)' }} />
            <span>Selected Berth</span>
          </div>
        </div>
      </div>

      {/* Dock details panel - Overlayed on the right side of the map (only visible when a berth is selected) */}
      {selectedDock && (
        <div 
          className="glass"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            bottom: '20px',
            width: '320px',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            zIndex: 1000,
            backgroundColor: 'rgba(26, 26, 26, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Header info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span 
                  style={{
                    backgroundColor: 'var(--accent-cyan)',
                    color: 'white',
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
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Terminal {selectedDock.label}</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedDock.pier}</p>
                </div>
              </div>
              
              <div 
                style={{ 
                  fontSize: '11px', 
                  fontWeight: 600,
                  display: 'inline-block',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  backgroundColor: 
                    selectedDock.status === 'Occupied' ? 'rgba(248, 113, 113, 0.15)' :
                    selectedDock.status === 'Reserved' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                  color: 
                    selectedDock.status === 'Occupied' ? 'var(--accent-red)' :
                    selectedDock.status === 'Reserved' ? 'var(--accent-amber)' : 'var(--accent-green)',
                  border: `1px solid ${
                    selectedDock.status === 'Occupied' ? 'rgba(248, 113, 113, 0.3)' :
                    selectedDock.status === 'Reserved' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(74, 222, 128, 0.3)'
                  }`
                }}
              >
                Berth Status: {selectedDock.status}
              </div>
            </div>

            {/* Vessel Information */}
            <div 
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '10px', fontWeight: 600 }}>
                <Ship size={12} />
                <span>VESSEL AT BERTH</span>
              </div>
              
              {selectedDock.vessel ? (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
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
                borderTop: '1px solid var(--border-color)',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>
                <Info size={12} />
                <span>BERTH METRICS</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Max LOA Cap:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedDock.maxLoa}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Berth Depth:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedDock.depth}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Next Schedule:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedDock.nextArrival || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Click on any terminal box on the map to pan and focus metrics.
          </div>
        </div>
      )}
    </div>
  );
};
