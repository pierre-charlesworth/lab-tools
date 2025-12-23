
import React, { useState } from 'react';
import { Protocol, ProtocolStep, Experiment, StandaloneTimer } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronLeft,
  FlaskConical,
  ArrowRight,
  ClipboardList,
  Sparkles,
  ScrollText,
  Trash2,
  Loader2
} from 'lucide-react';

interface ProtocolViewProps {
  protocols: Protocol[];
  timers: StandaloneTimer[];
  currentTime: Date;
  onAddTimer: (label: string, duration: number, autoStart: boolean) => string;
  onNewExperiment: (overrides: Partial<Experiment>) => void;
  onDeleteProtocol: (id: string) => void;
  onUpdateProtocol: (id: string, updates: Partial<Protocol>) => void;
  onOpenAIModal: () => void;
}

export const ProtocolView: React.FC<ProtocolViewProps> = ({
  protocols,
  timers,
  currentTime,
  onAddTimer,
  onNewExperiment,
  onDeleteProtocol,
  onUpdateProtocol,
  onOpenAIModal
}) => {
  const [activeProtocolId, setActiveProtocolId] = useState<string | null>(null);
  const activeProtocol = protocols.find(p => p.id === activeProtocolId);

  const toggleStep = (protocolId: string, stepId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    if (!protocol) return;

    const newSteps = protocol.steps.map(s =>
      s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
    );

    onUpdateProtocol(protocolId, { steps: newSteps });
  };

  const handleAction = (step: ProtocolStep) => {
    if (!step.action || !activeProtocol) return;

    if (step.action.type === 'timer') {
      // Start the timer
      const timerId = onAddTimer(
        step.action.timerLabel || "Protocol Timer",
        step.action.durationMinutes || 10,
        true
      );

      // Link timer to step
      const newSteps = activeProtocol.steps.map(s =>
        s.id === step.id ? { ...s, activeTimerId: timerId } : s
      );
      onUpdateProtocol(activeProtocol.id, { steps: newSteps });

    } else if (step.action.type === 'experiment') {
      onNewExperiment(step.action.experimentConfig);
    }
  };

  // Helper to get timer progress
  const getTimerProgress = (timerId?: string) => {
    if (!timerId) return null;
    const timer = timers.find(t => t.id === timerId);
    if (!timer || timer.status === 'idle') return null;

    let elapsed = 0;
    if (timer.status === 'running' && timer.startTime) {
      elapsed = (currentTime.getTime() - timer.startTime) / 60000;
    } else if (timer.status === 'paused' && timer.pausedTimeRemaining) {
      elapsed = timer.durationMinutes - timer.pausedTimeRemaining;
    }

    const pct = Math.min(100, Math.max(0, (elapsed / timer.durationMinutes) * 100));
    const remaining = Math.max(0, timer.durationMinutes - elapsed);
    const m = Math.floor(remaining);
    const s = Math.floor((remaining - m) * 60);
    const text = `${m}m ${s}s`;

    return { pct, text, isPaused: timer.status === 'paused', isDone: elapsed >= timer.durationMinutes };
  };

  // --- LIBRARY VIEW ---
  if (!activeProtocol) {
    return (
      <div className="w-full px-4 pt-6 sm:px-6 lg:px-8 pb-32 animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-serif italic text-[var(--md-on-surface)]">Protocol Library</h2>
            <p className="text-sm text-[var(--md-on-surface-variant)]">Select a protocol to start working</p>
          </div>
          <button
            onClick={onOpenAIModal}
            className="px-4 py-2 bg-[var(--md-primary)] hover:brightness-110 text-[var(--md-on-primary)] rounded-xl text-sm font-medium shadow-md shadow-[var(--md-primary)]/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" /> Generate
          </button>
        </div>

        {protocols.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-2xl border border-dashed border-[var(--md-outline)] text-center">
            <div className="w-16 h-16 bg-[var(--md-surface-container)] rounded-full shadow-sm flex items-center justify-center mb-4">
              <ScrollText className="w-8 h-8 text-[var(--md-outline)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--md-on-surface)]">No Protocols Yet</h3>
            <p className="text-sm text-[var(--md-on-surface-variant)] max-w-xs mx-auto mt-1 mb-6">
              Use the AI Assistant to generate a step-by-step protocol for your lab work.
            </p>
            <button
              onClick={onOpenAIModal}
              className="text-[var(--md-primary)] font-medium text-sm hover:underline"
            >
              Create your first protocol
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {protocols.map(p => {
              const completed = p.steps.filter(s => s.isCompleted).length;
              const total = p.steps.length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isRunning = completed > 0 && completed < total;
              const isDone = completed === total && total > 0;

              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProtocolId(p.id)}
                  className={`
                  group relative glass-card p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden
                  ${isRunning ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 dark:border-emerald-500/30' : 'border-[var(--md-outline-variant)] hover:border-emerald-500/50'}
                `}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteProtocol(p.id); }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                      ${isRunning
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                        : isDone
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-[var(--md-surface-container)] text-[var(--md-on-surface-variant)]'
                      }
                    `}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end">
                      {isRunning ? (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Running
                        </span>
                      ) : isDone ? (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Done
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[var(--md-on-surface-variant)]">
                          {total} STEPS
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-[var(--md-on-surface)] mb-1 pr-8 truncate">{p.title}</h3>
                  <p className="text-xs text-[var(--md-on-surface-variant)] line-clamp-2 min-h-[2.5em]">
                    {p.description || "No description provided."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[var(--md-outline-variant)]">
                    {isRunning ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <span>Resume</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--md-surface-container)] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span className={isDone ? "text-blue-600 dark:text-blue-400" : "text-[var(--md-on-surface-variant)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"}>
                          {isDone ? "Review Protocol" : "Start Protocol"}
                        </span>
                        <ArrowRight className={`w-4 h-4 ml-1 ${isDone ? "text-blue-600 dark:text-blue-400" : "text-[var(--md-outline)] group-hover:text-emerald-600 transition-colors"}`} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    );
  }

  // --- RUNNER VIEW ---
  const progress = Math.round((activeProtocol.steps.filter(s => s.isCompleted).length / activeProtocol.steps.length) * 100);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-lab-dark animate-in slide-in-from-right duration-300">

      {/* Runner Header */}
      <div className="sticky top-0 z-20 glass-panel border-b border-[var(--md-outline-variant)] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setActiveProtocolId(null)}
          className="p-2 -ml-2 hover:bg-[var(--md-surface-container)] rounded-full text-[var(--md-on-surface-variant)] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-[var(--md-on-surface)] truncate">{activeProtocol.title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-1.5 w-20 bg-[var(--md-surface-container)] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-mono text-[var(--md-on-surface-variant)]">{progress}% Complete</span>
          </div>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32 space-y-6">
        {activeProtocol.steps.map((step, idx) => {
          const isActive = !step.isCompleted && (idx === 0 || activeProtocol.steps[idx - 1].isCompleted);
          const isDone = step.isCompleted;

          // Check for running timer
          const timerState = step.action?.type === 'timer' ? getTimerProgress(step.activeTimerId) : null;

          return (
            <div
              key={step.id}
              className={`flex gap-4 group transition-opacity duration-500 ${!isActive && !isDone ? 'opacity-50' : 'opacity-100'}`}
            >
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleStep(activeProtocol.id, step.id)}
                  className={`
                       w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all z-10 bg-white dark:bg-lab-dark
                       ${isDone
                      ? 'border-emerald-500 text-emerald-500'
                      : isActive
                        ? 'border-[var(--md-on-surface)] text-[var(--md-on-surface)] scale-110 shadow-sm'
                        : 'border-[var(--md-outline)] text-transparent'
                    }
                     `}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-50 dark:fill-emerald-900/20" /> : <Circle className="w-5 h-5" />}
                </button>
                {idx < activeProtocol.steps.length - 1 && (
                  <div className={`w-0.5 flex-1 my-2 ${isDone ? 'bg-emerald-500/30' : 'bg-[var(--md-outline-variant)]'}`} />
                )}
              </div>

              {/* Content Card */}
              <div
                onClick={(e) => {
                  // Only toggle step if not clicking an interactive element
                  if ((e.target as HTMLElement).closest('button')) return;
                  if (!isDone) toggleStep(activeProtocol.id, step.id);
                }}
                className={`
                    flex-1 pb-4 cursor-pointer
                    ${isActive ? 'translate-y-0' : ''}
                   `}
              >
                <div className={`
                      p-4 rounded-xl border transition-all duration-300
                      ${isDone
                    ? 'glass-panel border-[var(--md-outline-variant)]'
                    : isActive
                      ? 'glass-card border-[var(--md-primary)] shadow-sm'
                      : 'glass-card border-[var(--md-outline-variant)]'
                  }
                   `}>
                  <p className={`text-sm leading-relaxed ${isDone ? 'text-[var(--md-on-surface-variant)] line-through decoration-[var(--md-outline)]' : 'text-[var(--md-on-surface)]'}`}>
                    {step.text}
                  </p>

                  {/* Embedded Action */}
                  {step.action && !isDone && (
                    <div className="mt-4">
                      {step.action.type === 'timer' && (
                        timerState ? (
                          <div className="relative overflow-hidden rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 h-9 flex items-center px-4 gap-3 w-fit min-w-[180px]">
                            {/* Progress Bar Background */}
                            <div
                              className="absolute inset-y-0 left-0 bg-blue-200/50 dark:bg-blue-500/30 transition-all duration-1000 ease-linear"
                              style={{ width: `${timerState.pct}%` }}
                            />

                            <div className="relative z-10 flex items-center justify-between w-full text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                              <div className="flex items-center gap-2">
                                {timerState.isDone ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>{timerState.isDone ? "Done" : "Running"}</span>
                              </div>
                              <span className="font-mono">{timerState.text}</span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(step); }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-500/20"
                          >
                            <Clock className="w-4 h-4" />
                            Start {step.action.durationMinutes}m Timer
                          </button>
                        )
                      )}
                      {step.action.type === 'experiment' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAction(step); toggleStep(activeProtocol.id, step.id); }}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-500/20"
                        >
                          <FlaskConical className="w-4 h-4" />
                          Configure Experiment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
