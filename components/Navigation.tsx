
import React, { useState } from 'react';
import { Settings, FlaskConical, Plus, Library, Clock, Home, LineChart, ClipboardList, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onNewExperiment: () => void;
}

export const NavigationRail: React.FC<NavigationProps & { isDarkMode: boolean; onToggleTheme: () => void }> = ({ currentView, onViewChange, onNewExperiment, isDarkMode, onToggleTheme }) => {
  // Tablet (Portrait) Default: Collapsed if width < 1024px (lg breakpoint)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  // Handle window resize to auto-collapse on tablet if user hasn't manually interacted? 
  // For now, just initial state is safer to avoid overriding user preference during resize.

  const handleNewAction = (action: 'growth' | 'pcr' | 'timer' | 'protocol') => {
    setIsNewMenuOpen(false);
    switch (action) {
      case 'growth': onNewExperiment(); break;
      case 'pcr': onViewChange('pcr'); break;
      case 'timer': onViewChange('timers'); break;
      case 'protocol': onViewChange('protocols'); break;
    }
  };

  return (
    <nav className={`hidden md:flex flex-col justify-between h-screen bg-white dark:bg-lab-card border-r border-zinc-200 dark:border-white/5 py-6 z-40 shrink-0 transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-64'}`}>
      <div className="flex flex-col gap-8">
        {/* Header with Logo and Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center gap-1 px-2' : 'justify-between px-4'}`}>
          <button
            onClick={() => onViewChange('dashboard')}
            className={`text-emerald-600 dark:text-emerald-500 hover:scale-110 transition-transform duration-200 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            title="BioCalc Home"
          >
            <FlaskConical className="w-8 h-8 shrink-0" />
            <span className={`text-xl font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-24 opacity-100 ml-3'}`}>
              BioCalc
            </span>
          </button>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            )}
          </button>
        </div>




        {/* FAB - New (Cascade) */}
        <div className={`relative flex ${isCollapsed ? 'justify-center' : 'px-4'}`}>
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className={`bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center hover:shadow-md hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all active:scale-95 group ${isCollapsed ? 'w-12 h-12' : 'w-full h-12 gap-3'}`}
            title="Create New..."
          >
            <Plus className={`w-6 h-6 transition-transform duration-300 shrink-0 ${isNewMenuOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} />
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-10 opacity-100 ml-2'}`}>
              New
            </span>
          </button>

          {/* Cascade Menu (Desktop Popover) */}
          {isNewMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)} />
              <div className="absolute top-0 left-full ml-4 z-50 flex flex-col gap-3 min-w-[200px]">
                {/* 1. Growth */}
                <button
                  onClick={() => handleNewAction('growth')}
                  className="glass-card flex items-center gap-3 px-4 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-emerald-700 dark:text-emerald-400 bg-white/90 dark:bg-zinc-900/90 shadow-xl border border-white/20 animate-in fade-in zoom-in-50 slide-in-from-left-4 duration-300 fill-mode-forwards"
                  style={{ animationDelay: '0ms' }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Growth Curve</span>
                </button>

                {/* 2. PCR */}
                <button
                  onClick={() => handleNewAction('pcr')}
                  className="glass-card flex items-center gap-3 px-4 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-purple-700 dark:text-purple-400 bg-white/90 dark:bg-zinc-900/90 shadow-xl border border-white/20 animate-in fade-in zoom-in-50 slide-in-from-left-4 duration-300 fill-mode-forwards"
                  style={{ animationDelay: '75ms' }}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">PCR Setup</span>
                </button>

                {/* 3. Timer */}
                <button
                  onClick={() => handleNewAction('timer')}
                  className="glass-card flex items-center gap-3 px-4 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-blue-700 dark:text-blue-400 bg-white/90 dark:bg-zinc-900/90 shadow-xl border border-white/20 animate-in fade-in zoom-in-50 slide-in-from-left-4 duration-300 fill-mode-forwards"
                  style={{ animationDelay: '150ms' }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Quick Timer</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-2 px-2">
          <NavItem icon={Home} label="Home" isActive={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} isCollapsed={isCollapsed} />
          <NavItem icon={ClipboardList} label="Protocols" isActive={currentView === 'protocols'} onClick={() => onViewChange('protocols')} isCollapsed={isCollapsed} />
          <NavItem icon={LineChart} label="Growth" isActive={currentView === 'calculator'} onClick={() => onViewChange('calculator')} isCollapsed={isCollapsed} />
          <NavItem icon={Activity} label="PCR" isActive={currentView === 'pcr'} onClick={() => onViewChange('pcr')} isCollapsed={isCollapsed} />
          <NavItem icon={Clock} label="Timers" isActive={currentView === 'timers'} onClick={() => onViewChange('timers')} isCollapsed={isCollapsed} />
          <NavItem icon={Library} label="Library" isActive={currentView === 'experiments'} onClick={() => onViewChange('experiments')} isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Footer Actions: Theme & Settings */}
      <div className="flex flex-col gap-2 px-2">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`
              flex items-center rounded-xl
              transition-all duration-200 relative group
              text-zinc-600 hover:bg-zinc-100 dark:hover:bg-white/5 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200
              ${isCollapsed ? 'justify-center w-10 h-10 p-0 mx-auto gap-0' : 'justify-start w-full px-3 py-2.5 gap-3'}
            `}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {/* Visual circle for theme state */}
          <div className={`w-5 h-5 rounded-full border-2 transition-colors ${isDarkMode ? 'border-zinc-400 bg-zinc-900' : 'border-zinc-600 bg-amber-300'
            }`} />

          <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-24 opacity-100 ml-3'}`}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

        <NavItem
          icon={Settings}
          label="Settings"
          isActive={currentView === 'settings'}
          onClick={() => onViewChange('settings')}
          isCollapsed={isCollapsed}
        />
      </div>
    </nav>
  );
};

