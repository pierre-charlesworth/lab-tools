# Product Requirements Document (PRD)

## 1. Overview
A premium Lab Companion application designed for scientists to manage bacterial growth experiments, track lab protocols, and use multiple timers. The app is a responsive Progressive Web App (PWA) that is installable on Android devices.

## 2. Goals
- **Lab Companion**: effectively manage common lab tasks (calculations, timing, protocols).
- **Cross-Platform**: Fully responsive web app + Native Mobile Apps (via Capacitor).
- **Visual Excellence**: High-end, "premium" aesthetic with glassmorphism, dynamic animations, and vibrant colors. [Design Mock](file:///d:/Antigravity%20projects/Lab%20app/bio-app/biocalc_-od600-&-growth/spec/design/dashboard_mockup.png)
- **Theming**: Full Light/Dark mode support.
- **Offline Capable**: Works without internet (Native Bundle).

## 3. Success Metrics
- Successfully builds `.apk` for Android.
- User "WOW" factor on UI design.

## 4. Scope
### In Scope
- **Mobile Wrapper**: Capacitor integration for Android (APK) and iOS (IPA).
- **Bacterial Growth Calculator**: Calculate inoculation volumes, generation times, and lag times.
- **Multi-Timer System**: Run multiple named timers simultaneously (e.g., "Gel Run", "Incubation").
- **Protocol Manager**: Create, view, and check off steps for lab protocols.
- **Dashboard**: High-level view of active experiments and timers.

## 5. Future Roadmap
### Phase 2: Cloud & Community (The "Premium" Layer)
- **Authentication**: User login (Social + Email) to sync data across devices.
- **Persistence**: Save Protocols, Custom Experiments, and Timers to cloud DB.
- **Monetization**: "Pro" tier for advanced features (Unlimited history, AI generation quota).

### Phase 3: The PCR Module
- **Master Mix Builder**: Automated calculation of reagents with overage % and "check-off" UI.
- **Tm Calculator**: Accurate melting temperature prediction using Nearest-Neighbor thermodynamics.
- **Thermocycler Viz**: Visual editor for PCR programs (temps/times/cycles) that doubles as a run timer.
