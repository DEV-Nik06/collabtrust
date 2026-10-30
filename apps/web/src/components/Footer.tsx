import { ShieldCheck, Github, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { MANDATORY_TRUST_DISCLAIMER } from '@collabtrust/shared';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-indigo-600">CollabTrust</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
                Hackathon MVP
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-md">
              AI-assisted influencer marketplace connecting emerging creators with growing brands through
              explainable matching, structured brief generation, and human-controlled collaboration workflows.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 max-w-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-700">Safety Principle:</strong> {MANDATORY_TRUST_DISCLAIMER}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Platform Architecture
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a
                  href="https://github.com/DEV-Nik06/collabtrust/tree/main/docs/01-product"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Product Requirements (PRD)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/DEV-Nik06/collabtrust/tree/main/docs/03-architecture"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  System Architecture & ADRs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/DEV-Nik06/collabtrust/tree/main/docs/04-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  AI Agents & Safety Guardrails
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/DEV-Nik06/collabtrust/tree/main/docs/06-testing"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  76 Verified Test Catalog
                </a>
              </li>
            </ul>
          </div>

          {/* Hackathon Submission Meta */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Evaluation Info
            </h4>
            <div className="space-y-2 text-slate-600">
              <p className="text-[11px]">
                Built for <strong className="text-slate-800">FiftyFive Technologies AI Hackathon 2026</strong>.
              </p>
              <div className="pt-1">
                <a
                  href="https://github.com/DEV-Nik06/collabtrust"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition text-xs border border-slate-200"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© 2026 CollabTrust. All rights reserved. Built with React 18, TypeScript, Express, PostgreSQL & Prisma.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All 76 Canonical Integration Tests Passing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
