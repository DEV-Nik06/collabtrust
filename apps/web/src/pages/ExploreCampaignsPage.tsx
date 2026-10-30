import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ApplyModal } from '../components/ApplyModal';
import { Sparkles, Calendar, DollarSign, Layers, Send, CheckCircle2, Search, X } from 'lucide-react';

interface CampaignCardItem {
  id: string;
  title: string;
  category: string;
  budget: string;
  timeline: string;
  deliverables: string;
  goals: string;
  requirements: string;
  brand?: {
    brandProfile?: {
      companyName?: string;
      industry?: string;
    };
  };
  matchIndicator?: {
    score: number;
    explanation: string;
  };
}

export function ExploreCampaignsPage() {
  const { user, openAuthModal } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignCardItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply Modal state
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCardItem | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState<Set<string>>(new Set());

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = categoryFilter !== 'All' ? `?category=${encodeURIComponent(categoryFilter)}` : '';
      const data = await api.get<{ campaigns: CampaignCardItem[] }>(`/campaigns${query}`);
      setCampaigns(data.campaigns || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [categoryFilter]);

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;
    const q = searchQuery.toLowerCase();
    return campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.deliverables.toLowerCase().includes(q) ||
        c.brand?.brandProfile?.companyName?.toLowerCase().includes(q)
    );
  }, [campaigns, searchQuery]);

  const handleApplyClick = (campaign: CampaignCardItem) => {
    if (!user) {
      openAuthModal();
      return;
    }
    setSelectedCampaign(campaign);
    setIsApplyModalOpen(true);
  };

  const handleApplySuccess = (_applicationId: string) => {
    if (selectedCampaign) {
      setAppliedCampaignIds((prev) => new Set([...prev, selectedCampaign.id]));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Creator Marketplace Feed
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Explore Collaboration Opportunities
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Discover verified brand campaign briefs, review deliverable expectations, and apply with your custom pitch note.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by keyword, brand, or deliverable..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:border-indigo-500 font-medium w-full md:w-auto"
          >
            <option value="All">All Categories</option>
            <option value="Beauty & Wellness">Beauty & Wellness</option>
            <option value="Fitness & Apparel">Fitness & Apparel</option>
            <option value="Tech & Gaming">Tech & Gaming</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Sustainable Living">Sustainable Living</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium whitespace-nowrap self-end md:self-center">
          {filteredCampaigns.length} briefs found
        </span>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-xs text-slate-500 font-medium">Loading marketplace campaign briefs...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-800">No campaigns found matching your criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or choosing another category.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
            }}
            className="mt-4 text-xs font-semibold px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((camp) => {
            const hasApplied = appliedCampaignIds.has(camp.id);
            const brandName =
              camp.brand?.brandProfile?.companyName || 'Verified Brand Partner';

            return (
              <div
                key={camp.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-600 text-xs">{brandName}</span>
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                      {camp.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {camp.title}
                  </h3>

                  {camp.matchIndicator && (
                    <div className="mb-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        {camp.matchIndicator.score.toFixed(0)}% Profile Fit Indicator
                      </span>
                      <p className="text-emerald-900 text-[11px] mt-1 leading-relaxed">
                        {camp.matchIndicator.explanation}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-slate-600 mt-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-700">Budget:</strong> {camp.budget}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-700">Timeline:</strong> {camp.timeline}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-700">Deliverables:</strong> {camp.deliverables}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Verified Brief • Direct Pitch
                  </span>

                  {hasApplied ? (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Application Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(camp)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply with Pitch</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Standardized Application Pitch Modal */}
      <ApplyModal
        campaign={selectedCampaign}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}
