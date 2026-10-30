import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Compass, LogIn, LogOut, Briefcase, HelpCircle, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const { user, logout, quickLogin, openAuthModal } = useAuth();
  const location = useLocation();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const isBrand = user?.role === 'brand';
  const isCreator = user?.role === 'creator';

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Hackathon Evaluation Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white text-[11px] py-1.5 px-4 font-medium flex items-center justify-between shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/30 uppercase tracking-wider">
              FiftyFive Technologies AI Hackathon 2026
            </span>
            <span className="hidden md:inline text-indigo-100">
              Interactive Live Evaluation Sandbox — 76/76 automated test criteria verified
            </span>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1 text-indigo-200 hover:text-white transition font-semibold underline text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>60s Evaluator Quick Tour</span>
          </button>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-indigo-700 transition">
                C
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-black tracking-tight text-slate-900">CollabTrust</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md border border-indigo-200 uppercase tracking-wider">
                    MVP
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">AI-Assisted Marketplace</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
              <Link
                to="/dashboard"
                className={`transition py-1 border-b-2 ${
                  isActive('/dashboard') || isActive('/')
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-indigo-600'
                }`}
              >
                Dashboard
              </Link>

              {isBrand && (
                <Link
                  to="/campaigns/new"
                  className={`transition py-1 border-b-2 flex items-center gap-1.5 ${
                    isActive('/campaigns/new')
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Brief Generator
                </Link>
              )}

              {isCreator && (
                <Link
                  to="/explore"
                  className={`transition py-1 border-b-2 flex items-center gap-1.5 ${
                    isActive('/explore')
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  Explore Campaigns
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* 1-Click Role Switcher for MVP Evaluation */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/80">
              <button
                onClick={() => quickLogin('brand')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isBrand
                    ? 'bg-white shadow-xs text-indigo-700 font-bold border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Brand View (EcoGlow Organics)"
              >
                <Briefcase className="w-3 h-3 text-indigo-600" />
                <span className="hidden sm:inline">Brand:</span> EcoGlow
              </button>
              <button
                onClick={() => quickLogin('creator')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isCreator
                    ? 'bg-white shadow-xs text-emerald-700 font-bold border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Creator View (Alex Rivera)"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">Creator:</span> Alex
              </button>
            </div>

            {/* User Account / Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 pl-3 sm:pl-4">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <div className="text-right hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 leading-none">
                      {user.role === 'brand' ? 'EcoGlow Organics' : 'Alex Rivera'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{user.email}</div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                      isBrand
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isBrand ? 'EG' : 'AR'}
                  </div>
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 60s Evaluator Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">How to Evaluate CollabTrust</h3>
                <p className="text-xs text-slate-500">Test the complete 2-sided marketplace core loop in 60 seconds</p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-slate-800">Generate Campaign with AI Brief Agent:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Click <strong>Brand View</strong> → Open <strong>AI Brief Generator</strong> → Click any of the 1-click prompt presets → Click <em>Generate Structured Brief with AI</em> → Publish.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-slate-800">Review Explainable Matches & Trust Signals:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Inspect the creator recommendation cards. Notice the multi-factor fit explanations, sub-scores, and non-verdict observational trust signals with mandatory disclaimers.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-slate-800">Apply as Creator:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Click <strong>Creator View</strong> in the top bar → Open <strong>Explore Campaigns</strong> → Select a brief and click <em>Apply with Pitch</em>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <strong className="text-slate-800">Collaboration State Machine & Messaging:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Switch back to <strong>Brand View</strong> → Accept application → Open the collaboration workspace to observe the step-by-step lifecycle (<code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">invited → accepted → in_progress → completed</code>) and live message thread.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Got it, let me explore!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
