# Design System Reference

## Overview

This document outlines the complete design system for the YouTube Transcript Storage application. All colors use the OKLch color space for better perceptual uniformity across light and dark modes.

---

## Color Palette

### Light Mode (`:root`)

All colors are defined as CSS custom properties using OKLch format: `oklch(lightness chroma hue)`

#### Base Colors
- **Background**: `oklch(0.9940 0 0)` - Off-white
- **Foreground**: `oklch(0 0 0)` - Pure black
- **Card**: `oklch(0.9940 0 0)` - Off-white
- **Popover**: `oklch(0.9911 0 0)` - Slightly off-white

#### Primary Colors
- **Primary**: `oklch(0.5393 0.2713 286.7462)` - Vibrant purple
- **Primary-Foreground**: `oklch(1.0000 0 0)` - White text on primary

#### Secondary Colors
- **Secondary**: `oklch(0.9540 0.0063 255.4755)` - Light purple-gray
- **Secondary-Foreground**: `oklch(0.1344 0 0)` - Dark text on secondary

#### Accent Colors
- **Accent**: `oklch(0.9393 0.0288 266.3680)` - Light purple accent
- **Accent-Foreground**: `oklch(0.5445 0.1903 259.4848)` - Purple text on accent

#### Semantic Colors
- **Muted**: `oklch(0.9702 0 0)` - Light gray
- **Muted-Foreground**: `oklch(0.4386 0 0)` - Medium gray text
- **Destructive**: `oklch(0.6290 0.1902 23.0704)` - Red
- **Destructive-Foreground**: `oklch(1.0000 0 0)` - White text on destructive
- **Border**: `oklch(0.9300 0.0094 286.2156)` - Light border
- **Input**: `oklch(0.9401 0 0)` - Input background
- **Ring**: `oklch(0 0 0)` - Focus ring (black)

#### Chart Colors (for data visualization)
- **Chart-1**: `oklch(0.7459 0.1483 156.4499)` - Cyan
- **Chart-2**: `oklch(0.5393 0.2713 286.7462)` - Purple (same as primary)
- **Chart-3**: `oklch(0.7336 0.1758 50.5517)` - Orange
- **Chart-4**: `oklch(0.5828 0.1809 259.7276)` - Blue
- **Chart-5**: `oklch(0.5590 0 0)` - Gray

#### Sidebar Colors
- **Sidebar**: `oklch(0.9777 0.0051 247.8763)` - Very light
- **Sidebar-Foreground**: `oklch(0 0 0)` - Black text
- **Sidebar-Primary**: `oklch(0 0 0)` - Black
- **Sidebar-Primary-Foreground**: `oklch(1.0000 0 0)` - White
- **Sidebar-Accent**: `oklch(0.9401 0 0)` - Light
- **Sidebar-Accent-Foreground**: `oklch(0 0 0)` - Black
- **Sidebar-Border**: `oklch(0.9401 0 0)` - Light border
- **Sidebar-Ring**: `oklch(0 0 0)` - Black

---

## Dark Mode (`.dark`)

Dark mode provides better colors with higher saturation for visibility.

#### Base Colors
- **Background**: `oklch(0.1557 0.0085 279.5976)` - Very dark blue-gray
- **Foreground**: `oklch(0.9806 0.0074 285.7503)` - Off-white
- **Card**: `oklch(0.2114 0.0092 280.1234)` - Dark blue-gray
- **Popover**: `oklch(0.2114 0.0092 280.1234)` - Dark blue-gray

#### Primary Colors
- **Primary**: `oklch(0.6132 0.2294 291.7437)` - Vibrant purple (lighter than light mode)
- **Primary-Foreground**: `oklch(1.0000 0 0)` - White

#### Secondary Colors
- **Secondary**: `oklch(0.6445 0.1384 283.1254)` - Colored purple-blue
- **Secondary-Foreground**: `oklch(0.9806 0.0074 285.7503)` - Off-white

