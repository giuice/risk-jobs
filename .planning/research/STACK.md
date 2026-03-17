# Stack Research

**Domain:** Dark Humor AI Job Risk Calculator (Single-Page App)
**Researched:** 2026-03-17
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| HTML5 | Current | Page structure | Universal, no build step, single file |
| CSS3 | Current | Cyberpunk aesthetics, animations | Custom properties, keyframes, pseudo-elements for glitch/neon |
| Vanilla JS (ES2022) | Current | Calculation, DOM, i18n | Zero deps = zero build step |
| Inline SVG | N/A | Risk gauge meter | Resolution-independent, CSS-animatable |
| Google Fonts (JetBrains Mono) | CDN | Monospace terminal font | Best monospace for cyberpunk aesthetic |

### Supporting Libraries

None. This project deliberately uses zero JS libraries.

## Cyberpunk CSS Techniques

### Neon Text Glow
4-layer `text-shadow` at zero offset with increasing blur (10/20/40/80px) creates volumetric glow.

### Neon Border Glow
Stacked `box-shadow` with `inset` layer for interior glow.

### Scanline Overlay
`body::after` with `position: fixed`, `pointer-events: none`, `repeating-linear-gradient` at 3px pitch.

### Text Glitch Effect
`::before`/`::after` pseudo-elements with `content: attr(data-text)`, `clip-path: polygon()` horizontal band clipping, `translateX` offset, `steps(1)` timing, `filter: hue-rotate()` for chromatic aberration.

### SVG Gauge
`stroke-dasharray`/`stroke-dashoffset` on `<circle>`, CSS `transition: stroke-dashoffset 1.5s ease-out`, JS sets offset from risk percentage.

### Color System
All neon colors on `:root` CSS custom properties. Risk level applied via class on results container.

## Bilingual (i18n) Pattern

- `data-i18n` attribute on HTML elements
- JS object with `en` / `pt-BR` keys
- Auto-detect via `navigator.language`
- Persist choice in `localStorage`
- `Intl.NumberFormat('pt-BR')` for locale numbers

## Social Sharing

- Static OG image (1200x630 PNG) + `og:*` + `twitter:card` meta tags
- Platform share URLs (Twitter intent, WhatsApp wa.me, LinkedIn share-offsite)
- Web Share API as progressive enhancement (mobile), explicit buttons as fallback

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| React / Vue | Build step, 30-100KB+ bundle for ~5 interactive elements | Vanilla JS |
| GSAP | 27KB for effects achievable with CSS keyframes | CSS `@keyframes` + `transition` |
| html2canvas | Heavyweight, unreliable with CSS effects | Static OG image + share URL |
| i18next | 40KB+ for 2 languages | Simple JS object + `data-i18n` |
| Bootstrap / Tailwind | Framework bloat for custom design | Custom CSS |
| Webpack / Vite | Build tools for single HTML file = absurd | Direct edit |

## Sources

- MDN Web Docs — CSS text-shadow, clip-path, box-shadow, Custom Properties, stroke-dasharray
- Web Share API specification
- Open Graph Protocol
- Google Fonts — JetBrains Mono

---
*Stack research for: AI Job Death Clock*
*Researched: 2026-03-17*
