---
name: ENGINSPECT Design System
description: Highly precise Modern Industrial Tech interface for energy audits.
colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  bg-light: "#f8fafc"
  bg-dark: "#030712"
  surface-light: "#ffffff"
  surface-dark: "#0b0f19"
  border-light: "#e2e8f0"
  border-dark: "#1e293b"
  text-light: "#0f172a"
  text-dark: "#f8fafc"
  accent-good: "#10b981"
  accent-bad: "#ef4444"
  accent-warn: "#f59e0b"
typography:
  display:
    fontFamily: "IBM Plex Sans Thai, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Sans Thai, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

# Design System: ENGINSPECT

## 1. Overview

**Creative North Star: "The Control Room"**

ENGINSPECT is an industrial telemetry and energy inspection dashboard. The design system mimics a physical power grid control room: clean grid structures, highly dense but legible tables, clear state indicators, and functional status coloring. It rejects decorative elements like gradient text, side-stripe card accents, and heavy glassmorphism, steering instead toward a crisp, high-contrast, state-of-the-art layout.

**Key Characteristics:**
- **Strict Information Density**: Avoid artificial white space. Lay out data in responsive grids or high-contrast tables.
- **Dynamic Theming**: Flawless light and dark mode integration, maintaining a minimum 4.5:1 text-to-background contrast ratio.
- **Refined Interactivity**: Light hover lifts, smooth micro-interactions, and clear focus states.

## 2. Colors

A modern high-contrast scheme using custom CSS variables mapped to light/dark themes. Status signaling uses semantic color pairs with strict legibility targets.

### Primary
- **Indigo Accent** (`#4f46e5` / `#818cf8`): Primary action indicators, selections, and interactive states.

### Neutral
- **Background** (`#f8fafc` / `#030712`): High-contrast clean canvases.
- **Surface** (`#ffffff` / `#0b0f19`): Flat container bases.
- **Slate Text** (`#0f172a` / `#f8fafc`): Crisp readability.
- **Muted Ink** (`#64748b` / `#94a3b8`): Subtitle text and tertiary metrics.

### Status Accents
- **Good/Savings** (`#10b981` / `#34d399`): Indicates green energy savings and active measures.
- **Alert/Bad** (`#ef4444` / `#f87171`): Indicates high carbon emissions or critical equipment issues.
- **Warning/Warn** (`#f59e0b` / `#fbbf24`): Indicates minor defects or optimization suggestions.

**The Functional Color Rule.** Color carries functional information. Do not color text or icons unless representing a status change or a primary call-to-action.

## 3. Typography

**Display Font:** IBM Plex Sans Thai (with sans-serif fallback)
**Body Font:** IBM Plex Sans Thai (with sans-serif fallback)
**Label/Mono Font:** Share Tech Mono (for numeric readings and specs)

### Hierarchy
- **Display** (Bold 700, size clamp(2.5rem, 5vw, 4rem), line-height 1.1): Hero page headers and main metrics.
- **Headline** (Semi-bold 600, size 1.5rem to 2rem, line-height 1.2): Section titles.
- **Title** (Medium 500, size 1.125rem to 1.25rem, line-height 1.3): Cards and container headers.
- **Body** (Regular 400, size 1rem, line-height 1.5): Descriptive text (constrained to 65–75ch for prose).
- **Label** (Medium 500, size 0.75rem to 0.875rem, letter-spacing 0.05em, uppercase): Section kickers, tag identifiers, and table headers.

**The IBM Plex Doctrine.** The IBM Plex Thai typeface should render clean curves and crisp rendering. Pair it with Share Tech Mono for raw equipment tag numbers and telemetry readouts.

## 4. Elevation

The elevation model relies on flat container surfaces separated by high-contrast border strokes. Subtle ambient drop shadows appear only as transition responses (hovering cards/buttons or modal overlays).

### Shadow Vocabulary
- **Interactive Hover** (`0 12px 24px -10px rgba(0, 0, 0, 0.15)`): Used on card hovers to lift and call attention.
- **Overlay/Modal** (`0 20px 25px -5px rgba(0, 0, 0, 0.1)`): Standard backdrop shadow for dialogs.

**The Flat-By-Default Rule.** Surfaces must lay flat in light/dark states. Elevation via shadow indicates temporary action states or stacking order, never styling.

## 5. Components

### Buttons
- **Shape:** Soft-curved corners (6px, `var(--rounded-md)`).
- **Primary:** Solid color (`var(--accent)`), white text.
- **Hover / Focus:** Slightly darker (`var(--accent-hover)`) with standard `outline-none ring-2 ring-accent`.

### Cards / Containers
- **Corner Style:** Medium curved (8px, `var(--rounded-lg)`).
- **Background:** `var(--card)` with `border border-border`.
- **Shadow Strategy:** Flat at rest, lifts slightly on hover (`hover-lift`).
- **Internal Padding:** Custom grid gaps (16px to 24px).

### Inputs / Fields
- **Style:** Flat background (`var(--bg)`), subtle border (`var(--border)`).
- **Focus:** Highlighted border (`var(--accent)`) with shadow glow.

## 6. Do's and Don'ts

### Do:
- **Do** maintain crisp, readable text with contrast ratios above 4.5:1.
- **Do** use `Share Tech Mono` for numerical telemetry readings (e.g., energy consumption, COP values, and equipment tags).
- **Do** align tables and lists to functional grid cells.

### Don't:
- **Don't** use decorative side-stripe colored borders on cards.
- **Don't** use text gradients under any circumstances.
- **Don't** use glassmorphism decoratively on standard page cards.
- **Don't** allow text overflow on mobile viewports; enforce responsive wrap and size clamps.
