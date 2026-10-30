import { useState } from 'react';
import { api } from '../lib/api';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface CampaignSummary {
  id: string;
  title: string;
  brandName?: string;
  budget: string;
  category: string;
}

interface ApplyModalProps {
  campaign: CampaignSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (applicationId: string) => void;
}

export function ApplyModal({ campaign, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const [pitchNote, setPitchNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !campaign) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchNote.trim()) {
      setError('Please provide a pitch note explaining your content approach.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post<{ id: string }>(`/campaigns/${campaign.id}/apply`, {
        pitchNote: pitchNote.trim(),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setPitchNote('');
        onSuccess(res.id);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Creator Application
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{campaign.title}</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-4 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-700">Category:</span> {campaign.category}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Budget:</span> {campaign.budget}
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
              <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-600 mt-1">
                The brand has been notified with your pitch note and match fit score.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Your Pitch Note to Brand
                </label>
                <textarea
                  rows={4}
                  required
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  placeholder="Introduce yourself, your audience focus, and your creative vision for this campaign brief..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-3 text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Standardized creator pitch format
                  </span>
                  <span>{pitchNote.length} / 1000</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Pitch Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
