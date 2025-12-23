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
| 8a | **PCR - Primer Analyst**: Real-time Tm calc (Nearest Neighbor), GC warning traffic lights, 3' stability check. | Done | None |
| 8b | **PCR - Master Mix**: Interactive reaction setup, "One-Touch" overfill, DMSO additive logic, "Check-off" mode. | Done | 8a |
| 8c | **PCR - Visual Cycler**: "Digital Twin" thermal profile graph, ramp-rate aware timer, stage animations. | Done | 8b |
| 7 | **Backend Integration Research**: Select provider (Supabase/Firebase), design schema for User/Protocols. | Future | None |

| 9 | **Top Bar Refactor**: Remove logo text and theme button. Make background more glassy. | Done | 2 |
| 9b | **Top Bar Refinement**: Remove logo icon. Left-align mini timers on mobile with horizontal scroll. | Done | 9 |
| 10 | **Mobile Navigation Uplift**: Implement "Plus" FAB with cascading action menu for Timers/Experiments. Remove TopBar "New" button. | Done | 2 |
| 10b | **Top Bar Material Fix**: Match Top Bar glass effect to Bottom Nav (translucent blur). | Done | 10 |

| 11 | **Library Module - Core**: Implement "Save to Library" for Growth/Timers and "Recall" functionality. | Future | 2,7 |
| 12 | **Desktop Nav Refactor**: align sidebar options with mobile (Add PCR), add collapsible state (mini-sidebar). | Done | 10 |
| 13 | **PCR Refinements**: Compact Primer inputs, multi-kit Master Mix dropdown, real-time scrolling Cycler graph. | Done | 10 |
