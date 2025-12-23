# Tasks

| Task ID | Description | Status | Dependency |
|---------|-------------|--------|------------|
| 1 | **Capacitor Integration**: Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`. Initialize Capacitor and configure `capacitor.config.ts`. Generate React build and sync to Android platform. | Done | None |
| 2 | **Design System Foundation**: Implement Material Design 3 tokens (Colors, Typography, Spacing) in `index.css` and `App.tsx`. | Done | 1 |
| 2b | **App Shell & Dashboard UI**: Apply "Premium" Glassmorphism design to App Shell and Dashboard component using new tokens. | Done | 2 |
| 3 | **Calculator Component Refactor**: Ensure robust logic (TS types) and apply new Design System. | Done | 2 |
| 4 | **Timer Component Refactor**: Ensure background reliability (Web Workers if needed) and apply new Design System. | Done | 2 |
| 5 | **Protocol Component Refactor**: Improve UX for stepping through protocols and apply new Design System. | Done | 2 |
| 6 | **Final Verification**: Test on Android (simulated) and validate PWA score. | Done | 3,4,5 |
| 8 | **PCR Module - Core**: Implement Tm calculation utility and Master Mix UI. | Future | None |
| 7 | **Backend Integration Research**: Select provider (Supabase/Firebase), design schema for User/Protocols. | Future | None |

| 9 | **Top Bar Refactor**: Remove logo text and theme button. Make background more glassy. | Done | 2 |
| 9b | **Top Bar Refinement**: Remove logo icon. Left-align mini timers on mobile with horizontal scroll. | Done | 9 |
| 10 | **Mobile Navigation Uplift**: Implement "Plus" FAB with cascading action menu for Timers/Experiments. Remove TopBar "New" button. | Done | 2 |
