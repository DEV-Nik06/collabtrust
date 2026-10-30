import { ShieldCheck } from 'lucide-react';
import { MANDATORY_TRUST_DISCLAIMER } from '@collabtrust/shared';

export function AdvisoryDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`p-2.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-600 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <span>{MANDATORY_TRUST_DISCLAIMER}</span>
    </div>
  );
}
