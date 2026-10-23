import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Sparkles, AlertTriangle, ShieldCheck, Compass, Send, ArrowRight, Star } from 'lucide-react';
import { MANDATORY_TRUST_DISCLAIMER } from '@collabtrust/shared';

// --- Navigation Bar ---
function Navbar({ userRole, setUserRole }: { userRole: 'brand' | 'creator'; setUserRole: (role: 'brand' | 'creator') => void }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">CollabTrust</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              MVP
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition">
              Dashboard
            </Link>
            {userRole === 'brand' ? (
              <>
                <Link to="/campaigns/new" className="text-slate-600 hover:text-indigo-600 transition flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  New Campaign
                </Link>
                <Link to="/campaigns/camp_001/matches" className="text-slate-600 hover:text-indigo-600 transition">
                  Matches & Signals
                </Link>
              </>
            ) : (
              <>
                <Link to="/explore" className="text-slate-600 hover:text-indigo-600 transition flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Explore Campaigns
                </Link>
              </>
            )}
            <Link to="/collaborations/collab_001" className="text-slate-600 hover:text-indigo-600 transition">
              Collaborations
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setUserRole('brand')}
              className={`px-3 py-1 rounded-md transition ${userRole === 'brand' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}
            >
              Brand View
            </button>
            <button
              onClick={() => setUserRole('creator')}
              className={`px-3 py-1 rounded-md transition ${userRole === 'creator' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}
            >
              Creator View
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
              {userRole === 'brand' ? 'GS' : 'MT'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Screen 1: Brand Campaign Creation ---
function CreateCampaignPage() {
  const navigate = useNavigate();
  const [rawInput, setRawInput] = useState(
    'Looking for 3-5 skincare creators to review our new organic green tea facial moisturizer. Needs 1 Instagram Reel and 2 stories showing honest unboxing and 7-day usage. Budget $500 total, launch next month.'
  );
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [brief, setBrief] = useState({
    title: 'Green Tea Facial Moisturizer Product Review',
    goals: 'Drive trial and brand awareness through genuine creator reviews',
    targetAudience: 'Eco-conscious skincare enthusiasts aged 18-35',
    deliverables: '1 Instagram Reel (30-60s) + 2 Stories with link',
    timeline: '30 days from product arrival',
    budget: '$500 total budget',
    requirements: 'Must show genuine product unboxing and transparent disclosure',
  });

  const handleAiStructure = () => {
    setIsAiStructuring(true);
    setTimeout(() => {
      setIsAiStructuring(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create a New Campaign Brief</h1>
        <p className="text-sm text-slate-600 mt-1">
          Describe your campaign concept informally, and let AI structure it into an editable brief.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <label className="block text-sm font-semibold text-slate-900 mb-2">Campaign Idea / Pitch Description</label>
        <textarea
          rows={4}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Describe goals, product, target creator, deliverables, and budget..."
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleAiStructure}
            disabled={isAiStructuring}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            {isAiStructuring ? 'Structuring with AI...' : 'Structure with AI'}
          </button>
          <span className="text-xs text-slate-500">AI drafts the brief; you review and edit all fields before publishing.</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Editable Structured Brief Preview</h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            Draft (Unpublished)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
            <input
              type="text"
              value={brief.title}
              onChange={(e) => setBrief({ ...brief, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
            <input
              type="text"
              value={brief.targetAudience}
              onChange={(e) => setBrief({ ...brief, targetAudience: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget</label>
            <input
              type="text"
              value={brief.budget}
              onChange={(e) => setBrief({ ...brief, budget: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deliverables</label>
            <input
              type="text"
              value={brief.deliverables}
              onChange={(e) => setBrief({ ...brief, deliverables: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Timeline</label>
            <input
              type="text"
              value={brief.timeline}
              onChange={(e) => setBrief({ ...brief, timeline: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Goals</label>
            <textarea
              rows={2}
              value={brief.goals}
              onChange={(e) => setBrief({ ...brief, goals: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Creator Requirements</label>
            <textarea
              rows={2}
              value={brief.requirements}
              onChange={(e) => setBrief({ ...brief, requirements: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-800">Save as Draft</button>
          <button
            onClick={() => navigate('/campaigns/camp_001/matches')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
          >
            Publish Campaign & Find Matches
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Screen 2: Brand Matched Creators & Trust Signals ---
function CampaignMatchesPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'applications'>('matches');
  const [shortlisted, setShortlisted] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-xs font-semibold text-indigo-600 hover:underline">
          ← Back to Campaigns
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Green Tea Facial Moisturizer Product Review</h1>
            <p className="text-xs text-slate-500 mt-1">Status: Active • Category: Beauty & Wellness • Budget: $500</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'matches' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Matched Creators (3)
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'applications' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Applications (1 Pending)
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'matches' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Maya Torres</h3>
                  <span className="text-xs text-slate-500 font-medium">@mayagreen (Instagram)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Niche: Sustainable Living • Audience: 8.5k (self-reported)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  88% Match
                </span>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Match Explanation
              </p>
              <p className="text-xs text-slate-700 mt-1">
                High audience alignment in clean skincare; consistent engagement in product review reel format matches your deliverables.
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-800 mb-2">Trust Analysis Observations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Profile Completeness: </span>
                    <span className="text-slate-600">All channels linked; self-reported bio and handles verified.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-900">Follower Metric Note: </span>
                    <span className="text-amber-800">8.5k followers is self-reported (not platform-verified).</span>
                  </div>
                </div>
              </div>

              {/* Verbatim Mandatory Disclaimer per Guardrail 1 */}
              <div className="mt-3 p-2.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{MANDATORY_TRUST_DISCLAIMER}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg">
                View Full Profile
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Creators apply before collaboration begins</span>
                <button
                  onClick={() => setShortlisted(!shortlisted)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    shortlisted
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${shortlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
                  {shortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Submitted Creator Applications</h3>
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Maya Torres</h4>
                <p className="text-xs text-slate-500">Applied 2 hours ago • 88% Match Fit</p>
                <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700">
                  <span className="font-semibold text-slate-800">Pitch Note: </span>
                  "I love green tea skincare! Would love to feature your moisturizer on my weekly clean beauty routine reel."
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button className="text-xs font-medium text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded">
                Decline
              </button>
              <Link
                to="/collaborations/collab_001"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm"
              >
                Accept Application
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Screen 3: Creator Marketplace Feed ---
function ExploreCampaignsPage() {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const campaigns = [
    {
      id: 'camp_001',
      brand: 'Glow Skincare Co',
      title: 'Green Tea Facial Moisturizer Product Review',
      category: 'Beauty & Wellness',
      budget: '$500',
      deliverables: '1 Instagram Reel + 2 Stories',
      timeline: '30 days',
      matchFit: 'High Fit (88%)',
    },
    {
      id: 'camp_002',
      brand: 'PureFit Apparel',
      title: 'Summer Eco-Activewear Launch',
      category: 'Fitness & Apparel',
      budget: '$800',
      deliverables: '2 TikToks with discount code',
      timeline: '45 days',
      matchFit: 'Moderate Fit',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Collaboration Opportunities</h1>
        <p className="text-sm text-slate-600 mt-1">Discover verified brand briefs matching your content niche and audience.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 p-2 bg-white"
          >
            <option>All</option>
            <option>Beauty & Wellness</option>
            <option>Fitness & Apparel</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-indigo-600">{c.brand}</span>
                <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                  {c.matchFit}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
              <div className="space-y-1 text-xs text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Deliverables:</span> {c.deliverables}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Budget:</span> {c.budget}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Timeline:</span> {c.timeline}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{c.category}</span>
              <button
                onClick={() => alert(`Application submitted with pitchNote for ${c.title}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Apply to Campaign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Screen 4: Active Collaboration Workspace ---
function CollaborationHubPage() {
  const [status, setStatus] = useState<'invited' | 'accepted' | 'in_progress' | 'completed'>('accepted');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'creator', text: 'Received the moisturizer! Will start testing tomorrow.' },
    { id: 2, sender: 'brand', text: 'Great, let us know if you need anything!' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'creator', text: newMsg }]);
    setNewMsg('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Collaboration Hub</h1>
        <p className="text-xs text-slate-600 mt-1">Glow Skincare Co × Maya Torres • Green Tea Facial Moisturizer Product Review</p>
      </div>

      {/* Status Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { id: 'invited', label: '1. Invited' },
            { id: 'accepted', label: '2. Accepted' },
            { id: 'in_progress', label: '3. In Progress' },
            { id: 'completed', label: '4. Completed' },
          ].map((s, idx) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setStatus(s.id as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  status === s.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
              {idx < 3 && <div className="h-0.5 w-12 bg-slate-200"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Pane: Campaign Summary & Deferred Controls Label */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Campaign Summary</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <span className="font-semibold text-slate-700">Deliverables:</span> 1 Instagram Reel + 2 Stories
            </p>
            <p>
              <span className="font-semibold text-slate-700">Agreed Budget:</span> $500
            </p>
          </div>

          <div className="mt-6 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500">
            <span className="font-semibold text-slate-700 block mb-1">[Deferred Post-MVP]</span>
            Interactive deliverable checklists and asset file upload widgets are deferred post-MVP. Coordinate deliverable links
            directly through the message thread.
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => setStatus('completed')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              Confirm All Deliverables Completed
            </button>
          </div>
        </div>

        {/* Right Pane: Centralized Messages */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-96">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Collaboration Messages</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'creator' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`text-xs p-3 rounded-lg max-w-xs ${
                    m.sender === 'creator' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{m.sender === 'creator' ? 'Maya Torres' : 'Glow Skincare'}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message or share deliverable links..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-indigo-500"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard Hub ---
function DashboardPage({ userRole }: { userRole: 'brand' | 'creator' }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {userRole === 'brand' ? 'Brand Dashboard' : 'Creator Dashboard'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {userRole === 'brand'
              ? 'Manage active briefs, incoming applications, and creator partnerships.'
              : 'Explore opportunities, review submitted applications, and deliver collaborations.'}
          </p>
        </div>
        {userRole === 'brand' && (
          <Link
            to="/campaigns/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Create Campaign Brief
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Campaigns</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {userRole === 'brand' ? 'Pending Applications' : 'Submitted Applications'}
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Collaborations</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Quick Navigation</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/campaigns/new" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg">
            AI Brief Generator
          </Link>
          <Link to="/campaigns/camp_001/matches" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg">
            Creator Matching & Signals
          </Link>
          <Link to="/explore" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg">
            Explore Marketplace
          </Link>
          <Link to="/collaborations/collab_001" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg">
            Active Collaboration Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [userRole, setUserRole] = useState<'brand' | 'creator'>('brand');

  return (
    <BrowserRouter>
      <Navbar userRole={userRole} setUserRole={setUserRole} />
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage userRole={userRole} />} />
          <Route path="/dashboard" element={<DashboardPage userRole={userRole} />} />
          <Route path="/campaigns/new" element={<CreateCampaignPage />} />
          <Route path="/campaigns/:id/matches" element={<CampaignMatchesPage />} />
          <Route path="/explore" element={<ExploreCampaignsPage />} />
          <Route path="/collaborations/:id" element={<CollaborationHubPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
