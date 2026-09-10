import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, RotateCcw, X, Eye } from 'lucide-react';
import { docks, getRotatedCoords, shipsData, type DockDetail } from './dashboardData';
import { DockDetailPanel } from './DockDetailPanel';
import { PreviewNotificationCard } from './PreviewNotificationCard';

interface VectorMapOverlayProps {
  onSelectShipName?: (name: string) => void;
  onPageChange?: (pageId: string) => void;
  onSelectVesselForAllocation?: (vesselName: string, withDelay?: boolean) => void;
  onVesselEnterRadius?: (inRadius: boolean) => void;
}

const SHIP_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21 22 21"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4a11.6 11.6 0 0 0 1.62 6"/><path d="M12 10V4"/><path d="M8 7h8"/></svg>`;

const START_LAT_LNG: [number, number] = [41.370, 2.232];
const TARGET_LAT_LNG: [number, number] = [41.365, 2.225];

const createMscIconHtml = (hasNotification: boolean) => {
  // Approaching vessel starts as Green (#10b981), turns to Blue (#2563eb) smoothly once it reaches stop point
  const primaryColor = hasNotification ? '#2563eb' : '#10b981';
  const ringColor = hasNotification ? 'rgba(37, 99, 235, 0.6)' : 'rgba(16, 185, 129, 0.6)';

  return `
  <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px; cursor: pointer;">
    ${hasNotification ? `
      <div style="
        position: absolute;
        top: -6px;
        left: -6px;
        width: 44px;
        height: 44px;
        border: 2px solid ${primaryColor};
        border-radius: 50%;
        animation: pulse 1.5s infinite;
        box-shadow: 0 0 16px ${ringColor};
        transition: all 0.6s ease;
      "></div>
    ` : `
      <div style="
        position: absolute;
        top: -4px;
        left: -4px;
        width: 40px;
        height: 40px;
        border: 1.5px solid ${primaryColor};
        border-radius: 50%;
        opacity: 0.85;
        transition: all 0.6s ease;
      "></div>
    `}
    
    <div style="
      width: 32px;
      height: 32px;
      background-color: ${primaryColor};
      border: 2px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: background-color 0.6s ease, border-color 0.6s ease;
    ">
      ${SHIP_SVG_STRING}
    </div>

    ${hasNotification ? `
      <div style="
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        background-color: ${primaryColor};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        font-size: 10px;
        transition: background-color 0.6s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </div>
    ` : `
      <div style="
        position: absolute;
        top: -3px;
        right: -3px;
        width: 14px;
        height: 14px;
        background-color: ${primaryColor};
        border: 1.5px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        transition: background-color 0.6s ease;
      ">
        <span style="font-size: 8px; color: white;">★</span>
      </div>
    `}

    <div style="
      position: absolute;
      top: 38px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      background-color: ${primaryColor};
      color: #ffffff;
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
      transition: background-color 0.6s ease;
    ">
      MSC BARCELONA
    </div>
  </div>
  `;
};

export const VectorMapOverlay: React.FC<VectorMapOverlayProps> = ({
  onSelectShipName,
  onPageChange,
  onSelectVesselForAllocation,
  onVesselEnterRadius
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const mscMarkerRef = useRef<L.Marker | null>(null);
  const animRef = useRef<number | null>(null);

  const [selectedDock, setSelectedDock] = useState<DockDetail | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'harbor' | 'vector'>('harbor');
  
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);
  const [isVesselInRadius, setIsVesselInRadius] = useState(false);
  const [isSimButtonHidden, setIsSimButtonHidden] = useState(false);

  const getBerthColor = (status: string, isSelected: boolean) => {
    if (isSelected) return '#3b82f6';
    if (status === 'Occupied') return '#ef4444';
    if (status === 'Reserved') return '#fbbf24';
    return '#4ade80';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [41.352, 2.218],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      opacity: 0.85
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // 2 NM boundary circle
    L.circle([41.360, 2.176], {
      radius: 3704,
      color: '#10b981',
      weight: 1.5,
      dashArray: '6, 8',
      fillColor: '#10b981',
      fillOpacity: 0.02,
      interactive: false
    }).addTo(map);

    // Draw berth polygons
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

    const radiusCenter = L.latLng(41.360, 2.176);
    const radiusMeters = 3704;

    // Draw ship markers — skip MSC BARCELONA (only shown during preview)
    shipsData.forEach((ship) => {
      if (ship.name === 'MSC BARCELONA') return;

      const isInsideRadius = map.distance([ship.lat, ship.lng], radiusCenter) <= radiusMeters;
      const markerBg = isInsideRadius ? '#2563eb' : '#10b981';
      const labelBg = isInsideRadius ? '#2563eb' : '#10b981';
      const labelColor = '#ffffff';

      const html = `
        <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px; cursor: pointer;">
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${markerBg};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${SHIP_SVG_STRING}
          </div>

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
            ${ship.name}
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

      marker.on('click', () => {
        if (onSelectShipName) {
          onSelectShipName(ship.name);
        }
        const cardId = `ship-card-${ship.name.replace(/\s+/g, '-').toLowerCase()}`;
        const cardIdAnalytics = `ship-card-analytics-${ship.name.replace(/\s+/g, '-').toLowerCase()}`;
        const cardElement = document.getElementById(cardId) || document.getElementById(cardIdAnalytics);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      map.remove();
    };
  }, []);

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

  // Start vessel arrival animation when Start Preview is clicked
  const handleStartPreview = () => {
    if (isPreviewRunning) return;
    setIsPreviewRunning(true);
    setIsVesselInRadius(false);

    // Create & add the MSC BARCELONA marker if it doesn't exist yet
    if (!mscMarkerRef.current && mapRef.current) {
      const icon = L.divIcon({
        html: createMscIconHtml(false),
        className: 'msc-approaching-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const marker = L.marker(START_LAT_LNG, { icon }).addTo(mapRef.current);
      marker.on('click', () => {
        if (onSelectShipName) onSelectShipName('MSC BARCELONA');
      });
      mscMarkerRef.current = marker;
    } else if (mscMarkerRef.current) {
      // Reset position and icon to green approaching state
      mscMarkerRef.current.setLatLng(START_LAT_LNG);
      mscMarkerRef.current.setIcon(L.divIcon({
        html: createMscIconHtml(false),
        className: 'msc-approaching-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }));
    }

    const startTime = performance.now();
    const duration = 6000;

    const animateVessel = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentLat = START_LAT_LNG[0] + (TARGET_LAT_LNG[0] - START_LAT_LNG[0]) * progress;
      const currentLng = START_LAT_LNG[1] + (TARGET_LAT_LNG[1] - START_LAT_LNG[1]) * progress;

      if (mscMarkerRef.current) {
        mscMarkerRef.current.setLatLng([currentLat, currentLng]);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animateVessel);
      } else {
        // Ship reached radius — turn blue, notify parent
        setIsVesselInRadius(true);
        setIsPreviewRunning(false);
        if (onVesselEnterRadius) onVesselEnterRadius(true);

        if (mscMarkerRef.current) {
          mscMarkerRef.current.setIcon(L.divIcon({
            html: createMscIconHtml(true),
            className: 'msc-blue-arrived-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          }));
        }
      }
    };

    animRef.current = requestAnimationFrame(animateVessel);
  };

  const handleResetPreview = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    // Remove the MSC BARCELONA marker from the map entirely on reset
    if (mscMarkerRef.current) {
      mscMarkerRef.current.remove();
      mscMarkerRef.current = null;
    }
    setIsPreviewRunning(false);
    setIsVesselInRadius(false);
    if (onVesselEnterRadius) onVesselEnterRadius(false);
  };

  return (
    <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
        
        {/* Floating Simulation Control — hidden during active simulation or when dismissed */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 999 }}>
          {!isVesselInRadius && !isPreviewRunning && !isSimButtonHidden && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                  onClick={handleStartPreview}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#042f2e',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#34d399')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                  <Play size={16} fill="#042f2e" />
                  <span>Simulate Vessel Arrival</span>
                </button>
                <button
                  onClick={() => setIsSimButtonHidden(true)}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.15)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Hide simulation button"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.85)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <X size={15} />
                </button>
              </div>
          )}
        </div>

        {/* Leaflet Map canvas */}
        <div 
          className="custom-map" 
          ref={mapContainerRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: mapViewMode === 'harbor' ? 'block' : 'none' 
          }} 
        />

        {/* Vector map mode fallback graphics */}
        {mapViewMode === 'vector' && (
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '67%', top: '10%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>NORWAY</div>
            <div style={{ position: 'absolute', left: '76%', top: '15%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>SWEDEN</div>
            <div style={{ position: 'absolute', left: '42%', top: '71%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>SPAIN</div>
          </div>
        )}

        {/* Dock details drawer */}
        {selectedDock && mapViewMode === 'harbor' && (
          <DockDetailPanel selectedDock={selectedDock} onClose={() => setSelectedDock(null)} />
        )}

        {/* Preview Notification Card for MSC BARCELONA (Only shows once vessel reaches 2 NM radius circle!) */}
        {mapViewMode === 'harbor' && !selectedDock && isVesselInRadius && (
          <PreviewNotificationCard
            onPageChange={onPageChange}
            onSelectVesselForAllocation={onSelectVesselForAllocation}
          />
        )}
      </div>
    </div>
  );
};