#### Accent Colors
- **Accent**: `oklch(0.4412 0.1127 270.1823)` - Vibrant purple
- **Accent-Foreground**: `oklch(0.8834 0.1624 271.2945)` - Light purple

#### Semantic Colors
- **Muted**: `oklch(0.3576 0.0228 279.3614)` - Dark gray with subtle color
- **Muted-Foreground**: `oklch(0.7369 0.0176 278.2945)` - Light gray
- **Destructive**: `oklch(0.7106 0.1661 22.2162)` - Bright red
- **Destructive-Foreground**: `oklch(1.0000 0 0)` - White
- **Border**: `oklch(0.2785 0.0175 278.5643)` - Dark border with subtle purple
- **Input**: `oklch(0.2785 0.0175 278.5643)` - Input background
- **Ring**: `oklch(0.6132 0.2294 291.7437)` - Purple focus ring

#### Chart Colors
- **Chart-1**: `oklch(0.8003 0.1821 151.7110)` - Cyan
- **Chart-2**: `oklch(0.6132 0.2294 291.7437)` - Purple
- **Chart-3**: `oklch(0.8077 0.1035 19.5706)` - Orange
- **Chart-4**: `oklch(0.6691 0.1569 260.1063)` - Blue
- **Chart-5**: `oklch(0.7058 0.0876 234.5432)` - Purple-gray

#### Sidebar Colors
- **Sidebar**: `oklch(0.1831 0.0098 285.3214)` - Very dark
- **Sidebar-Foreground**: `oklch(0.9806 0.0074 285.7503)` - Off-white
- **Sidebar-Primary**: `oklch(0.6132 0.2294 291.7437)` - Purple
- **Sidebar-Primary-Foreground**: `oklch(1.0000 0 0)` - White
- **Sidebar-Accent**: `oklch(0.4412 0.1127 270.1823)` - Purple
- **Sidebar-Accent-Foreground**: `oklch(0.8834 0.1624 271.2945)` - Light purple
- **Sidebar-Border**: `oklch(0.2785 0.0175 278.5643)` - Dark border
- **Sidebar-Ring**: `oklch(0.6132 0.2294 291.7437)` - Purple

---

## Typography

### Font Families

- **Sans-serif**: Plus Jakarta Sans
  - Used for: Body text, headings, UI labels
  - CSS Variable: `--font-sans`
  - Tailwind: `font-sans`

- **Serif**: Lora
  - Used for: Emphasis, quotes, special text
  - CSS Variable: `--font-serif`
  - Tailwind: `font-serif`

- **Monospace**: IBM Plex Mono
  - Used for: Code, technical text, timestamps
  - CSS Variable: `--font-mono`
  - Tailwind: `font-mono`

### Letter Spacing

- **Tracking Tighter**: `calc(--tracking-normal - 0.05em)`
- **Tracking Tight**: `calc(--tracking-normal - 0.025em)`
- **Tracking Normal**: `-0.025em` (default)
- **Tracking Wide**: `calc(--tracking-normal + 0.025em)`
- **Tracking Wider**: `calc(--tracking-normal + 0.05em)`
- **Tracking Widest**: `calc(--tracking-normal + 0.1em)`

---

## Spacing & Sizing

### Border Radius

- **Radius (lg)**: `1.4rem` - Large corners
- **Radius (md)**: `1.2rem` - Medium corners
- **Radius (sm)**: `1rem` - Small corners

### Shadows

All shadows use the same base parameters:
- X offset: `0px`
- Y offset: `2px`
- Blur: `3px`
- Spread: `0px`
- Color: `hsl(0 0% 0%)`

