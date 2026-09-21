---
name: Discovery Engine
colors:
  surface: '#faf9fd'
  surface-dim: '#dbd9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#414754'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#575f6b'
  on-secondary: '#ffffff'
  secondary-container: '#dbe3f1'
  on-secondary-container: '#5d6571'
  tertiary: '#805600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a06d00'
  on-tertiary-container: '#0a0400'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#dbe3f1'
  secondary-fixed-dim: '#bfc7d4'
  on-secondary-fixed: '#141c26'
  on-secondary-fixed-variant: '#3f4752'
  tertiary-fixed: '#ffddb0'
  tertiary-fixed-dim: '#ffba45'
  on-tertiary-fixed: '#281800'
  on-tertiary-fixed-variant: '#614000'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  title-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  metric-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an enterprise-grade UX research intelligence interface tailored for high-velocity user synthesis and qualitative-to-quantitative feedback analysis. The visual aesthetic is rooted in modern, high-clarity corporate utility—balancing deep informational density with breathable, structured composition inspired by Google's institutional analytical tooling.

### Personality & Emotional Tenor
- **Rigorous & Authoritative:** The interface prioritizes raw data legibility, structured taxonomies, and clear visual hierarchy so researchers can extract insights without cognitive drag.
- **Calm & Focused:** A predominantly neutral ground with purposeful, restrained chromatic highlights prevents visual fatigue across multi-hour research analysis sessions.
- **Tactile & Precise:** Micro-interactions, clear boundary definition, and consistent structural rhythm communicate predictability, speed, and platform reliability.

### Design Movement
The style synthesizes **Corporate Modernism** with clean **Surface Layering**: crisp hairline contours, subtle ambient depth, pure utilitarian geometry, and distinct color-coded semantic state signaling.

## Colors

The palette leverages high-contrast functional hues mapped to specific informational intents:

- **Primary (`#1A73E8`):** Applied strictly to focal actions, key selection indicators, active navigation tabs, and primary analytical anchors.
- **Surface Secondary (`#E8F0FE`):** Soft contextual fill used for active item backgrounds, selected table rows, subtle pill tags, and interactive hover surfaces.
- **Accent Warning (`#F9AB00`):** Reserved for moderate sentiment flags, pending feedback triage items, and trending alert clusters.
- **Semantic Success (`#1E8E3E`):** Represents positive sentiment scores, statistical improvements, and verified findings.
- **Semantic Error (`#D93025`):** Reserved for user experience regressions, high-severity bug escalations, and critical customer churn markers.
- **Canvas & Elevation Tokens:**
  - **Background Canvas (`#F8F9FA`):** Low-strain neutral backcloth that establishes separation from white structural modules.
  - **Card / Surface Default (`#FFFFFF`):** High-clarity foreground surface container for widgets, charts, lists, and modal drawers.
  - **Text Primary (`#202124`):** High-contrast, maximum legibility for titles, data readouts, and core feedback transcripts.
  - **Text Secondary (`#5F6368`):** Balanced contrast for metric labels, contextual timestamps, and meta descriptions.
  - **Structural Outline / Divider (`#E0E0E0`):** Single-pixel perimeter framing to prevent visual bleeding without introducing visual clutter.

## Typography

Typography prioritizes tabular clarity and rapid scanning. Inter is utilized as the primary font family to deliver uniform readability across mixed qualitative feedback snippets and dense analytical KPI widgets.

- **Display & Headline Hierarchy:** Reserved for primary dashboards, synthesis titles, and executive overviews. Weights sit strictly at `600` (Semi-Bold) with tight letter-spacing to prevent sprawling display titles.
- **Data & Metric Display:** Analytical callouts leverage `metric-display` with tabular numbers (`tnum`) enabled via OpenType features to preserve columnar alignment during continuous data streaming.
- **Transcripts & Feedback Body:** Qualitative feedback quotes adopt `body-lg` or `body-md` in regular weight (`400`) to guarantee high legibility across long research logs.
- **Labels & System Meta:** Micro-data (confidence intervals, tag counters, sentiment labels) uses `label-md` and `label-sm` with slight positive tracking for crispness at smaller pixel scales.

## Layout & Spacing

The layout structure enforces a rigorous multi-tier fluid grid system, adapting continuously between widescreen multi-chart analyst workbenches and portable laptop viewports.

