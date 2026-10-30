import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Compass,
  Inbox,
} from 'lucide-react';

interface PendingAppItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorProfileId: string;
  displayName: string;
  niche: string;
  pitchNote: string | null;
  status: string;
  createdAt: string;
}

interface BrandDashboardData {
  role: 'brand';
  metrics: {
    totalCampaigns: number;
    activeCampaignsCount: number;
    pendingApplicationsCount: number;
    activeCollaborationsCount: number;
  };
  activeCampaigns: Array<{
    id: string;
    title: string;
    category: string;
    budget: string;
    status: string;
    createdAt: string;
    applications: Array<{ id: string }>;
    matches: Array<{ id: string }>;
  }>;
  pendingApplications?: PendingAppItem[];
  pendingApplicationsCount: number;
  activeCollaborations: Array<{
    id: string;
    status: string;
    campaign: { title: string };
    creatorProfile: { displayName: string; niche: string };
  }>;
  emptyState: boolean;
  onboardingAction: string | null;
}

interface CreatorDashboardData {
  role: 'creator';
  metrics: {
    matchedOpportunitiesCount: number;
    applicationsCount: number;
    activeCollaborationsCount: number;
  };
  matchedOpportunities: Array<{
    id: string;
    score: number;
    explanation: string;
    campaign: { id: string; title: string; category: string; budget: string };
  }>;
  applications: Array<{
    id: string;
    pitchNote: string | null;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
    campaign: { id: string; title: string; category: string; budget: string };
  }>;
  activeCollaborations: Array<{
    id: string;
    status: string;
    campaign: { title: string };
  }>;
  emptyState: boolean;
  onboardingAction: string | null;
}

