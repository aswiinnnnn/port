import { useState, useEffect } from 'react';
import type { PageId } from './types';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { UnifiedDashboard } from './pages/UnifiedDashboard';
import { ResourceAllocationModal } from './pages/ResourceAllocation';
import { ShipAgent } from './pages/ShipAgent';
import { TugOperator } from './pages/TugOperator';
import { HarbourPilot } from './pages/HarbourPilot';
import { CraneOperator } from './pages/CraneOperator';
import { Resources } from './pages/Resources';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { LoginPage, PRESET_USERS, type UserProfile } from './pages/LoginPage';
import { MscBarcelonaToaster } from './components/MscBarcelonaToaster';

function App() {
  const isAutoAcceptedEnv = import.meta.env.VITE_MSC_BARCELONA_AUTO_ACCEPTED === 'true';

  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[0]);
  const [currentPage, setCurrentPage] = useState<PageId>('live-map');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedVesselForAllocation, setSelectedVesselForAllocation] = useState<string | null>(null);

  const [isMscBarcelonaAccepted, setIsMscBarcelonaAccepted] = useState<boolean>(isAutoAcceptedEnv);
  const [showMscToaster, setShowMscToaster] = useState<boolean>(false);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowMscToaster(false);
  };

  const handleAcceptMscBarcelona = () => {
    setIsMscBarcelonaAccepted(true);
    setShowMscToaster(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowMscToaster(false);
      return;
    }
    if (currentUser.role === 'ship-agent') {
      setCurrentPage('notifications');
    } else if (currentUser.role === 'tug-operator') {
      setCurrentPage('tug-dashboard');
    } else if (currentUser.role === 'harbour-pilot') {
      setCurrentPage('pilot-dashboard');
    } else if (currentUser.role === 'crane-operator') {
      setCurrentPage('crane-dashboard');
    } else {
      setCurrentPage('live-map');
    }

    // Trigger toaster notification on login after 2s delay if VITE_MSC_BARCELONA_AUTO_ACCEPTED is false
    if (!isAutoAcceptedEnv && !isMscBarcelonaAccepted) {
      const timer = setTimeout(() => {
        setShowMscToaster(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowMscToaster(false);
    }
  }, [currentUser, isAuthenticated, isAutoAcceptedEnv, isMscBarcelonaAccepted]);

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
      case 'crane-dashboard':
        return 'Quay Crane Operations Dashboard';
      case 'crane-assignments':
        return 'Active Crane Shift Assignments';
      case 'crane-roster':
        return 'Terminal Crane Equipment Roster';
      case 'crane-sla-timeline':
        return 'AI Operation SLA & Move Timelines';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Operations Platform';
    }
  };

  const handleSelectVesselForAllocation = (vesselName: string, withDelay?: boolean) => {
    if (withDelay) {
      setTimeout(() => {
        setSelectedVesselForAllocation(vesselName);
      }, 300);
    } else {
      setSelectedVesselForAllocation(vesselName);
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
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
            currentUserRole={currentUser.role}
            currentUserProfile={currentUser}
            onLogout={handleLogout}
            onSelectVesselForAllocation={handleSelectVesselForAllocation}
          >
            {/* Role-based content rendering */}
            {currentUser.role === 'port-service-provider' && ['live-map', 'vessels', 'communications'].includes(currentPage) && (
              <UnifiedDashboard
                viewMode={currentPage}
                onPageChange={setCurrentPage}
                selectedMessageId={selectedMessageId}
                onSelectMessageId={setSelectedMessageId}
                onSelectVesselForAllocation={handleSelectVesselForAllocation}
              />
            )}
            {currentPage === 'resources' && (
              <Resources />
            )}
            {currentUser.role === 'port-service-provider' && currentPage === 'analytics' && (
              <Analytics />
            )}
            {currentPage === 'settings' && (
              <Settings />
            )}
            {currentUser.role === 'ship-agent' && (
              <ShipAgent activeTab={currentPage as any} />
            )}
            {currentUser.role === 'tug-operator' && (
              <TugOperator
                activeTab={currentPage.replace('tug-', '') as any}
                isMscBarcelonaAccepted={isMscBarcelonaAccepted}
                onAcceptMscBarcelona={handleAcceptMscBarcelona}
              />
            )}
            {currentUser.role === 'harbour-pilot' && (
              <HarbourPilot activeTab={currentPage.replace('pilot-', '') as any} />
            )}
            {currentUser.role === 'crane-operator' && (
              <CraneOperator
                viewSubMode={currentPage}
                onPageChange={setCurrentPage}
                isMscBarcelonaAccepted={isMscBarcelonaAccepted}
                onAcceptMscBarcelona={handleAcceptMscBarcelona}
              />
            )}
          </Layout>

          {/* Bottom-Right Toaster Notification for MSC BARCELONA */}
          {showMscToaster && !isMscBarcelonaAccepted && (
            <MscBarcelonaToaster
              onAccept={handleAcceptMscBarcelona}
              onClose={() => setShowMscToaster(false)}
              onViewDetails={() => handleSelectVesselForAllocation('MSC BARCELONA')}
            />
          )}

          {/* Resource Allocation Modal */}
          {selectedVesselForAllocation && (
            <ResourceAllocationModal
              vesselName={selectedVesselForAllocation}
              isMscBarcelonaAccepted={isMscBarcelonaAccepted}
              onClose={() => {
                setSelectedVesselForAllocation(null);
                setCurrentPage('vessels');
              }}
              onAccept={() => {
                handleAcceptMscBarcelona();
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;

