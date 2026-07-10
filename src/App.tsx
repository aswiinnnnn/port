import { useState, useEffect } from 'react';
import type { PageId } from './types';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { UnifiedDashboard } from './pages/UnifiedDashboard';
import { ResourceAllocationModal } from './pages/ResourceAllocation';
import { ShipAgent } from './pages/ShipAgent';
import { TugOperator } from './pages/TugOperator';
import { HarbourPilot } from './pages/HarbourPilot';
import { Resources } from './pages/Resources';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

type UserRole = 'port-service-provider' | 'tug-operator' | 'ship-agent' | 'harbour-pilot';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>('live-map');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedVesselForAllocation, setSelectedVesselForAllocation] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('port-service-provider');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (currentUserRole === 'ship-agent') {
      setCurrentPage('notifications');
    } else if (currentUserRole === 'tug-operator') {
      setCurrentPage('tug-dashboard');
    } else if (currentUserRole === 'harbour-pilot') {
      setCurrentPage('pilot-dashboard');
    } else {
      setCurrentPage('live-map');
    }
  }, [currentUserRole]);

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'live-map':
        return 'Live Port Map';
      case 'communications':
        return 'Multilingual Communication Center';
      case 'analytics':
        return 'Vessel Analytics';
      case 'notifications':
        return 'Port Call Notifications';
      case 'documents':
        return 'Vessel Documentation';
      case 'berth':
        return 'Berth Reservation Requests';
      case 'departure':
        return 'Vessel Departure Clearance';
      case 'tug-dashboard':
        return 'Tug Operations Dashboard';
      case 'tug-assignments':
        return 'Active Tug Assignments';
      case 'tug-fleet':
        return 'Tug Fleet Overview';
      case 'tug-communications':
        return 'Vessel Communications (Tug)';
      case 'pilot-dashboard':
        return 'Harbour Pilot Dashboard';
      case 'pilot-assignments':
        return 'Active Pilotage Assignments';
      case 'pilot-vessel-data':
        return 'Vessel Data & Specifications';
      case 'pilot-conditions':
        return 'Port & Weather Conditions';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Operations Platform';
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Fixed background layer — a real DOM element so backdrop-filter always has
          something painted behind it to blur, even on the very first page load/refresh.
          CSS background-image on <body> may not be painted when backdrop-filter evaluates,
          but a fixed DOM element is always part of the render tree. */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundImage: "linear-gradient(to right, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.2)), url('/ship_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1e293b',
        }}
      />
      <Layout
        currentPage={currentPage}
        pageTitle={getPageTitle(currentPage)}
        onPageChange={setCurrentPage}
        currentUserRole={currentUserRole}
        onUserRoleChange={setCurrentUserRole}
        onSelectVesselForAllocation={setSelectedVesselForAllocation}
      >
        {/* Role-based content rendering */}
        {currentUserRole === 'port-service-provider' && ['live-map', 'vessels', 'communications'].includes(currentPage) && (
          <UnifiedDashboard
            viewMode={currentPage}
            onPageChange={setCurrentPage}
            selectedMessageId={selectedMessageId}
            onSelectMessageId={setSelectedMessageId}
            onSelectVesselForAllocation={setSelectedVesselForAllocation}
          />
        )}
        {currentPage === 'resources' && (
          <Resources />
        )}
        {currentUserRole === 'port-service-provider' && currentPage === 'analytics' && (
          <Analytics />
        )}
        {currentPage === 'settings' && (
          <Settings />
        )}
        {currentUserRole === 'ship-agent' && (
          <ShipAgent activeTab={currentPage as any} />
        )}
        {currentUserRole === 'tug-operator' && (
          <TugOperator activeTab={currentPage.replace('tug-', '') as any} />
        )}
        {currentUserRole === 'harbour-pilot' && (
          <HarbourPilot activeTab={currentPage.replace('pilot-', '') as any} />
        )}
      </Layout>

      {/* Resource Allocation Modal */}
      {selectedVesselForAllocation && (
        <ResourceAllocationModal
          vesselName={selectedVesselForAllocation}
          onClose={() => {
            setSelectedVesselForAllocation(null);
            setCurrentPage('vessels');
          }}
          onAccept={() => {
            setSelectedVesselForAllocation(null);
            setCurrentPage('vessels');
          }}
        />
      )}
    </>
  );
}

export default App;
