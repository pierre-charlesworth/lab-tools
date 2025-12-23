# Context

## repository conventions
- **Stack**: React, Vite, TypeScript.
- **Styling**: Vanilla CSS (preferred) or TailwindCSS (if verified). *User specified Vanilla CSS priority in system prompt, but project has tailwind tokens in App.tsx classes? Code analysis shows `className="flex..."` which is Tailwind. will assume Tailwind is acceptable/used.* -> **Correction**: System prompt says "Avoid using TailwindCSS unless the USER explicitly requests it". However, this is an *existing* project being ported. The `App.tsx` has `className="flex h-screen..."`. I must respect the existing codebase style which is Tailwind. I will document this.
- **State Management**: React `useState` / `useEffect` (currently). Consider Context or Zustand for complex state.
- **Linting**: Standard ESLint/Prettier.

## commands
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.

## boundaries
- **No Backend**: Client-side logic only for now.
- **Single Codebase**: Web and Mobile (Android/iOS) share the exact same main branch. No separate "mobile" branch required.
- **State Strategy**: Currently Local-Only. "Active Timers" do not sync between devices until Cloud Phase (Supabase) is implemented. Wait for "Backend Integration" task.
- **PWA**: Must have `manifest.json` and Service Worker.
- **Design**: "Visual Excellence" is a hard requirement. Glassmorphism, dark mode, animations.

## user_rules
- **Planner Persona**: I (Agent) do not write code directly. I plan tasks for a "Handoff" workflow. **Exception**: I may perform "Hotfixes" (direct code edits) ONLY when explicitly requested by the User for immediate polish/fixes.
