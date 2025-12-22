# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Executor Rules (STRICT)

## Role
You are the Executor. You implement EXACTLY ONE task.

## Read
- [spec/PRD.md](spec/PRD.md)
- [spec/TASKS.md](spec/TASKS.md)
- [spec/CONTEXT.md](spec/CONTEXT.md)
- [handoff/current_task.json](handoff/current_task.json)

## Do
- Implement ONLY the task in [handoff/current_task.json](handoff/current_task.json)
- Follow existing repo conventions
- Add/update tests required by acceptance criteria
- Run ONLY the commands listed in `tests`

## Write (always)
- [handoff/claude_output.md](handoff/claude_output.md)
- [handoff/test_results.txt](handoff/test_results.txt)
- [handoff/status.json](handoff/status.json)
- Optional: [handoff/changes.diff](handoff/changes.diff)

## Stop Conditions
- If any test fails → status=blocked, tests_passed=false
- If touching files outside `files_allowed` is required → status=blocked
- Do NOT start another task until [handoff/current_task.json](handoff/current_task.json) changes

## Output Discipline
- All results go to files, not chat
- No speculative refactors
- No task chaining

---

# Project Overview

**Lab Companion App**: A premium Progressive Web App for scientists to manage bacterial growth experiments, multi-timers, and lab protocols. Built with React + Vite + TypeScript. Target: Android APK via Capacitor (installable PWA).

## Core Features
1. **Bacterial Growth Calculator**: OD600-based inoculation volume, generation time, lag time calculations
2. **Multi-Timer System**: Multiple concurrent named timers for lab tasks
3. **Protocol Manager**: Step-by-step lab protocols with integrated timers
4. **Dashboard**: Active experiments and timers overview

## Design Philosophy
- **Visual Excellence**: Glassmorphism, premium aesthetics, dark mode, animations
- **Mobile-First**: Responsive design, installable PWA
- **Offline Capable**: Must work without internet (Phase 2: cloud sync)

---

# Development Commands

## Essential Commands
```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Capacitor sync (after build)
npx cap sync android
```

## Environment Variables
- `GEMINI_API_KEY`: Required for AI protocol generation (set in `.env.local`)

---

# Architecture

## Tech Stack
- **Frontend**: React 19.2 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Vanilla CSS with Tailwind-style utility classes (existing codebase uses `className="flex..."` patterns)
- **State Management**: React `useState` / `useEffect` (local state only, no global store yet)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Mobile**: Capacitor (Android/iOS target)

## Project Structure
```
/
├── components/          # React components (*.tsx)
│   ├── Calculator.tsx   # Growth calculation logic + UI
│   ├── TimerView.tsx    # Multi-timer interface
│   ├── ProtocolView.tsx # Protocol step management
│   ├── DashboardView.tsx
│   ├── Navigation.tsx   # NavigationRail + BottomNavigation
│   └── AI*.tsx          # Gemini-powered protocol generation
├── services/            # External integrations
│   └── geminiService.ts # Google Gemini AI API wrapper
├── utils/               # Pure functions
│   └── calculations.ts  # Bacterial growth math (OD, doubling time, etc.)
├── spec/                # Product requirements and task tracking
│   ├── PRD.md           # Product Requirements Document
│   ├── TASKS.md         # Task backlog
│   ├── CONTEXT.md       # Repository conventions
│   └── DECISIONS.md     # Architecture decision log
├── handoff/             # Claude execution handoff protocol
│   ├── current_task.json  # Active task definition
│   ├── status.json        # Task completion status
│   ├── claude_output.md   # Implementation notes
│   └── test_results.txt   # Test execution output
├── types.ts             # Global TypeScript types
├── App.tsx              # Root component, view routing
└── vite.config.ts       # Vite configuration (aliases, env vars)
```

## Key Type Definitions ([types.ts](types.ts))
- `Experiment`: Tracks a single bacterial growth calculation with optional real-time tracking
- `StandaloneTimer`: Individual timer with pause/resume/completion states
- `Protocol`: Multi-step lab procedure with timer/experiment actions
- `CalculationResult`: Output of bacterial growth math (inoculum volume, harvest time, etc.)
- `View`: App navigation state ('dashboard' | 'calculator' | 'timers' | 'protocols' | 'settings')

## State Management Pattern
- **App.tsx**: Top-level state for experiments, timers, protocols, active view
- **Component Props**: State and updater functions passed down
- **No Global Store**: All state managed via React hooks (useState, useEffect)
- **Future**: Consider Context API or Zustand for complex state

## Calculation Engine ([utils/calculations.ts](utils/calculations.ts))
- Exponential growth model: `OD(t) = OD₀ × 2^((t - lag) / doublingTime)`
- Modes: `total_volume` (calculate inoculum for target volume) vs `fixed_media` (calculate final volume)
- Outputs: inoculum volume, media volume, harvest time, growth curve data points

## Styling Conventions
- **Existing Pattern**: Tailwind-style utility classes (`className="flex h-screen bg-..."`)
- **Glassmorphism**: `backdrop-blur-md`, semi-transparent backgrounds
- **Dark Mode**: Default dark theme with vibrant accent colors
- **Responsive**: Mobile-first breakpoints

## Path Aliases
- `@/*` resolves to project root (configured in [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts))

---

# Workflow Notes

## Handoff Protocol
This project uses a **Planner/Executor** workflow:
1. **Gemini Agent (Planner)** defines tasks in [handoff/current_task.json](handoff/current_task.json)
2. **Claude Code (Executor)** implements the task, writes results to `handoff/`
3. **Planner** reviews output, issues next task or FIX task

## When Implementing Tasks
1. Read [handoff/current_task.json](handoff/current_task.json) for task definition
2. Check `files_to_edit` (scope constraint)
3. Run `test_command` to validate changes
4. Write execution summary to [handoff/claude_output.md](handoff/claude_output.md)
5. Copy test output to [handoff/test_results.txt](handoff/test_results.txt)
6. Update [handoff/status.json](handoff/status.json):
   ```json
   {
     "task_id": "...",
     "status": "completed" | "blocked",
     "tests_passed": true | false,
     "timestamp": "..."
   }
   ```

## Task Constraints
- Touch ≤ 3 code files per task (excluding tests)
- One primary goal per task
- Completable in one execution
- Must include exact test command

---

# Important Notes

## API Keys
- Gemini API key injected via Vite's `define` ([vite.config.ts:14-15](vite.config.ts#L14-L15))
- Access via `process.env.GEMINI_API_KEY`

## Mobile Considerations
- Capacitor integration pending (Task 1 in [spec/TASKS.md](spec/TASKS.md))
- PWA manifest + service worker required
- Responsive design: Navigation rail (desktop) vs bottom nav (mobile)

## Future Phases
- **Phase 2**: User authentication, cloud persistence (Supabase/Firebase)
- **Phase 3**: PCR module (master mix calculator, Tm calculator, thermocycler visualizer)