export const BottomNavigation: React.FC<NavigationProps> = ({ currentView, onViewChange, onNewExperiment }) => {
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  const handlePlusClick = () => {
    setIsPlusMenuOpen(!isPlusMenuOpen);
  };

  const handleMenuAction = (action: 'growth' | 'pcr' | 'timer' | 'protocol') => {
    setIsPlusMenuOpen(false);

    switch (action) {
      case 'growth':
        onNewExperiment();
        break;
      case 'pcr':
        onViewChange('pcr');
        break;
      case 'timer':
        onViewChange('timers');
        break;
      case 'protocol':
        onViewChange('protocols');
        break;
    }
  };

  return (
    <>
      {/* Cascading Menu Overlay */}
      {isPlusMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsPlusMenuOpen(false)}
        />
      )}

      {/* Cascading Menu */}
      {isPlusMenuOpen && (
        <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-64 items-center">
          <MenuButton
            icon={FlaskConical}
            label="Start Growth"
            onClick={() => handleMenuAction('growth')}
            color="emerald"
            delay="150ms"
          />
          <MenuButton
            icon={Activity}
            label="Start PCR"
            onClick={() => handleMenuAction('pcr')}
            color="purple"
            delay="75ms"
          />
          <MenuButton
            icon={Clock}
            label="Quick Timer"
            onClick={() => handleMenuAction('timer')}
            color="blue"
            delay="0ms" // Appear closest to button first? Or top down? Let's do bottom up stack. 
          // Actually usually closest pops first. So Timer (bottom) first.
          />
          <MenuButton
            icon={ClipboardList}
            label="New Protocol"
            onClick={() => handleMenuAction('protocol')}
            color="indigo"
            delay="225ms"
          // Wait, this ordering is top-to-bottom in code. Visually:
          // Top: Growth
          // ...
          // Bottom: Protocol? No Protocol was bottom. 
          // Start Growth (Top)
          // Start PCR
          // Quick Timer
          // New Protocol (Bottom)
          // Button (Plus)
          // Let's reverse delays so bottom happens first.
          />
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-[var(--md-outline-variant)] h-20 px-4 pb-4 pt-2 z-50 flex justify-around items-center transition-colors duration-300 safe-area-bottom">
        <NavItemMobile
          icon={Home}
          label="Home"
          isActive={currentView === 'dashboard'}
          onClick={() => onViewChange('dashboard')}
        />
        <NavItemMobile
          icon={ClipboardList}
          label="Protocols"
          isActive={currentView === 'protocols'}
          onClick={() => onViewChange('protocols')}
        />

        {/* Center Plus Button */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={handlePlusClick}
            className={`
              w-14 h-14 -mt-8 rounded-full shadow-lg
              flex items-center justify-center
              transition-all duration-300 active:scale-95
              ${isPlusMenuOpen
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rotate-45'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white dark:text-zinc-900'
              }
            `}
          >
            <Plus className="w-7 h-7 stroke-[2.5px]" />
          </button>
        </div>

        <NavItemMobile
          icon={Library}
          label="Library"
          isActive={currentView === 'experiments'}
          onClick={() => onViewChange('experiments')}
        />
        <NavItemMobile
          icon={Settings}
          label="Settings"
          isActive={currentView === 'settings'}
          onClick={() => onViewChange('settings')}
        />
      </nav>
    </>
  );
};

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ icon: Icon, label, isActive, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center rounded-xl
      transition-all duration-200 relative group
      ${isActive
        ? 'bg-zinc-900 dark:bg-emerald-400 text-white dark:text-zinc-900'
        : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-white/5 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
      }
      ${isCollapsed ? 'justify-center w-10 h-10 p-0 mx-auto gap-0' : 'justify-start w-full px-3 py-2.5 gap-3'}
    `}
    title={isCollapsed ? label : undefined}
  >
    <Icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />

    <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-24 opacity-100 ml-3'
      }`}>
      {label}
    </span>
  </button>
);

const NavItemMobile: React.FC<{ icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center gap-1 py-1 active:scale-95 transition-transform"
  >
    <div className={`
      px-5 py-1 rounded-full transition-colors duration-200
      ${isActive
        ? 'bg-zinc-900 dark:bg-emerald-400 text-white dark:text-zinc-900'
        : 'text-zinc-500 dark:text-zinc-400'
      }
    `}>
      <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
    </div>
    <span className={`text-xs font-medium ${isActive ? 'text-zinc-900 dark:text-emerald-400' : 'text-zinc-500'}`}>
      {label}
    </span>
  </button>
);

const MenuButton: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color: 'emerald' | 'purple' | 'blue' | 'indigo';
  delay?: string;
}> = ({ icon: Icon, label, onClick, color, delay = '0ms' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-zinc-900',
    purple: 'bg-purple-500 dark:bg-purple-400 text-white dark:text-zinc-900',
    blue: 'bg-blue-500 dark:bg-blue-400 text-white dark:text-zinc-900',
    indigo: 'bg-indigo-500 dark:bg-indigo-400 text-white dark:text-zinc-900'
  };

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: delay }}
      className={`
        glass-card
        ${colorClasses[color]}
        px-6 py-3 rounded-2xl
        flex items-center gap-3
        shadow-lg
        hover:shadow-xl hover:scale-105
        active:scale-95
        transition-all duration-200
        min-w-[200px]
        animate-in fade-in slide-in-from-bottom-8 zoom-in-50 duration-300 fill-mode-forwards
      `}
    >
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <Icon className="w-5 h-5 stroke-[2.5px]" />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};
