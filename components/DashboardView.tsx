
import React, { useState } from 'react';
import { StandaloneTimer, Experiment, View } from '../types';
import {
  Bell,
  Search,
  Mic,
  Timer,
  Calculator,
  Droplets,
  Plus,
  Microscope,
  ArrowRight,
  LineChart,
  FlaskConical,
  Layers,
  ChevronRight,
  ScatterChart,
  Play,
  Sparkles
} from 'lucide-react';
import { MiniExperimentCard } from './MiniExperimentCard';
import { MiniTimerCard } from './MiniTimerCard';
import { AIProtocolModal } from './AIProtocolModal';

interface DashboardViewProps {
  activeTimers: StandaloneTimer[];
  experiments: Experiment[];
  onNavigate: (view: View) => void;
  onNewExperiment: (overrides?: Partial<Experiment>) => void;
  onAddTimer: (label: string, duration: number, autoStart?: boolean) => void;
  onSelectExperiment: (id: string) => void;
  isDarkMode: boolean;
  currentTime: Date;
}

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  colorClass?: string;
  bgClass?: string;
}

const QuickActionButton: React.FC<QuickActionProps> = ({
  icon: Icon,
  label,
  onClick,
  colorClass = "text-[var(--md-on-surface)]",
  bgClass = "glass-card"
}) => (
  <button onClick={onClick} className="flex flex-col gap-2 items-center group min-w-[72px] shrink-0">
    <div className={`
      h-16 w-16 rounded-[var(--md-radius-lg)]
      flex items-center justify-center
      group-hover:scale-105 transition-all group-active:scale-95
      shadow-[var(--md-shadow-md)]
      ${bgClass} ${colorClass}
    `}>
      <Icon className="w-7 h-7 stroke-[1.5]" />
    </div>
    <span className="text-[var(--md-on-surface-variant)] text-xs font-medium text-center tracking-tight">{label}</span>
  </button>
);

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeTimers,
  experiments,
  onNavigate,
  onNewExperiment,
  onAddTimer,
  onSelectExperiment,
  isDarkMode,
  currentTime
}) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const runningExperiments = experiments.filter(e => e.trackingStartTime !== null);
  const hasActiveTasks = activeTimers.length > 0 || runningExperiments.length > 0;
  const totalActive = activeTimers.length + runningExperiments.length;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto md:max-w-full">

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">

        {/* Header */}
        <div className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-secondary)] rounded-full h-14 w-14 ring-2 ring-[var(--md-primary)]/30 overflow-hidden shadow-lg">
                  {/* Placeholder Avatar */}
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-[var(--md-primary)] rounded-full border-2 border-[var(--md-surface)] shadow-sm"></div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[var(--md-on-surface)] text-lg font-bold leading-tight">Good Morning, Dr. Alistair</p>
                <p className="text-[var(--md-on-surface-variant)] text-sm font-normal">
                  {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} • <span className="text-[var(--md-primary)] font-medium">{totalActive} Active Tasks</span>
                </p>
              </div>
            </div>
            <button className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] transition-colors">
              <Bell className="w-6 h-6" />
            </button>
          </div>

          {/* Active Tasks Horizontal Scroll */}
          <div className="mt-6 -mx-5 px-5 overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-3 w-max">
              {/* If no active tasks, show placeholder in place */}
              {!hasActiveTasks && (
                <div
                  onClick={() => onNavigate('timers')}
                  className="bg-zinc-100 dark:bg-zinc-800/50 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl w-full max-w-[320px] p-4 flex items-center justify-center text-zinc-400 gap-2 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors h-20"
                >
                  <Timer className="w-5 h-5 opacity-50" />
                  <span className="text-sm font-medium">No active tasks</span>
                </div>
              )}

              {runningExperiments.map(exp => (
                <MiniExperimentCard
                  key={exp.id}
                  experiment={exp}
                  isActive={false} // Dashboard doesn't highlight selected
                  currentTime={currentTime}
                  onClick={() => onSelectExperiment(exp.id)}
                  isDarkMode={isDarkMode}
                />
              ))}

              {activeTimers.map(timer => (
                <MiniTimerCard
                  key={timer.id}
                  timer={timer}
                  currentTime={currentTime}
                  onClick={() => onNavigate('timers')}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="px-5 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-8 md:gap-y-10">

          {/* 1. AI Assistant (Replaces Search) */}
          <div
            onClick={() => setIsAIModalOpen(true)}
            className="group relative bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-secondary)] rounded-[var(--md-radius-lg)] p-6 text-white overflow-hidden shadow-[var(--md-shadow-xl)] cursor-pointer transition-transform active:scale-[0.98] h-full"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-24 h-24 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">AI Assistant</span>
                </div>

                <h3 className="text-xl font-bold mb-2">Describe your protocol...</h3>
                <p className="text-indigo-100 text-sm max-w-[90%] leading-relaxed">
                  "Grow E. coli to OD 0.6 in 500mL" or "Timer for 10 mins"
                </p>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors w-fit">
                Try it now <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* 2. Quick Actions Section */}
          <div>
            <div className="flex justify-between items-center mb-4 h-6">
              <h3 className="text-[var(--md-on-surface)] text-base font-bold">Quick Actions</h3>
              <button className="text-[var(--md-primary)] text-xs font-semibold hover:text-[var(--md-secondary)] transition-colors">Edit</button>
            </div>
            {/* Mobile: Scroll, Desktop: Grid */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible no-scrollbar">
              <QuickActionButton
                icon={Timer}
                label="Timer"
                onClick={() => onNavigate('timers')}
                colorClass="text-[var(--md-primary)]"
              />
              <QuickActionButton
                icon={Calculator}
                label="Molarity"
                onClick={() => onNavigate('calculator')}
              />
              <QuickActionButton
                icon={Droplets}
                label="Dilution"
                onClick={() => onNavigate('calculator')}
              />
              <QuickActionButton
                icon={Plus}
                label="New Exp"
                onClick={() => onNewExperiment()}
                colorClass="text-white"
                bgClass="bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-secondary)] shadow-[var(--md-shadow-lg)]"
              />
            </div>
          </div>

          {/* 3. Lab Planners */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[var(--md-on-surface)] text-base font-bold">Lab Planners</h3>
              <button className="text-[var(--md-primary)] text-xs font-semibold hover:text-[var(--md-secondary)] transition-colors">Edit</button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="glass-card glass-card-hover p-3 rounded-[var(--md-radius-lg)] flex flex-col gap-2 group cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="bg-[var(--md-primary-container)] p-2 rounded-[var(--md-radius)] text-[var(--md-primary)]">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--md-on-surface-variant)] group-hover:text-[var(--md-primary)] transition-colors" />
                </div>
                <div>
                  <h4 className="text-[var(--md-on-surface)] font-semibold text-sm">PCR Setup</h4>
                  <p className="text-[var(--md-on-surface-variant)] text-xs mt-0">Last: 35 cycles, 55°C</p>
                </div>
              </div>

              <div className="glass-card glass-card-hover p-3 rounded-[var(--md-radius-lg)] flex flex-col gap-2 group cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="bg-[var(--md-primary-container)] p-2 rounded-[var(--md-radius)] text-[var(--md-primary)]">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--md-on-surface-variant)] group-hover:text-[var(--md-primary)] transition-colors" />
                </div>
                <div>
                  <h4 className="text-[var(--md-on-surface)] font-semibold text-sm">Growth Curve</h4>
                  <p className="text-[var(--md-on-surface-variant)] text-xs mt-0">E. coli @ 37°C</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Recent Protocols */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[var(--md-on-surface)] text-base font-bold">Recent Protocols</h3>
              <button onClick={() => onNavigate('experiments')} className="text-[var(--md-primary)] text-xs font-semibold hover:text-[var(--md-secondary)] transition-colors">View All</button>
            </div>

            <div className="flex flex-col gap-3">
              {experiments.slice(0, 3).map((exp, idx) => (
                <div key={exp.id} onClick={() => { onSelectExperiment(exp.id); onNavigate('calculator'); }} className="flex items-center p-3 rounded-[var(--md-radius-lg)] glass-card glass-card-hover gap-3 cursor-pointer group">
                  <div className={`
                    h-10 w-10 rounded-lg flex items-center justify-center border
                    ${idx % 3 === 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' : ''}
                    ${idx % 3 === 1 ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' : ''}
                    ${idx % 3 === 2 ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' : ''}
                  `}>
                    {idx % 3 === 0 && <FlaskConical className="w-5 h-5" />}
                    {idx % 3 === 1 && <Layers className="w-5 h-5" />}
                    {idx % 3 === 2 && <ScatterChart className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[var(--md-on-surface)] text-sm font-semibold truncate">{exp.name}</h4>
                    <p className="text-[var(--md-on-surface-variant)] text-xs truncate">Modified: {new Date(exp.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center rounded-full text-[var(--md-on-surface-variant)] hover:bg-[var(--md-surface-container)] group-hover:text-[var(--md-primary)]">
                    {idx < 2 ? <Play className="w-4 h-4 fill-current" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <AIProtocolModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onCreateExperiment={onNewExperiment}
        onCreateTimer={onAddTimer}
      />
    </div>
  );
};
