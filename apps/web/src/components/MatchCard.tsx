import { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Star } from 'lucide-react';
import { AdvisoryDisclaimer } from './AdvisoryDisclaimer';

export interface TrustSignalItem {
  type: string;
  label: string;
  description: string;
  severity: 'info' | 'note' | 'anomaly';
}

export interface CreatorMatchProps {
  displayName: string;
  handle?: string | any;
  platform?: string | any;
  niche: string;
  audienceSize: string | number;
  score: number;
  explanation: string;
  factors?: {
    nicheOverlap?: number;
    nicheFit?: number;
    audienceFit?: number;
    audienceMatch?: number;
    engagementQuality?: number;
  };
  trustSignals?: TrustSignalItem[];
}

export function MatchCard({
  displayName,
  handle = '@creator',
  platform = 'Instagram',
  niche,
  audienceSize,
  score = 85,
  explanation,
  factors,
  trustSignals,
}: CreatorMatchProps) {
  const [shortlisted, setShortlisted] = useState(false);

  // Safely extract string for platform even if an object was passed
  const renderedPlatform =
    typeof platform === 'object' && platform !== null
      ? (platform as any).platform || 'Instagram'
      : typeof platform === 'string' && platform.trim()
      ? platform
      : 'Instagram';

  // Safely extract string for handle even if an object was passed
  const renderedHandle =
    typeof handle === 'object' && handle !== null
      ? (handle as any).handle || '@creator'
      : typeof handle === 'string' && handle.trim()
      ? handle
      : `@${(displayName || 'creator').toLowerCase().replace(/\s+/g, '')}`;

  // Safely format audience size
  const formattedAudience =
    typeof audienceSize === 'number'
      ? audienceSize >= 1000
        ? `${(audienceSize / 1000).toFixed(0)}k`
        : String(audienceSize)
      : String(audienceSize || '10k');

  // Default trust signals with non-verdict safety formatting
  const effectiveSignals: TrustSignalItem[] = trustSignals || [
    {
      type: 'profile_completeness',
      label: 'Profile Completeness',
      description: 'Public bio, channel handles, and verified portfolio.',
      severity: 'info',
    },
    {
      type: 'follower_metric',
      label: 'Self-Reported Follower Metric',
      description: `${formattedAudience} audience size is self-reported by creator.`,
      severity: 'note',
    },
  ];

  const nicheScore = factors?.nicheOverlap ?? factors?.nicheFit;
  const audienceScore = factors?.audienceFit ?? factors?.audienceMatch;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center flex-shrink-0 shadow-xs">
            {(displayName || 'C').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">{displayName || 'Creator Candidate'}</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {renderedHandle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {renderedPlatform}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              <span className="font-semibold text-slate-700">Niche:</span> {niche || 'Lifestyle'} •{' '}
              <span className="font-semibold text-slate-700">Audience:</span> {formattedAudience} (self-reported)
            </p>
          </div>
        </div>

        {/* Fit Score Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-black tracking-tight">
              {typeof score === 'number' ? score.toFixed(0) : score}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Fit Score</span>
          </div>
        </div>
      </div>

      {/* AI Explanation Banner */}
      <div className="mt-4 p-4 bg-indigo-50/70 rounded-xl border border-indigo-100/90">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Match Rationale</span>
          </p>
          <span className="text-[10px] text-indigo-600 font-semibold">Creator Matching Agent</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">{explanation}</p>

        {factors && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-indigo-200/60 text-[11px] text-indigo-900 font-medium">
            {nicheScore !== undefined && (
              <div className="bg-white/70 p-1.5 rounded-lg border border-indigo-100 text-center">
                <span className="text-slate-500 block text-[10px]">Niche Fit</span>
                <span className="font-bold text-indigo-900">{Math.round(nicheScore * 100)}%</span>
              </div>
            )}
            {audienceScore !== undefined && (
              <div className="bg-white/70 p-1.5 rounded-lg border border-indigo-100 text-center">
                <span className="text-slate-500 block text-[10px]">Audience Match</span>
                <span className="font-bold text-indigo-900">{Math.round(audienceScore * 100)}%</span>
              </div>
            )}
            {factors.engagementQuality !== undefined && (
              <div className="bg-white/70 p-1.5 rounded-lg border border-indigo-100 text-center">
                <span className="text-slate-500 block text-[10px]">Engagement Rate</span>
                <span className="font-bold text-indigo-900">{Math.round(factors.engagementQuality * 100)}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Observational Trust Signals */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Observational Trust Signals (Non-Verdict)</span>
          </p>
          <span className="text-[10px] text-slate-500">Evidence over claims</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {effectiveSignals.map((signal, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl flex items-start gap-2 border ${
                signal.severity === 'note'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : signal.severity === 'anomaly'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {signal.severity === 'note' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : signal.severity === 'anomaly' ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold">{signal.label}: </span>
                <span className="opacity-90">{signal.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Verbatim Mandatory Advisory Disclaimer (AUD-01 Guardrail) */}
        <AdvisoryDisclaimer className="mt-3" />
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
          Zero autonomous outreach • Creators apply with pitch note
        </span>
        <button
          onClick={() => setShortlisted(!shortlisted)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
            shortlisted
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${shortlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
          {shortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
        </button>
      </div>
    </div>
  );
}
