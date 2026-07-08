import { useState } from 'react';
import type { PageId } from './types';
import { Layout } from './components/Layout';
import { UnifiedDashboard } from './pages/UnifiedDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('live-map');

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'live-map':
        return 'Live Port Map';
      case 'analytics':
        return 'Vessel Analytics';
      default:
        return 'Operations Platform';
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      pageTitle={getPageTitle(currentPage)}
      onPageChange={setCurrentPage}
    >
      <UnifiedDashboard viewMode={currentPage} />
    </Layout>
  );
}

export default App;
