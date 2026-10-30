import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-lg w-full text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              An unexpected render error occurred in this view.
            </p>
            {this.state.error?.message && (
              <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-3 rounded-lg text-rose-700 text-left mb-6 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
              <a
                href="/dashboard"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
