# Implementation Plan - Style Alignment (PCR vs Growth Calc)

## Goal
Harmonize the visual design of the **PCR Module** (`PrimerAnalyst`, `MasterMix`, `VisualCycler`) to match the user-preferred **Growth Calculator** style.
Specifically, we will adopt the "Material 3" split-header card design and standardized input fields (`M3TextField` style).

## Design Pattern (Source of Truth: `Calculator.tsx`)
*   **Card Structure**:
    ```tsx
    <div className="glass-card rounded-[var(--md-radius-lg)]">
      {/* Header */}
      <div className="bg-[var(--md-surface-container)] px-6 py-5 rounded-t-[var(--md-radius-lg)] border-b border-[var(--md-outline-variant)] flex items-center gap-3">
         {/* Icon + Title */}
      </div>
      {/* Body */}
      <div className="p-6">
         {/* Content */}
      </div>
    </div>
    ```
*   **Radius**: Use `[var(--md-radius-lg)]` instead of `rounded-2xl`.
*   **Inputs**: Use `M3TextField` pattern or "Filled + Underline" style instead of "Outlined Box".

## Proposed Changes

### 1. `components/pcr/PrimerAnalyst.tsx`
*   [MODIFY] Refactor the main "Primer Analyst" card to use the **Split Header** structure.
*   [MODIFY] Update `<textarea>` styles:
    *   Remove `border` (outlined look).
    *   Add `bg-[var(--md-surface-container-high)]` or `bg-[var(--md-surface-variant)]` to look like a filled field.
    *   Add bottom border/underline focus state to mimic M3.

### 2. `components/pcr/MasterMix.tsx`
*   [MODIFY] Standardize the 3 main cards ("Kit Selector", "Input Controls", "Master Mix Table"):
    *   Apply standard **Split Header** structure to each.
    *   Move the icons/titles from the top-level page header into the first card's header or keep page header but style cards consistently. *Decision: Keep Page Header as H1, but style inner sections as proper Cards with Headers.*
*   [MODIFY] Inputs:
    *   Replace standard `<input>` and `<select>` with `M3TextField` component where possible, or replicate the style manually for `<select>`.

### 3. `components/pcr/VisualCycler.tsx`
*   [MODIFY] Refactor the main "Thermocycler Visualizer" card to **Split Header**.
*   [MODIFY] Protocol Parameters inputs:
    *   Update the grid of small inputs to use the "Filled + Underline" style (less visual noise than full borders).

## Verification Plan
### Manual Verification
*   **Browser Check**:
    1.  Navigate to **PCR Module**.
    2.  **Verify**: Primer Analyst card looks identical in structure to the Growth Calculator "Parameters" card (Gray header, white/glass body).
    3.  **Verify**: Master Mix cards have distinct headers.
    4.  **Verify**: Inputs look cleaner (no heavy gray borders, standardized focus states).
    5.  **Check**: Dark mode appearance matches Growth Calc.