export function DashboardPage() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState<BrandDashboardData | null>(null);
  const [creatorData, setCreatorData] = useState<CreatorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<BrandDashboardData | CreatorDashboardData>('/dashboard');
      if (data.role === 'brand') {
        setBrandData(data as BrandDashboardData);
        setCreatorData(null);
      } else {
        setCreatorData(data as CreatorDashboardData);
        setBrandData(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleQuickAccept = async (appId: string) => {
    setAcceptingId(appId);
    setError(null);
    try {
      const res = await api.post<{ collaboration?: { id: string } }>(
        `/applications/${appId}/decision`,
        { decision: 'accepted' }
      );
      setActionNotice('Application accepted! Redirecting to collaboration workspace...');
      if (res.collaboration?.id) {
        navigate(`/collaborations/${res.collaboration.id}`);
      } else {
        await fetchDashboard();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to accept application.');
    } finally {
      setAcceptingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to CollabTrust MVP</h2>
        <p className="text-sm text-slate-600 mb-6">
          High-trust, AI-assisted creator-brand collaboration platform with structured briefs and observational signals.
        </p>
        <button
          onClick={openAuthModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-xs text-slate-500 font-medium">Loading live marketplace dashboard...</p>
      </div>
    );
  }

  if (error && !brandData && !creatorData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchDashboard}
            className="text-xs font-bold underline hover:no-underline ml-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isBrand = user.role === 'brand';
  const pendingApps = brandData?.pendingApplications || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isBrand ? 'Brand Campaign Dashboard' : 'Creator Opportunity Dashboard'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {isBrand
              ? 'Manage active briefs, review incoming creator applications, and track active collaborations.'
              : 'Discover matched campaign briefs, track submitted applications, and deliver content.'}
          </p>
        </div>

        {isBrand ? (
          <Link
            to="/campaigns/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            AI Brief Generator
          </Link>
        ) : (
          <Link
            to="/explore"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            Explore Campaign Briefs
          </Link>
        )}
      </div>

      {actionNotice && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {isBrand ? (
          <>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Campaigns
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {brandData?.metrics.activeCampaignsCount ?? 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pending Applications
              </span>
              <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                {brandData?.metrics.pendingApplicationsCount ?? 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Collaborations
              </span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                {brandData?.metrics.activeCollaborationsCount ?? 0}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Matched Opportunities
              </span>
              <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                {creatorData?.metrics.matchedOpportunitiesCount ?? 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Submitted Applications
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {creatorData?.metrics.applicationsCount ?? 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Collaborations
              </span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                {creatorData?.metrics.activeCollaborationsCount ?? 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      {isBrand ? (
        <div className="space-y-8">
          {/* Prominent Pending Applications Section */}
          {pendingApps.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-sm p-6 bg-gradient-to-br from-white via-indigo-50/20 to-white">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Creator Applications Awaiting Decision ({pendingApps.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Creators have submitted customized pitches to your campaign briefs. Accept to initialize collaboration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{app.displayName}</h3>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-600">Niche: {app.niche}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            Campaign: {app.campaignTitle}
                          </span>
                        </div>

                        <div className="mt-2.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800">
                          <span className="font-bold text-slate-900 block mb-0.5">Creator Pitch Note:</span>
                          "{app.pitchNote || 'No pitch note provided.'}"
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center">
                        <Link
                          to={`/campaigns/${app.campaignId}/matches?tab=applications`}
                          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 border border-slate-200 px-3 py-2 rounded-lg transition"
                        >
                          Review All
                        </Link>
                        <button
                          onClick={() => handleQuickAccept(app.id)}
                          disabled={acceptingId === app.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {acceptingId === app.id ? 'Accepting...' : 'Accept Application'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Campaigns Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Your Campaign Briefs
              </h2>
              <span className="text-xs text-slate-500">
                {brandData?.activeCampaigns.length ?? 0} campaigns total
              </span>
            </div>

            {brandData?.activeCampaigns && brandData.activeCampaigns.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {brandData.activeCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{camp.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            camp.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Category: {camp.category} • Budget: {camp.budget}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/campaigns/${camp.id}/matches?tab=${camp.applications.length > 0 ? 'applications' : 'matches'}`}
                        className={`text-xs font-semibold px-3.5 py-2 rounded-lg border flex items-center gap-1.5 transition ${
                          camp.applications.length > 0
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 shadow-sm font-bold'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        {camp.applications.length > 0
                          ? `Review Applications (${camp.applications.length} pending)`
                          : 'View Matches & Signals'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No campaigns created yet</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Generate your first structured campaign brief with AI assistance.
                </p>
                <Link
                  to="/campaigns/new"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  Create Campaign Brief
                </Link>
              </div>
            )}
          </div>

          {/* Active Collaborations Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Active Collaboration Workspaces
            </h2>

            {brandData?.activeCollaborations && brandData.activeCollaborations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {brandData.activeCollaborations.map((collab) => (
                  <div
                    key={collab.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {collab.creatorProfile.displayName}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{collab.campaign.title}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                        Status: {collab.status}
                      </span>
                    </div>

                    <Link
                      to={`/collaborations/${collab.id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
                    >
                      Open Workspace & Chat
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                No active collaborations yet. When you accept an applicant, their workspace appears here.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Creator Dashboard View */
        <div className="space-y-8">
          {/* Submitted Applications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Submitted Campaign Applications
              </h2>
              <span className="text-xs text-slate-500">
                {creatorData?.applications.length ?? 0} submitted
              </span>
            </div>

            {creatorData?.applications && creatorData.applications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {creatorData.applications.map((app) => (
                  <div
                    key={app.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{app.campaign.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            app.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'declined'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Category: {app.campaign.category} • Budget: {app.campaign.budget}
                      </p>
                      {app.pitchNote && (
                        <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-700">Pitch note: </span>
                          "{app.pitchNote}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No applications submitted yet</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Explore verified brand briefs and apply with your custom pitch note.
                </p>
                <Link
                  to="/explore"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  Explore Marketplace Briefs
                </Link>
              </div>
            )}
          </div>

          {/* Active Collaborations Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Active Collaborations
            </h2>

            {creatorData?.activeCollaborations && creatorData.activeCollaborations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {creatorData.activeCollaborations.map((collab) => (
                  <div
                    key={collab.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{collab.campaign.title}</h3>
                      <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                        Status: {collab.status}
                      </span>
                    </div>

                    <Link
                      to={`/collaborations/${collab.id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
                    >
                      Open Workspace & Chat
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                No active collaborations yet. When a brand accepts your application, you will be invited here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
