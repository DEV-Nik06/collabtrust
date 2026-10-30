import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { StatusStepper, CollabStage } from '../components/StatusStepper';
import { MessageThread } from '../components/MessageThread';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Briefcase,
  User,
  ShieldAlert,
  ListChecks,
  FileCheck,
} from 'lucide-react';

interface CollaborationDetails {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  creatorName: string;
  status: CollabStage;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_MILESTONES = [
  { id: 1, label: 'Campaign terms & deliverables acknowledged', completed: true },
  { id: 2, label: 'Draft content & script submitted for review', completed: false },
  { id: 3, label: 'Brand review feedback & revision signoff', completed: false },
  { id: 4, label: 'Content live on social platform with #ad disclosure', completed: false },
  { id: 5, label: 'Performance analytics screenshot verified', completed: false },
];

export function CollaborationHubPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [collab, setCollab] = useState<CollaborationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);

  const fetchCollaboration = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<CollaborationDetails>(`/collaborations/${id}`);
      setCollab(data);
      if (data.status === 'completed') {
        setMilestones((prev) => prev.map((m) => ({ ...m, completed: true })));
      } else if (data.status === 'in_progress') {
        setMilestones((prev) =>
          prev.map((m) => (m.id <= 2 ? { ...m, completed: true } : m))
        );
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load collaboration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, [id]);

  const toggleMilestone = (mId: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === mId ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleStatusTransition = async (nextStatus: CollabStage) => {
    if (!id) return;
    setUpdating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.put<{ status: CollabStage }>(`/collaborations/${id}/status`, {
        status: nextStatus,
      });
      setCollab((prev) => (prev ? { ...prev, status: res.status } : null));
      setSuccessMsg(`Status updated to ${res.status.replace('_', ' ')}.`);

      if (nextStatus === 'completed') {
        setMilestones((prev) => prev.map((m) => ({ ...m, completed: true })));
      } else if (nextStatus === 'in_progress') {
        setMilestones((prev) =>
          prev.map((m) => (m.id <= 2 ? { ...m, completed: true } : m))
        );
      }
    } catch (err: any) {
      setError(err?.message || `Failed to update status to ${nextStatus}.`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-xs text-slate-500 font-medium">Loading collaboration workspace...</p>
      </div>
    );
  }

  if (error && !collab) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <Link to="/dashboard" className="text-xs font-bold underline ml-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = user?.role === 'creator';
  const isBrand = user?.role === 'brand';
  const status = collab?.status || 'invited';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Workspace Header */}
      <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Active Collaboration Workspace
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {collab?.campaignTitle}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Brand Partner: <strong className="text-slate-800">{collab?.brandName}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Creator: <strong className="text-slate-800">{collab?.creatorName}</strong>
              </span>
            </div>
          </div>

          <div>
            <span
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider border shadow-2xs ${
                status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'in_progress'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Stage: {status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <StatusStepper currentStatus={status} />

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane: Action Gates & Deliverable Milestones */}
        <div className="space-y-6">
          {/* Lifecycle Action Gate Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>Lifecycle State Gate</span>
            </h3>

            {/* Stage 1: Invited */}
            {status === 'invited' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Invitation Pending Creator Confirmation
                  </div>
                  {isCreator ? (
                    <p className="leading-relaxed">
                      The brand has accepted your pitch! Please confirm to accept this collaboration partnership.
                    </p>
                  ) : (
                    <p className="leading-relaxed">
                      Awaiting creator confirmation (Safety gate: creator must acknowledge terms before work begins).
                    </p>
                  )}
                </div>

                {isCreator && (
                  <button
                    onClick={() => handleStatusTransition('accepted')}
                    disabled={updating}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {updating ? 'Confirming...' : 'Accept Partnership'}
                  </button>
                )}

                {isBrand && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    Direct activation blocked until creator confirmation.
                  </div>
                )}
              </div>
            )}

            {/* Stage 2: Accepted */}
            {status === 'accepted' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    Partnership Confirmed
                  </div>
                  <p className="leading-relaxed">Both sides aligned. Ready to begin content creation and review.</p>
                </div>

                <button
                  onClick={() => handleStatusTransition('in_progress')}
                  disabled={updating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  {updating ? 'Starting...' : 'Mark Collaboration In Progress'}
                </button>
              </div>
            )}

            {/* Stage 3: In Progress */}
            {status === 'in_progress' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Play className="w-3.5 h-3.5 text-indigo-600" />
                    Content Production Active
                  </div>
                  <p className="leading-relaxed">Coordinate draft reviews, posting links, and disclosure confirmation below.</p>
                </div>

                <button
                  onClick={() => handleStatusTransition('completed')}
                  disabled={updating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {updating ? 'Completing...' : 'Mark Deliverables Fulfilled & Complete'}
                </button>
              </div>
            )}

            {/* Stage 4: Completed */}
            {status === 'completed' && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-sm">Collaboration Completed</div>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  All campaign deliverables verified, reviewed, and finalized successfully.
                </p>
              </div>
            )}
          </div>

          {/* Interactive Milestone Deliverable Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                <span>Deliverables Checklist</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {milestones.filter((m) => m.completed).length}/{milestones.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {milestones.map((m) => (
                <label
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-xs select-none ${
                    m.completed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={m.completed ? 'line-through opacity-85' : 'font-medium'}>
                    {m.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Live Messaging Workspace */}
        <div className="lg:col-span-2">
          {id && <MessageThread collaborationId={id} />}
        </div>
      </div>
    </div>
  );
}
