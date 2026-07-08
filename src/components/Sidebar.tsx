import React from 'react';
import { 
  LayoutDashboard, 
  Ship, 
  Box, 
  Anchor, 
  Map, 
  Cloud,
  Activity,
  Settings,
  MessageSquare,
  User
} from 'lucide-react';
import type { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (pageId: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const topItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'vessels', icon: Ship },
    { id: 'cargo', icon: Box },
    { id: 'ports', icon: Anchor },
    { id: 'live-map', icon: Map },
    { id: 'weather', icon: Cloud },
    { id: 'analytics', icon: Activity },
    { id: 'settings', icon: Settings },
    { id: 'messages', icon: MessageSquare },
    { id: 'profile', icon: User },
  ];

  const renderIcon = (item: any) => {
    const isActive = currentPage === item.id;
    const IconComponent = item.icon;
    
    return (
      <button
        key={item.id}
        onClick={() => onPageChange(item.id)}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '16px',
          backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isActive ? '#1a202c' : '#ffffff',
          transition: 'all 0.2s ease',
          marginBottom: '10px',
          boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          }
        }}
      >
        <IconComponent size={20} strokeWidth={1.8} />
      </button>
    );
  };

  return (
    <div 
      style={{
        userSelect: 'none',
        backgroundColor: 'transparent'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {topItems.map(renderIcon)}
      </div>
    </div>
  );
};
