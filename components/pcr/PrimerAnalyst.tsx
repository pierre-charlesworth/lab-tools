import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Dna } from 'lucide-react';
import { calculateTm, checkGCContent, check3PrimeClamp, analyzePrimerPair, TmResult, GCCheckResult, ClampCheckResult } from '../../utils/pcr-math';

export const PrimerAnalyst: React.FC = () => {
  const [forwardPrimer, setForwardPrimer] = useState('');
  const [reversePrimer, setReversePrimer] = useState('');

  const [fwdTm, setFwdTm] = useState<TmResult | null>(null);
  const [revTm, setRevTm] = useState<TmResult | null>(null);
  const [fwdGC, setFwdGC] = useState<GCCheckResult | null>(null);
  const [revGC, setRevGC] = useState<GCCheckResult | null>(null);
  const [fwdClamp, setFwdClamp] = useState<ClampCheckResult | null>(null);
  const [revClamp, setRevClamp] = useState<ClampCheckResult | null>(null);
  const [pairStatus, setPairStatus] = useState<{ tmDifference: number; status: 'ok' | 'warning' | 'error'; message: string } | null>(null);

  // Real-time analysis on input change
  useEffect(() => {
    if (forwardPrimer.trim()) {
      setFwdTm(calculateTm(forwardPrimer));
      setFwdGC(checkGCContent(forwardPrimer));
      setFwdClamp(check3PrimeClamp(forwardPrimer));
    } else {
      setFwdTm(null);
      setFwdGC(null);
      setFwdClamp(null);
    }
  }, [forwardPrimer]);

  useEffect(() => {
    if (reversePrimer.trim()) {
      setRevTm(calculateTm(reversePrimer));
      setRevGC(checkGCContent(reversePrimer));
      setRevClamp(check3PrimeClamp(reversePrimer));
    } else {
      setRevTm(null);
      setRevGC(null);
      setRevClamp(null);
    }
  }, [reversePrimer]);

  useEffect(() => {
    if (forwardPrimer.trim() && reversePrimer.trim()) {
      setPairStatus(analyzePrimerPair(forwardPrimer, reversePrimer));
    } else {
      setPairStatus(null);
    }
  }, [forwardPrimer, reversePrimer]);

  // Traffic light status color helper
  const getStatusColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusBg = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/20';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-500/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-500/20';
    }
  };

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Single Consolidated Card */}
      <div className="glass-card rounded-[var(--md-radius-lg)] border border-[var(--md-outline-variant)]">
        {/* Header */}
        <div className="bg-[var(--md-surface-container)] px-6 py-5 rounded-t-[var(--md-radius-lg)] border-b border-[var(--md-outline-variant)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dna className="text-[var(--md-primary)] w-5 h-5" />
            <h2 className="text-lg font-semibold font-sans tracking-wide text-[var(--md-on-surface)]">Primer Analyst</h2>
          </div>

          {/* Save/Recall Buttons (Placeholder) */}
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-[var(--md-surface-container)] hover:bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] text-sm font-medium transition-colors border border-[var(--md-outline-variant)] opacity-50 cursor-not-allowed"
              disabled
              title="Save to Library (Coming Soon)"
            >
              Save
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-[var(--md-surface-container)] hover:bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] text-sm font-medium transition-colors border border-[var(--md-outline-variant)] opacity-50 cursor-not-allowed"
              disabled
              title="Load from Library (Coming Soon)"
            >
              Recall
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Forward Primer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--md-on-surface)]">Forward Primer</h3>
              <span className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">5' → 3'</span>
            </div>

          <textarea
            value={forwardPrimer}
            onChange={(e) => setForwardPrimer(e.target.value.toUpperCase())}
            placeholder="Enter forward primer sequence (e.g., ATGCGATCGTAGCTAG...)"
            className="w-full h-16 p-3 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm placeholder:text-[var(--md-on-surface-variant)] placeholder:font-sans"
          />

          {/* Forward Primer Analysis */}
          {fwdTm && (
            <div className="space-y-2 pt-2 border-t border-[var(--md-outline-variant)]">
              {/* Tm Display */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--md-on-surface-variant)]">Tm</span>
                <span className={`text-lg font-bold font-mono ${fwdTm.isValid ? 'text-[var(--md-on-surface)]' : 'text-red-600 dark:text-red-400'}`}>
                  {fwdTm.isValid ? `${fwdTm.tm}°C` : 'Invalid'}
                </span>
              </div>

              {/* Length */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--md-on-surface-variant)]">Length</span>
                <span className="text-xs font-mono text-[var(--md-on-surface)]">{fwdTm.length} bp</span>
              </div>

              {/* GC Content */}
              {fwdGC && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--md-on-surface-variant)]">GC Content</span>
                  <span className={`text-xs font-mono font-semibold ${getStatusColor(fwdGC.status)}`}>
                    {fwdGC.gcContent}%
                  </span>
                </div>
              )}

              {/* Error Display */}
              {fwdTm.error && (
                <div className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusBg('error')}`}>
                  {getStatusIcon('error')}
                  <span className={`text-xs ${getStatusColor('error')}`}>{fwdTm.error}</span>
                </div>
              )}

              {/* GC Warning */}
              {fwdGC && fwdGC.status !== 'ok' && (
                <div className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusBg(fwdGC.status)}`}>
                  {getStatusIcon(fwdGC.status)}
                  <span className={`text-xs ${getStatusColor(fwdGC.status)}`}>{fwdGC.message}</span>
                </div>
              )}

              {/* Clamp Check */}
              {fwdClamp && fwdClamp.status === 'warning' && (
                <div className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusBg('warning')}`}>
                  {getStatusIcon('warning')}
                  <span className={`text-xs ${getStatusColor('warning')}`}>{fwdClamp.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

          {/* Reverse Primer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--md-on-surface)]">Reverse Primer</h3>
              <span className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">5' → 3'</span>
            </div>

          <textarea
            value={reversePrimer}
            onChange={(e) => setReversePrimer(e.target.value.toUpperCase())}
            placeholder="Enter reverse primer sequence (e.g., CTAGCTAGCGATCGCAT...)"
            className="w-full h-16 p-3 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[var(--md-on-surface)] font-mono text-sm placeholder:text-[var(--md-on-surface-variant)] placeholder:font-sans"
          />

          {/* Reverse Primer Analysis */}
          {revTm && (
            <div className="space-y-2 pt-2 border-t border-[var(--md-outline-variant)]">
              {/* Tm Display */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--md-on-surface-variant)]">Tm</span>
                <span className={`text-lg font-bold font-mono ${revTm.isValid ? 'text-[var(--md-on-surface)]' : 'text-red-600 dark:text-red-400'}`}>
                  {revTm.isValid ? `${revTm.tm}°C` : 'Invalid'}
                </span>
              </div>

              {/* Length */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--md-on-surface-variant)]">Length</span>
                <span className="text-xs font-mono text-[var(--md-on-surface)]">{revTm.length} bp</span>
              </div>

              {/* GC Content */}
              {revGC && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--md-on-surface-variant)]">GC Content</span>
                  <span className={`text-xs font-mono font-semibold ${getStatusColor(revGC.status)}`}>
                    {revGC.gcContent}%
                  </span>
                </div>
              )}

              {/* Error Display */}
              {revTm.error && (
                <div className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusBg('error')}`}>
                  {getStatusIcon('error')}
                  <span className={`text-xs ${getStatusColor('error')}`}>{revTm.error}</span>
                </div>
              )}

              {/* GC Warning */}
              {revGC && revGC.status !== 'ok' && (
                <div className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusBg(revGC.status)}`}>
                  {getStatusIcon(revGC.status)}
                  <span className={`text-xs ${getStatusColor(revGC.status)}`}>{revGC.message}</span>
                </div>
              )}

              {/* Clamp Check */}
              {revClamp && revClamp.status === 'warning' && (
                <div className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusBg('warning')}`}>
                  {getStatusIcon('warning')}
                  <span className={`text-xs ${getStatusColor('warning')}`}>{revClamp.message}</span>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Primer Pair Analysis */}
        {pairStatus && fwdTm?.isValid && revTm?.isValid && (
          <div className={`p-6 rounded-xl border ${getStatusBg(pairStatus.status)}`}>
          <div className="flex items-start gap-3">
            <div className={getStatusColor(pairStatus.status)}>
              {getStatusIcon(pairStatus.status)}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${getStatusColor(pairStatus.status)}`}>
                Primer Pair Compatibility
              </h3>
              <p className={`text-sm ${getStatusColor(pairStatus.status)}`}>{pairStatus.message}</p>
              <div className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-[var(--md-on-surface-variant)] block">Forward Tm</span>
                  <span className="text-lg font-mono font-bold text-[var(--md-on-surface)]">{fwdTm.tm}°C</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--md-on-surface-variant)] block">Reverse Tm</span>
                  <span className="text-lg font-mono font-bold text-[var(--md-on-surface)]">{revTm.tm}°C</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--md-on-surface-variant)] block">Difference</span>
                  <span className={`text-lg font-mono font-bold ${getStatusColor(pairStatus.status)}`}>
                    {pairStatus.tmDifference.toFixed(1)}°C
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

          {/* Info Section */}
          <div className="p-4 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)]">
            <h4 className="text-xs uppercase tracking-wider text-[var(--md-on-surface-variant)] font-bold mb-3">Calculation Method</h4>
            <div className="text-xs text-[var(--md-on-surface-variant)] space-y-1">
              <p>• <span className="font-semibold text-[var(--md-on-surface)]">Tm Calculation:</span> Nearest-Neighbor method (SantaLucia 1998)</p>
              <p>• <span className="font-semibold text-[var(--md-on-surface)]">Salt Concentration:</span> 50 mM (standard PCR conditions)</p>
              <p>• <span className="font-semibold text-[var(--md-on-surface)]">Primer Concentration:</span> 250 nM</p>
              <p>• <span className="font-semibold text-[var(--md-on-surface)]">Optimal GC Content:</span> 40-60%</p>
              <p>• <span className="font-semibold text-[var(--md-on-surface)]">Optimal Tm Difference:</span> ≤ 5°C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
