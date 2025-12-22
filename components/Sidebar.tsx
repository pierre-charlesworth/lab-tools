
import React from 'react';
import {
  Home,
  FlaskConical,
  Clock,
  ClipboardList,
  Library,
  Settings,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
      ${isActive
        ? 'bg-[var(--md-primary)]/10 text-[var(--md-primary)] font-semibold'
        : 'text-[var(--md-on-surface-variant)] hover:bg-[var(--md-surface-container-high)]'
      }
    `}
  >
    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
    <span className="text-sm">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isDarkMode,
  onToggleTheme
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen glass-panel shrink-0 transition-all duration-300">
      {/* Logo & Brand */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-secondary)] flex items-center justify-center shadow-lg">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--md-on-surface)]">NEXUS</h1>
            <p className="text-xs text-[var(--md-on-surface-variant)] uppercase tracking-wide">Scientific</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        <NavItem
          icon={Home}
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => onViewChange('dashboard')}
        />
        <NavItem
          icon={FlaskConical}
          label="Experiments"
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
          icon={ClipboardList}
          label="Protocols"
          isActive={currentView === 'protocols'}
          onClick={() => onViewChange('protocols')}
        />
        <NavItem
          icon={Library}
          label="Library"
          isActive={currentView === 'experiments'}
          onClick={() => onViewChange('experiments')}
        />

        <div className="pt-4 mt-4 border-t border-[var(--md-outline-variant)]">
          <NavItem
            icon={Settings}
            label="Settings"
            isActive={currentView === 'settings'}
            onClick={() => onViewChange('settings')}
          />
        </div>
      </nav>

      {/* Theme Toggle & User */}
      <div className="p-4 border-t border-[var(--md-outline-variant)] space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--md-surface-container)] hover:bg-[var(--md-surface-container-high)] transition-colors group"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
            ) : (
              <Sun className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
            )}
            <span className="text-sm text-[var(--md-on-surface-variant)]">
              {isDarkMode ? 'Dark' : 'Light'} Mode
            </span>
          </div>
          <div className={`
            w-11 h-6 rounded-full p-0.5 transition-colors
            ${isDarkMode ? 'bg-[var(--md-primary)]' : 'bg-[var(--md-outline)]'}
          `}>
            <div className={`
              w-5 h-5 rounded-full bg-white shadow-md transition-transform
              ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}
            `} />
          </div>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card cursor-pointer hover:bg-[var(--md-surface-container)] transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-secondary)] flex items-center justify-center text-white shadow-md">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--md-on-surface)] truncate">Dr. Anya Sharma</p>
            <p className="text-xs text-[var(--md-on-surface-variant)] truncate">Lab Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
