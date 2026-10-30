import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Sparkles,
  ArrowRight,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const PRESETS = [
  {
    label: '🌿 Eco Skincare Launch',
    category: 'Beauty & Wellness',
    prompt:
      'Looking for 3-5 clean beauty creators to review our new organic green tea facial moisturizer. Needs 1 Instagram Reel and 2 stories showing honest unboxing and 7-day usage. Budget $500 total, launch next month.',
  },
  {
    label: '⌨️ Wireless Tech Desk Setup',
    category: 'Tech & Gaming',
    prompt:
      'Seeking 2 productivity and tech creators to showcase our ergonomic wireless split mechanical keyboard. Deliverables: 1 dedicated YouTube Short / TikTok setup review plus Instagram carousel with affiliate link. Budget $750, 3 weeks timeline.',
  },
  {
    label: '🥤 Cold-Pressed Juice Brand',
    category: 'Food & Beverage',
    prompt:
      'Need 3 fitness and nutrition micro-creators to feature our cold-pressed immunity shot bundle. 1 Instagram Reel showcasing pre-workout routine + 2 stories with discount code. Budget $450 total, 2 weeks turnaround.',
  },
];

export function CreateCampaignPage() {
  const navigate = useNavigate();
  const [rawInput, setRawInput] = useState(PRESETS[0].prompt);
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [category, setCategory] = useState('Beauty & Wellness');
  const [brief, setBrief] = useState({
    title: 'Green Tea Facial Moisturizer Product Review',
    goals: 'Drive trial and brand awareness through genuine creator reviews',
    targetAudience: 'Eco-conscious skincare enthusiasts aged 18-35',
    deliverables: '1 Instagram Reel (30-60s) + 2 Stories with link',
    timeline: '30 days from product arrival',
    budget: '$500 total budget',
    requirements: 'Must show genuine product unboxing and transparent disclosure',
  });

  const handleSelectPreset = (preset: (typeof PRESETS)[number]) => {
    setRawInput(preset.prompt);
    setCategory(preset.category);
    setError(null);
  };

  const handleAiStructure = async () => {
    if (!rawInput.trim()) return;
    setIsAiStructuring(true);
    setError(null);
    setSuccessNotice(null);

    try {
      const res = await api.post<{
        structuredBrief: {
          title: string;
          goals: string;
          targetAudience: string;
          deliverables: string;
          timeline: string;
          budget: string;
          requirements: string;
        };
      }>('/campaigns/ai-draft', { rawInput: rawInput.trim() });

      if (res.structuredBrief) {
        setBrief(res.structuredBrief);
        setSuccessNotice('AI Campaign Brief Agent successfully structured your requirements!');
      }
    } catch (err: any) {
      setError(err?.message || 'AI structuring failed. You can continue editing manually.');
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await api.post('/campaigns', {
        title: brief.title,
        category,
        rawInput,
        goals: brief.goals,
        targetAudience: brief.targetAudience,
        deliverables: brief.deliverables,
        timeline: brief.timeline,
        budget: brief.budget,
        requirements: brief.requirements,
        aiStructured: true,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to save campaign draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // 1. Create the campaign draft in database
      const created = await api.post<{ id: string }>('/campaigns', {
        title: brief.title,
        category,
        rawInput,
        goals: brief.goals,
        targetAudience: brief.targetAudience,
        deliverables: brief.deliverables,
        timeline: brief.timeline,
        budget: brief.budget,
        requirements: brief.requirements,
        aiStructured: true,
      });

      // 2. Publish campaign to trigger match generation
      await api.post(`/campaigns/${created.id}/publish`);

      // 3. Navigate to matches view
      navigate(`/campaigns/${created.id}/matches`);
    } catch (err: any) {
      setError(err?.message || 'Failed to publish campaign.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Title & Context Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            AI Campaign Brief Agent
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create & Structure Campaign Brief</h1>
        <p className="text-xs text-slate-600 mt-1">
          Draft your campaign concept informally, then let our AI agent extract structured deliverables, budgets,
          and target criteria while you retain full editorial control.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successNotice && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Raw Pitch Input Box & 1-Click Presets */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>1. Informal Campaign Concept & Goals</span>
          </label>
          <span className="text-[11px] text-slate-500 font-medium">
            Try 1-click test scenarios for live evaluation:
          </span>
        </div>

        {/* 1-Click Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition flex items-center gap-1 text-slate-700"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed shadow-xs"
          placeholder="Describe your goals, product, ideal creator type, deliverables, budget, and timeline in your own words..."
        />

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            onClick={handleAiStructure}
            disabled={isAiStructuring || !rawInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isAiStructuring ? 'AI Agent Processing...' : 'Structure with AI Brief Agent'}
          </button>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>XML sanitization & guardrails active</span>
          </div>
        </div>

        {/* AI Agent Reasoning Steps (Visible when processing) */}
        {isAiStructuring && (
          <div className="mt-4 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span>AI Campaign Brief Agent Reasoning Steps:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-indigo-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sanitizing input with XML boundary tags</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Extracting target audience & deliverables</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Checking non-verdict safety terminology</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Validating structured Zod schema</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Structured Brief Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">2. Editable Structured Brief</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 uppercase tracking-wider">
                Human-Controlled
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and adjust parameters. You retain complete authority prior to publishing.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 uppercase tracking-wider self-start sm:self-auto">
            Draft Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
            <input
              type="text"
              value={brief.title}
              onChange={(e) => setBrief({ ...brief, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Marketplace Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none bg-white font-medium"
            >
              <option>Beauty & Wellness</option>
              <option>Fitness & Apparel</option>
              <option>Tech & Gaming</option>
              <option>Food & Beverage</option>
              <option>Sustainable Living</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
            <input
              type="text"
              value={brief.targetAudience}
              onChange={(e) => setBrief({ ...brief, targetAudience: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Required Deliverables</label>
            <input
              type="text"
              value={brief.deliverables}
              onChange={(e) => setBrief({ ...brief, deliverables: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Allocation</label>
            <input
              type="text"
              value={brief.budget}
              onChange={(e) => setBrief({ ...brief, budget: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Timeline & Milestones</label>
            <input
              type="text"
              value={brief.timeline}
              onChange={(e) => setBrief({ ...brief, timeline: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Objectives & Goals</label>
            <textarea
              rows={2}
              value={brief.goals}
              onChange={(e) => setBrief({ ...brief, goals: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Creator Guidelines & Requirements</label>
            <textarea
              rows={2}
              value={brief.requirements}
              onChange={(e) => setBrief({ ...brief, requirements: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1.5 transition disabled:opacity-50 py-2"
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 hover:shadow-indigo-200"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Campaign & Discover Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
