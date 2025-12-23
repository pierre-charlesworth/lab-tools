
import React, { useState } from 'react';
import { Settings, FlaskConical, Plus, Library, Clock, Home, LineChart, ClipboardList, Dna } from 'lucide-react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onNewExperiment: () => void;
}

export const NavigationRail: React.FC<NavigationProps> = ({ currentView, onViewChange, onNewExperiment }) => {
  return (
    <nav className="hidden md:flex flex-col justify-between w-20 h-screen bg-white dark:bg-lab-card border-r border-zinc-200 dark:border-white/5 py-6 z-40 shrink-0 transition-colors duration-300">
      <div className="flex flex-col items-center gap-8">
        {/* App Logo - Resets to Dashboard */}
        <button 
          onClick={() => onViewChange('dashboard')}
          className="text-emerald-600 dark:text-emerald-500 hover:scale-110 transition-transform duration-200"
          title="BioCalc Home"
        >
          <FlaskConical className="w-8 h-8" />
        </button>

        {/* FAB - New Experiment */}
        <button
          onClick={onNewExperiment}
          className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center hover:shadow-md hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all active:scale-95 group"
          title="New Experiment"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Nav Items */}
        <div className="flex flex-col gap-4 w-full">
          <NavItem 
            icon={Home} 
            label="Home" 
            isActive={currentView === 'dashboard'} 
            onClick={() => onViewChange('dashboard')} 
          />
          <NavItem 
            icon={ClipboardList} 
            label="Protocols" 
            isActive={currentView === 'protocols'} 
            onClick={() => onViewChange('protocols')} 
          />
          <NavItem 
            icon={LineChart} 
            label="Growth" 
            isActive={currentView === 'calculator'} 
            onClick={() => onViewChange('calculator')} 
          />
          <NavItem 
            icon={Clock} 
            label="Timers" 
            isActive={currentView === 'timers'} 
            onClick={() => onViewChange('timers')} 
          />
          <NavItem 
            icon={Library} 
            label="Library" 
            isActive={currentView === 'experiments'} 
            onClick={() => onViewChange('experiments')} 
          />
          <NavItem 
            icon={Settings} 
            label="Settings" 
            isActive={currentView === 'settings'} 
            onClick={() => onViewChange('settings')} 
          />
        </div>
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
        <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <MenuButton
            icon={FlaskConical}
            label="Start Growth"
            onClick={() => handleMenuAction('growth')}
            color="emerald"
          />
          <MenuButton
            icon={Dna}
            label="Start PCR"
            onClick={() => handleMenuAction('pcr')}
            color="purple"
          />
          <MenuButton
            icon={Clock}
            label="Quick Timer"
            onClick={() => handleMenuAction('timer')}
            color="blue"
          />
          <MenuButton
            icon={ClipboardList}
            label="New Protocol"
            onClick={() => handleMenuAction('protocol')}
            color="indigo"
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

const NavItem: React.FC<{ icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 w-full py-2 relative group"
  >
    <div className={`
      w-14 h-8 rounded-full flex items-center justify-center transition-colors duration-200
      ${isActive 
        ? 'bg-zinc-900 dark:bg-emerald-400 text-white dark:text-zinc-900' 
        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 dark:text-zinc-400'
      }
    `}>
      <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
    </div>
    <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-zinc-900 dark:text-emerald-400' : 'text-zinc-500'}`}>
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
  color: 'emerald' | 'purple' | 'blue' | 'indigo'
}> = ({ icon: Icon, label, onClick, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-zinc-900',
    purple: 'bg-purple-500 dark:bg-purple-400 text-white dark:text-zinc-900',
    blue: 'bg-blue-500 dark:bg-blue-400 text-white dark:text-zinc-900',
    indigo: 'bg-indigo-500 dark:bg-indigo-400 text-white dark:text-zinc-900'
  };

  return (
    <button
      onClick={onClick}
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
      `}
    >
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <Icon className="w-5 h-5 stroke-[2.5px]" />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};
