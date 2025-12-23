# Animation Concepts: "New" Menu

To match the "Premium Glassmorphism" aesthetic, animations should be fluid, physics-based (springs), and use staggering to reduce cognitive load.

## Option A: The "Reaction" Pop (Recommended) - *Experimental & Organic*
Items spring out from the source button with a slight scale and blur transition.
- **Vibe**: Interactive, playful, "alive".
- **Technical**: `scale-90 opacity-0` -> `scale-100 opacity-100` with `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring-like).
- **Stagger**: 50ms delay per item.
- **Match**: Fits the "BioCalc" organic theme perfectly.

## Option B: The "Lab Drawer" Slide - *Clean & Professional*
Items slide in from the left (desktop) or bottom (mobile) with a dry friction ease.
- **Vibe**: Precise, mechanical, efficient.
- **Technical**: `translate-x-[-10px]` -> `translate-x-0`.
- **Match**: Good for strict utility apps, but maybe too standard.

## Option C: The "Glass" Fade - *Subtle & Elegant*
A slow, ethereal fade-in with a backdrop blur intensifying.
- **Vibe**: High-end, calm.
- **Technical**: Pure `opacity` + `backdrop-filter` transition.
- **Match**: Very classy, but might feel "slow" for frequent actions.

## Proposal
Implement **Option A (Reaction Pop)** with a **staggered entry**.
- **Mobile**: Items float up from the FAB.
- **Desktop**: Items pop out to the right of the sidebar.
