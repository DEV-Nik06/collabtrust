import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, UserCheck, Shield } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'brand' | 'creator'>('brand');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, role);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (targetRole: 'brand' | 'creator') => {
    setError(null);
    setIsSubmitting(true);
    try {
      await quickLogin(targetRole);
    } catch (err: any) {
      setError(err?.message || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {mode === 'login' ? 'Sign In to CollabTrust' : 'Create an Account'}
              </h3>
            </div>
            <button
              onClick={closeAuthModal}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 mb-5">
            <span className="text-xs font-semibold text-indigo-900 block mb-2">
              1-Click Demo Evaluation Logins:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('brand')}
                disabled={isSubmitting}
                className="text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 py-2 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                EcoGlow (Brand)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('creator')}
                disabled={isSubmitting}
                className="text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 py-2 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Alex Rivera (Creator)
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('brand')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      role === 'brand'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Brand / Marketer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      role === 'creator'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Content Creator
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition mt-2 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
