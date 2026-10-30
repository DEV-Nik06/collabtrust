import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { MatchCard } from '../components/MatchCard';
import {
  Users,
  Inbox,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LogIn,
} from 'lucide-react';

interface CampaignInfo {
  id: string;
  title: string;
  category: string;
  budget: string;
  status: string;
}

interface MatchItem {
  id: string;
  score: number;
  explanation: string;
  factors?: {
    nicheOverlap?: number;
    nicheFit?: number;
    audienceFit?: number;
    audienceMatch?: number;
    engagementQuality?: number;
  };
  creator: {
    id: string;
    displayName: string;
    niche: string;
    audienceSize: string | number;
    platforms: any;
    contentStyle?: string;
  };
}

interface ApplicationItem {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  displayName: string;
  niche: string;
  pitchNote: string | null;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  matchScore: number | null;
  matchExplanation: string | null;
}

export function CampaignMatchesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, quickLogin, openAuthModal } = useAuth();

  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'matches' | 'applications'>(
    searchParams.get('tab') === 'applications' ? 'applications' : 'matches'
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [createdCollabId, setCreatedCollabId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'applications') {
      setActiveTab('applications');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'matches' | 'applications') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      // 1. Load campaign info
      const campRes = await api.get<CampaignInfo>(`/campaigns/${id}`);
      setCampaign(campRes);

      // 2. Load matches
      try {
        const matchRes = await api.get<{ matches: MatchItem[] }>(`/campaigns/${id}/matches`);
        setMatches(matchRes.matches || []);
      } catch {
        setMatches([]);
      }

      // 3. Load applications
      try {
        const appRes = await api.get<{ applications: ApplicationItem[] }>(`/campaigns/${id}/applications`);
        setApplications(appRes.applications || []);
      } catch {
        setApplications([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load campaign data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const handleRefreshMatches = async () => {
    if (!id) return;
    setRefreshing(true);
    setError(null);
    try {
      await api.post('/matches/refresh', { campaignId: id });
      const matchRes = await api.get<{ matches: MatchItem[] }>(`/campaigns/${id}/matches`);
      setMatches(matchRes.matches || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh matches.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDecision = async (applicationId: string, decision: 'accepted' | 'declined') => {
    setError(null);
    setActionSuccess(null);
    setCreatedCollabId(null);

    try {
      const res = await api.post<{
        applicationId: string;
        status: string;
        collaboration?: { id: string };
      }>(`/applications/${applicationId}/decision`, { decision });

      if (decision === 'accepted' && res.collaboration?.id) {
        setCreatedCollabId(res.collaboration.id);
        setActionSuccess('Application accepted! Collaboration workspace initialized in status "invited".');
      } else {
        setActionSuccess('Application declined.');
      }

      // Refresh applications list
      const appRes = await api.get<{ applications: ApplicationItem[] }>(`/campaigns/${id}/applications`);
      setApplications(appRes.applications || []);
    } catch (err: any) {
      setError(err?.message || `Failed to ${decision} application.`);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-xs text-slate-600 mb-6">
          Please sign in as a Brand to view candidate matches and incoming creator applications.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => quickLogin('brand')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
          >
            Quick Sign In as Demo Brand (EcoGlow)
          </button>
          <button
            onClick={openAuthModal}
            className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            <LogIn className="w-3.5 h-3.5 inline mr-1" />
            Custom Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-xs text-slate-500 font-medium">Loading campaign matches & applications...</p>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => quickLogin('brand')}
              className="text-xs font-bold text-indigo-700 underline hover:no-underline"
            >
              Switch to Brand View
            </button>
            <Link to="/dashboard" className="text-xs font-bold text-slate-700 underline hover:no-underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Campaign Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">{campaign?.title || 'Campaign Overview'}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              {campaign?.status || 'Active'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Category: {campaign?.category || 'General'} • Budget: {campaign?.budget || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange('matches')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'matches'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Matched Creators ({matches.length})
          </button>
          <button
            onClick={() => handleTabChange('applications')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 relative ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Applications
            {pendingAppsCount > 0 ? (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                {pendingAppsCount} pending
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">({applications.length})</span>
            )}
          </button>
        </div>
      </div>

      {/* Prominent Pending Applications Callout Banner */}
      {pendingAppsCount > 0 && activeTab === 'matches' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                {pendingAppsCount} Creator Application{pendingAppsCount > 1 ? 's' : ''} Awaiting Your Decision!
              </span>
              <span className="text-[11px] text-amber-800">
                A creator submitted a pitch note. Review their pitch and accept to initialize your collaboration workspace.
              </span>
            </div>
          </div>
          <button
            onClick={() => handleTabChange('applications')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            Review & Accept Applications
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          {createdCollabId && (
            <button
              onClick={() => navigate(`/collaborations/${createdCollabId}`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
            >
              Open Collaboration Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Tab 1: AI Creator Matches */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Ranked candidates based on category overlap, engagement quality, and format alignment.
            </span>
            <button
              onClick={handleRefreshMatches}
              disabled={refreshing}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Re-compute Matches'}
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">No Matched Creators Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No creators currently match this campaign's category and requirements. Click "Re-compute Matches" to evaluate active creator profiles.
              </p>
            </div>
          ) : (
            matches.map((m) => {
              const firstPlatform = Array.isArray(m.creator?.platforms)
                ? m.creator.platforms[0]
                : m.creator?.platforms;

              const platformName =
                typeof firstPlatform === 'object' && firstPlatform !== null
                  ? firstPlatform.platform || 'Instagram'
                  : typeof firstPlatform === 'string'
                  ? firstPlatform
                  : 'Instagram';

              const platformHandle =
                typeof firstPlatform === 'object' && firstPlatform !== null && firstPlatform.handle
                  ? firstPlatform.handle
                  : `@${(m.creator?.displayName || 'creator').toLowerCase().replace(/\s+/g, '')}`;

              return (
                <MatchCard
                  key={m.id}
                  displayName={m.creator?.displayName || 'Creator Candidate'}
                  handle={platformHandle}
                  platform={platformName}
                  niche={m.creator?.niche || 'Lifestyle'}
                  audienceSize={m.creator?.audienceSize || '10k'}
                  score={m.score}
                  explanation={m.explanation}
                  factors={m.factors}
                />
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Creator Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Submitted Creator Applications
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review creator pitch notes and accept applicants to initialize collaborative partnerships.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              {pendingAppsCount} Pending Review
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No creator applications submitted yet</p>
              <p className="mt-1">
                Creators discover your active campaign on the marketplace and submit pitches with personalized notes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className={`border rounded-xl p-5 transition ${
                    app.status === 'pending'
                      ? 'border-indigo-200 bg-indigo-50/20 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{app.displayName}</h3>
                        <span className="text-xs text-slate-500">• Niche: {app.niche}</span>
                        {app.matchScore && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            {app.matchScore.toFixed(0)}% Match Fit
                          </span>
                        )}
                      </div>

                      {app.matchExplanation && (
                        <p className="text-xs text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg mt-2 border border-indigo-100 leading-relaxed">
                          <span className="font-semibold">AI Match Note: </span>
                          {app.matchExplanation}
                        </p>
                      )}

                      <div className="mt-3 text-xs bg-white p-3.5 rounded-lg border border-slate-200 text-slate-800 shadow-xs">
                        <span className="font-bold block mb-1 text-slate-900">Submitted Pitch Note:</span>
                        "{app.pitchNote || 'No custom note attached.'}"
                      </div>
                    </div>

                    <div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                          app.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'declined'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="mt-5 pt-3.5 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleDecision(app.id, 'declined')}
                        className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-3.5 py-2 rounded-lg transition"
                      >
                        Decline Pitch
                      </button>
                      <button
                        onClick={() => handleDecision(app.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Application & Initialize Collaboration
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {app.status === 'accepted' && (
                    <div className="mt-3 pt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Application accepted. Active in collaboration workspace.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
