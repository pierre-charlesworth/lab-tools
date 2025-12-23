
import React from 'react';
import { Experiment, StandaloneTimer } from '../types';
import { MiniExperimentCard } from './MiniExperimentCard';
import { MiniTimerCard } from './MiniTimerCard';

interface TopBarProps {
  runningExperiments: Experiment[];
  activeTimers: StandaloneTimer[];
  activeExperimentId: string;
  currentTime: Date;
  isDarkMode: boolean;
  onSelectExperiment: (id: string) => void;
  onToggleTheme: () => void;
  onNewExperiment: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  runningExperiments,
  activeTimers,
  activeExperimentId,
  currentTime,
  isDarkMode,
  onSelectExperiment,
  onToggleTheme
  // onNewExperiment removed - now handled by bottom nav Plus menu
}) => {
  const hasActiveItems = runningExperiments.length > 0 || activeTimers.length > 0;

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-[var(--md-outline-variant)] transition-colors duration-300 shadow-sm">
      <div className="w-full px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">



        {/* Combined Mini Timers Area */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar px-2 mask-linear-fade py-2 justify-start">
          {!hasActiveItems && (
            <span className="text-xs text-zinc-400 dark:text-zinc-600 italic hidden md:block pl-4">
              No active tasks...
            </span>
          )}

          {/* Experiments */}
          {runningExperiments.map(exp => (
            <MiniExperimentCard
              key={exp.id}
              experiment={exp}
              isActive={exp.id === activeExperimentId}
              currentTime={currentTime}
              onClick={() => onSelectExperiment(exp.id)}
              isDarkMode={isDarkMode}
            />
          ))}

          {/* Standalone Timers */}
          {activeTimers.map(timer => (
            <MiniTimerCard
              key={timer.id}
              timer={timer}
              currentTime={currentTime}
            />
          ))}
        </div>

        {/* Right Controls - Mobile 'New' button removed (now in bottom nav Plus menu) */}
      </div>
    </header>
  );
};
