# Changelog

## Task 1 - Capacitor Integration
- **Status**: Issued
- **Goal**: Initialize Native Android project.
- **Changes**:
  - Install capacitor dependencies.
  - Create `capacitor.config.ts`.
  - Add `android` platform.

## Task 6 - Final Verification
- **Status**: Completed
- **Goal**: Verify production build and mobile flows.
- **Results**:
  - ✅ Production build passed.
  - ✅ Android config verified.
  - ✅ All core flows (Calc, Timer, Protocol) verified on mobile layout.
  - ⚠️ PWA features pending (future task).

## Task 9 - Top Bar Refactor
- **Status**: Completed
- **Goal**: Minimalist redesign of Top Bar.
- **Changes**: Removed logo text and theme button. Increased background transparency.

## Task 9b - Top Bar Refinement
- **Status**: Completed
- **Goal**: Refine layout based on user feedback.
- **Changes**: Removed `FlaskConical` logo icon. Left-aligned timer cards container on mobile.

## Task 10 - Mobile Navigation Uplift
- **Status**: Completed
- **Goal**: Center Plus navigation with cascading menu.
- **Changes**:
  - Implemented 5-slot bottom bar with Center Plus button (-mt-8 poke out).
  - Added Cascading Action Menu (Growth, PCR, Timer, Protocol).
  - Removed "Growth" and "Timers" tabs.
  - Removed Top Bar "New" button on mobile.

## Task 10b - Top Bar Material Fix
- **Status**: Completed
- **Goal**: Standardize glassmorphism.
- **Changes**: Applied `glass-panel` class and variable border color to TopBar to match Bottom Nav.

## Task 8a - PCR Primer Analyst
- **Status**: Completed
- **Goal**: Real-time validation of PCR primers.
- **Changes**:
  - Implemented Nearest-Neighbor Tm engine (SantaLucia 1998).
  - Created Primer Analyst UI with real-time feedback.
  - Added Traffic Light system (Green/Yellow/Red) for Tm and GC quality.

## Task 8b - PCR Master Mix
- **Status**: Completed
- **Goal**: Kit-aware Master Mix Calculator.
- **Changes**:
  - Implemented `PCRKitPreset` system with "NEB Q5" data.
  - Created interactive Calculator with Overfill logic (+10%).
  - Added "Enhancer" toggle that dynamically replaces water volume.
