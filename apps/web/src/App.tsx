import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { CampaignMatchesPage } from './pages/CampaignMatchesPage';
import { ExploreCampaignsPage } from './pages/ExploreCampaignsPage';
import { CollaborationHubPage } from './pages/CollaborationHubPage';

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/campaigns/new" element={<CreateCampaignPage />} />
                <Route path="/campaigns/:id/matches" element={<CampaignMatchesPage />} />
                <Route path="/explore" element={<ExploreCampaignsPage />} />
                <Route path="/collaborations/:id" element={<CollaborationHubPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
