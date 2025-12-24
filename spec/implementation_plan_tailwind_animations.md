# Implementation Plan - Refactor Animations to Tailwind

## Goal
Replace custom CSS keyframe animations (currently polyfilled in `index.css`) with standard Tailwind CSS utility classes using the `tailwindcss-animate` plugin. This ensures consistency and leverages the utility-first approach.

## Proposed Changes

### 1. Install Dependencies
*   [NEW] Install `tailwindcss-animate` plugin.
    *   Command: `npm install -D tailwindcss-animate`
*   [MODIFY] `tailwind.config.js` (if exists) or verify `index.css` setup. Since we don't see a `tailwind.config.js` in the file list (Wait, checking root...), we might need to create one or ensure the plugin is loaded if using a standard Vite setup.
    *   *Note*: If `tailwind.config.js` is missing, we will create it to register the plugin.

### 2. Remove Custom CSS (`index.css`)
*   [DELETE] Remove the entire "Animations (Polyfill)" section from `index.css` (lines 235-309).
    *   Keyframes: `fadeIn`, `zoomIn`, `slideInFromLeft`, `slideInFromBottom`, `popInRight`, `popInUp`.
    *   Classes: `.animate-in`, `.fade-in`, etc.

### 3. Update Components (`Navigation.tsx`)
*   [MODIFY] `components/Navigation.tsx`:
    *   The current class names used (`animate-in`, `fade-in`, `zoom-in-50`, `slide-in-from-bottom-8`) are actually **compatible** with `tailwindcss-animate`.
    *   We just need to ensure the plugin is providing them instead of our custom CSS.
    *   We verify that the `animation-delay` via `style={{ animationDelay: '...' }}` still works (it should, as standard CSS styles override).

## Verification Plan
### Automated
*   **Build Test**: Run `npm run build` to ensure the CSS generation works without the custom polyfills.

### Manual Verification
*   **Browser Check**:
    1.  Open Mobile View (F12 > Device Toolbar).
    2.  Click the "Plus" button in the bottom navigation.
    3.  **Verify**: The cascading menu buttons (Growth, PCR, Timer, Protocol) pop up sequentially with a slide + fade + zoom effect.
    4.  Open Desktop View.
    5.  Click "New" sidebar button.
    6.  **Verify**: The side menu pops out with similar effects.
