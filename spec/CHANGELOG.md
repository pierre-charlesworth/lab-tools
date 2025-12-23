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