### Grid Architecture
- **Desktop (1200px+):** 12-column layout with fixed 240px collapsable left navigation rail, `1.5rem` (`margin`) canvas margin, and `1rem` (`gutter`) column gaps. Multi-card dashboard widgets align to 3, 4, 6, or 12 column widths.
- **Tablet (768px – 1199px):** 8-column layout with `1rem` gutters. Collapses research filtering rails into an expandable sliding off-canvas sheet.
- **Mobile (Below 768px):** 4-column layout with `0.75rem` (`gutter-mobile`) gutters and `1rem` (`margin-mobile`) horizontal canvas paddings.

### Rhythm Principles
- Component interior padding relies on `space-md` (16px) for standard widget cards and `space-sm` (8px) for tightly stacked list clusters.
- Vertical component gaps follow strict multiples of 4px, ensuring that complex filter bars and table toolbars maintain horizontal scan-line discipline.

## Elevation & Depth

This design system uses a combination of crisp, low-contrast perimeters and shallow, diffused ambient occlusion to express elevation. Heavy drop shadows are omitted to maintain an analytical, distraction-free environment.

### Elevation Levels
- **Level 0 (Canvas Base):** Flat `#F8F9FA` background plane without shadow or border.
- **Level 1 (Card & Module Surface):** `#FFFFFF` surface accompanied by a structural border (`1px solid #E0E0E0`) and an ambient drop shadow:
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)`.
- **Level 2 (Interactive Floating Elements):** Applied to active search autocompletes, filter menus, and action dropdowns:
  `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); border: 1px solid #E0E0E0;`.
- **Level 3 (Modals & Deep Drawers):** Applied to qualitative interview session video drawers and feedback tag editors:
  `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16)`. Backdrop overlay is rendered at `#202124` with 40% opacity.

## Shapes

The shape system balances modern softness with functional precision through specialized corner radii:

- **Surface & Action Radii (12px):** Applied to cards, containers, modal viewports, and primary action buttons.
- **Form Controls (8px):** Used exclusively on single-line text inputs, search fields, select dropdowns, and date-range pickers to create clear affordance differentiation between containers and input targets.
- **Pills & Status Chips (999px):** Infinite pill rounding reserved for categorization tags, sentiment indicators, cluster labels, and user segment counters.

## Components

### Buttons
- **Primary:** Background `#1A73E8`, text `#FFFFFF`, border-radius `12px`, padding `10px 20px`. Hover state applies `#1557B0`. Focused elements trigger an outer 2px halo in `#1A73E8` at 30% opacity.
- **Secondary / Ghost:** Background `transparent`, text `#1A73E8`, border `1px solid #E0E0E0`, border-radius `12px`. Hover shifts background to `#E8F0FE` with border color matching `#1A73E8`.
- **Destructive:** Background `#FFFFFF`, text `#D93025`, border `1px solid #E0E0E0`. On hover, background shifts to `#FCE8E6`.

### Chips & Semantic Pills
- Geometry: Full pill radius (`999px`), height `24px`, padding `0 10px`, typography `label-sm`.
- **Sentiment Positive:** Background `#E6F4EA`, text `#1E8E3E`.
- **Sentiment Negative:** Background `#FCE8E6`, text `#D93025`.
- **Sentiment Neutral:** Background `#FEF7E0`, text `#B06000`.
- **Filter / Meta Chip:** Background `#F1F3F4`, text `#5F6368`, with an interactive hover state shifting to `#E8F0FE` and text `#1A73E8`.

### Input Fields & Search Bars
- Standard input height: `40px` with an `8px` corner radius.
- Inactive state: `#FFFFFF` fill with `1px solid #E0E0E0` border and `#5F6368` placeholder text.
- Focus state: `1px solid #1A73E8` border accompanied by an ambient `0 0 0 2px #E8F0FE` glow.

### Checkboxes & Radios
- Checkboxes feature an `8px` outer geometry with `4px` inner box radius. Radios remain circular.
- Selected state: Background `#1A73E8` displaying a white checkmark icon.
- Unselected state: Border `1.5px solid #5F6368`, background `#FFFFFF`.

### Cards & Analytics Panels
- Cards feature `#FFFFFF` fill, `12px` border radius, `1px solid #E0E0E0` outline, and `0 2px 8px rgba(0,0,0,0.08)` elevation.
- Internal padding is set to `20px` (`1.25rem`). Card headers feature distinct action zones separated by a subtle `#E0E0E0` divider when housing complex tab bars.

### Data Tables & Feedback Logs
- Rows feature a `48px` default height, bounded by `1px solid #E0E0E0` horizontal bottom strokes.
- Hover state: Background switches instantly to `#F8F9FA`.
- Selected state: Row adopts `#E8F0FE` background with a left accent border `3px solid #1A73E8`.