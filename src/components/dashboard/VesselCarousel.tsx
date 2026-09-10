import React from 'react';
import { Bell } from 'lucide-react';

import { shipsData } from './dashboardData';

interface VesselCarouselProps {
  selectedShipName: string | null;
  onPageChange?: (pageId: string) => void;
  onSelectMessageId?: (id: string | null) => void;
  isVesselInRadius?: boolean;
}

export const VesselCarousel: React.FC<VesselCarouselProps> = ({
  selectedShipName,
  onPageChange,
  onSelectMessageId,
  isVesselInRadius = false
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter visible ships. If MSC BARCELONA is in radius, ensure it's at index 0
  const visibleShips = React.useMemo(() => {
    const list = shipsData.filter((ship) => {
      if (ship.name === 'MSC BARCELONA') {
        return isVesselInRadius;
      }
      return true;
    });

    if (isVesselInRadius) {
      const mscIdx = list.findIndex(s => s.name === 'MSC BARCELONA');
      if (mscIdx > 0) {
        const [msc] = list.splice(mscIdx, 1);
        list.unshift(msc);
      }
    }
    return list;
  }, [isVesselInRadius]);

  // Smooth scroll container to position 0 when vessel enters radius
  React.useEffect(() => {
    if (isVesselInRadius && containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [isVesselInRadius]);

  return (
    <div style={{ overflowX: 'clip', overflowY: 'visible', marginTop: '-16px', paddingTop: '12px' }}>
    <div ref={containerRef} style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '24px', paddingTop: '12px' }}>
      {visibleShips.map((ship) => {
        const isMsc = ship.name === 'MSC BARCELONA';
        const isSelected = selectedShipName === ship.name;
        const hasUnread = ship.name === 'MSC BARCELONA' || ship.name === 'ATLANTIC HORIZON' || ship.name === 'GRAND ZEPHYR';
        const unreadMsgId = ship.name === 'MSC BARCELONA' ? '2' : ship.name === 'GRAND ZEPHYR' ? '4' : '6';

        const getRiskColor = (level: string) => {
          if (level === 'HIGH RISK') return '#ef4444';
          if (level === 'MEDIUM RISK') return '#f59e0b';
          return '#10b981';
        };

        // For MSC BARCELONA on arrival, wrap in push-animation layers
        const cardContent = (
          <div
            id={`ship-card-${ship.name.replace(/\s+/g, '-').toLowerCase()}`}
            className={`dashboard-vessel-card ${isMsc && isVesselInRadius ? 'msc-card-glow-blink' : ''}`}
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
              overflow: (isMsc && isVesselInRadius) ? 'visible' : 'hidden',
              transition: 'border 0.3s ease, box-shadow 0.3s ease'
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
                <Bell size={12} strokeWidth={2.5} />

              </button>
            )}

            {/* Left Column */}
            <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
              <img 
                src={ship.image} 
                alt={ship.name} 
                className="dashboard-vessel-img"
                style={{ 
                  width: '100%', 
                  height: '80px', 
                  objectFit: 'contain', 
                  objectPosition: 'left center', 
                  pointerEvents: 'none',
                  filter: 'brightness(1.1) contrast(1.1)',
                  marginBottom: '8px'
                }} 
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px' }}>{ship.flag}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)', backgroundColor: 'rgba(91,226,200,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(91,226,200,0.2)' }}>
                    {ship.status}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', lineHeight: 1.2 }}>{ship.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{ship.type}</div>
              </div>

              <div className="dashboard-vessel-specs" style={{ display: 'flex', flexDirection: 'row', gap: '6px', marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                <div>LOA <span style={{ fontWeight: 600 }}>{ship.loa}</span></div>
                <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                <div>Draft <span style={{ fontWeight: 600 }}>{ship.draft}</span></div>
                <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                <div>GT <span style={{ fontWeight: 600 }}>{ship.gt}</span></div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px', zIndex: 2, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>ETA</div>
                  <div style={{ fontWeight: 600, color: 'white' }}>{ship.eta}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Cargo</div>
                  <div style={{ fontWeight: 600, color: 'white' }}>{ship.cargo}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Berth</div>
                  <div style={{ fontWeight: 600, color: 'white' }}>{ship.berth}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Tugs</div>
                    <div style={{ fontWeight: 600, color: 'white' }}>{ship.tugs}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Risk</div>
                    <div style={{ fontWeight: 600, color: getRiskColor(ship.riskLevel) }}>{ship.risk}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: 700, color: getRiskColor(ship.riskLevel), backgroundColor: `${getRiskColor(ship.riskLevel)}15`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${getRiskColor(ship.riskLevel)}33` }}>
                  {ship.riskLevel}
                </span>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ship.operator}
                </div>
              </div>
            </div>
          </div>
        );

        // Wrap MSC card in push-animation layers on arrival; render others normally
        return isMsc && isVesselInRadius ? (
          <div key="msc-card-push" className="msc-push-wrapper">
            <div className="msc-push-inner">
              {cardContent}
            </div>
          </div>
        ) : (
          <React.Fragment key={ship.name}>
            {cardContent}
          </React.Fragment>
        );
      })}
    </div>
    </div>
  );
};