Shadow Levels:
- **Shadow 2xs**: `0px 2px 3px 0px hsl(0 0% 0% / 0.08)`
- **Shadow xs**: `0px 2px 3px 0px hsl(0 0% 0% / 0.08)`
- **Shadow sm**: `0px 2px 3px 0px hsl(0 0% 0% / 0.16), 0px 1px 2px -1px hsl(0 0% 0% / 0.16)`
- **Shadow**: `0px 2px 3px 0px hsl(0 0% 0% / 0.16), 0px 1px 2px -1px hsl(0 0% 0% / 0.16)` (default)
- **Shadow md**: `0px 2px 3px 0px hsl(0 0% 0% / 0.16), 0px 2px 4px -1px hsl(0 0% 0% / 0.16)`
- **Shadow lg**: `0px 2px 3px 0px hsl(0 0% 0% / 0.16), 0px 4px 6px -1px hsl(0 0% 0% / 0.16)`
- **Shadow xl**: `0px 2px 3px 0px hsl(0 0% 0% / 0.16), 0px 8px 10px -1px hsl(0 0% 0% / 0.16)`
- **Shadow 2xl**: `0px 2px 3px 0px hsl(0 0% 0% / 0.40)`

---

## Component Usage

### Colors in Tailwind

Use colors directly with Tailwind utilities:

```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-accent">Accent background</div>

<!-- Text colors -->
<p class="text-foreground">Main text</p>
<p class="text-muted-foreground">Secondary text</p>

<!-- Border colors -->
<div class="border border-border">Bordered element</div>

<!-- Opacity/Transparency -->
<div class="bg-primary/50">Primary with 50% opacity</div>
<div class="hover:bg-primary/80">Hover state</div>
```

### Shadows in Tailwind

```html
<!-- Shadow levels -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
```

### Typography in Tailwind

```html
<!-- Font families -->
<p class="font-sans">Sans-serif text</p>
<p class="font-serif">Serif text</p>
<code class="font-mono">Monospace text</code>

<!-- Letter spacing -->
<p class="tracking-tight">Tight spacing</p>
<p class="tracking-normal">Normal spacing</p>
<p class="tracking-wide">Wide spacing</p>
```

---

## Implementation Files

### CSS Variables
- **Location**: `app/globals.css`
- **Format**: OKLch color space
- **Structure**: `:root` for light mode, `.dark` for dark mode

### Tailwind Configuration
- **Location**: `tailwind.config.js`
- **Features**:
  - Color mapping to CSS variables
  - Shadow definitions
  - Font family configuration
  - Border radius utilities
  - Letter spacing utilities

### Theme Switching
- **Dark Mode**: Applied via `dark` class on `<html>` element
- **Enabler**: `suppressHydrationWarning` in layout.tsx

---

## Design Principles

1. **OKLch Color Space**: Uses perceptually uniform colors that look good in both light and dark modes
2. **Semantic Naming**: Color names reflect their purpose, not their appearance
3. **Accessibility**: Maintains WCAG AA contrast ratios
4. **Consistency**: Same variables used across all components
5. **Flexibility**: CSS variables allow runtime theme switching

---

## Usage Guidelines

### When to Use Each Color

- **Primary**: Buttons, links, brand elements, main CTAs
- **Secondary**: Alternative actions, less emphasis than primary
- **Accent**: Highlights, interactive elements, visual focus
- **Destructive**: Delete actions, errors, warnings
- **Muted**: Disabled states, secondary UI, placeholder text
- **Border**: Lines, dividers, component boundaries
- **Chart Colors**: Data visualization (Chart-1 through Chart-5)

### Dark Mode Support

All components automatically support dark mode when the `dark` class is present on the `<html>` element. Colors automatically shift to their dark mode equivalents.

```html
<!-- Light mode (default) -->
<div class="bg-background">Light background</div>

<!-- Dark mode -->
<html class="dark">
  <div class="bg-background">Dark background</div>
</html>
```

---

## Image Handling

### Next.js Image Component

All images use Next.js Image component for optimization:

```tsx
import Image from "next/image"

<Image
  src={thumbnailUrl}
  alt="Description"
  width={256}
  height={144}
  className="rounded-lg"
/>
```

### External Image Support

- **YouTube Thumbnails**: `https://i.ytimg.com/vi/**`
- Configured in `next.config.js` under `images.remotePatterns`
- Automatic fallback UI when image fails to load

---

## Version History

- **v1.0**: Initial design system with OKLch colors, light and dark modes, typography system, and shadow definitions
