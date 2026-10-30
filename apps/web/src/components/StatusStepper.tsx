import { Check } from 'lucide-react';

export type CollabStage = 'invited' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

interface StatusStepperProps {
  currentStatus: CollabStage;
}

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const steps: { id: CollabStage; label: string; desc: string }[] = [
    { id: 'invited', label: '1. Invited', desc: 'Brand invited creator' },
    { id: 'accepted', label: '2. Accepted', desc: 'Creator confirmed' },
    { id: 'in_progress', label: '3. In Progress', desc: 'Content production' },
    { id: 'completed', label: '4. Completed', desc: 'Deliverables verified' },
  ];

  const getStepIndex = (status: CollabStage): number => {
    switch (status) {
      case 'invited':
        return 0;
      case 'accepted':
        return 1;
      case 'in_progress':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isPassed
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold mt-2 ${
                    isCurrent
                      ? 'text-indigo-600'
                      : isPassed
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label.split('. ')[1]}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:block">{step.desc}</span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 sm:mx-4 transition ${
                    idx < currentIndex ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
