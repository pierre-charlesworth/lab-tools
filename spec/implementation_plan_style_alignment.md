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
         {/* Icon (No Background) */}
         <Icon className="text-[var(--md-primary)] w-5 h-5" />
         {/* Title (Text Only, No Subtitle) */}
         <h2 className="text-lg font-semibold font-sans tracking-wide text-[var(--md-on-surface)]">Title</h2>
      </div>
      {/* Body */}
      <div className="p-6">
         {/* Content */}
      </div>
    </div>
    ```
*   **Icons**: Remove background `div`. Use raw icon with `text-[var(--md-primary)] w-5 h-5`.
*   **Subtitles**: REMOVE from header. Move content to tooltips or info icons if critical.
*   **Inputs**:
    *   **REQUIREMENT**: usage of `M3TextField` is **MANDATORY** for all inputs, textareas, and selects app-wide.
    *   **Exceptions**: Hidden inputs, highly custom interactive elements (e.g., sliders).

## Prerequisite: Upgrade `M3TextField`
Before refactoring components, we must upgrade `components/ui/M3TextField.tsx` to support:
1.  **Multiline (`textarea`)**: Add `multiline?: boolean` prop. If true, render `textarea` with consistent floating label styling.
2.  **Select (`select`)**: Add `options?: { label: string, value: string }[]` prop. If present, render `select`.
3.  **Strict Typing**: Ensure props cover all use cases.

## Proposed Changes

### 1. `components/pcr/PrimerAnalyst.tsx`
*   [MODIFY] Header: Remove icon background, remove subtitle, match fonts.
*   [MODIFY] Inputs: Replace `textarea` with `<M3TextField multiline rows={4} ... />`.

### 2. `components/pcr/MasterMix.tsx`
*   [MODIFY] Headers: Remove icon background, remove subtitles.
*   [MODIFY] Inputs: Replace all `input` and `select` with `<M3TextField ... />`.

### 3. `components/pcr/VisualCycler.tsx`
*   [MODIFY] Header: Remove icon background, remove subtitle.
*   [MODIFY] Inputs: Replace protocol parameter inputs with `<M3TextField ... />`.

### 4. `components/Calculator.tsx` & Global
*   [MODIFY] `Calculator.tsx`: Replace "Exp Name" input with `<M3TextField variant="standard" ... />` or similar if keeping the underline-only look, OR switch to full M3 style for consistency. **Decision: Switch to standard M3TextField for consistency unless it breaks layout.**
*   [MODIFY] `components/AIHelper.tsx`: Replace inputs with `<M3TextField>`.
*   [MODIFY] `components/AIProtocolModal.tsx`: Replace textarea with `<M3TextField multiline>`.

## Verification Plan
### Manual Verification
*   **Browser Check**:
    1.  Navigate to **PCR Module**.
    2.  **Verify**: Primer Analyst card looks identical in structure to the Growth Calculator "Parameters" card (Gray header, white/glass body).
    3.  **Verify**: Master Mix cards have distinct headers.
    4.  **Verify**: Inputs look cleaner (no heavy gray borders, standardized focus states).
    5.  **Check**: Dark mode appearance matches Growth Calc.
