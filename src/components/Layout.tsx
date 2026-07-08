import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { PageId } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageId;
  pageTitle: string;
  onPageChange: (pageId: PageId) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  pageTitle, 
  onPageChange 
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      {/* Absolute background image layer (allows backdrop-filter to work properly) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "linear-gradient(to right, rgba(140, 177, 178, 0.4), rgba(140, 177, 178, 0.1)), url('/ship_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2,
          pointerEvents: 'none'
        }}
      />
      {/* Background overlay for non-map views to reduce contrast and improve readability */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: currentPage === 'vessels' ? 'rgba(240, 244, 246, 0.4)' : 'rgba(21, 37, 41, 0.65)',
          backdropFilter: 'blur(25px)',
          opacity: currentPage === 'live-map' ? 0 : 1,
          transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      {/* Floating Sidebar Navigation (Absolutely positioned, no long background bar) */}
      <div style={{ position: 'absolute', left: '12px', top: '24px', bottom: '24px', zIndex: 10000, display: 'flex', alignItems: 'center' }}>
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      </div>

      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          padding: '0px 32px 32px 64px', /* Offset left padding to clear the floating sidebar icons */
          gap: '12px'
        }}
      >
        <Header pageTitle={pageTitle} />
        <main 
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
