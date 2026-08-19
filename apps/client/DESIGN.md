# VOID Interface System

## Product character

VOID is a luxury fashion and horology storefront. The interface should feel editorial, precise, restrained, and tactile. Product imagery and typography carry the expression; controls remain familiar and immediately understandable.

## Surface modes

- Storefront and account surfaces use the Ivory Atelier theme.
- Admin is an operational surface and may use the legacy dark theme inside an explicit `theme-dark` root.
- A page must not alternate between light and dark themes as decoration.

## Color

The storefront uses one warm neutral family and one sienna accent.

- `--ivory`: primary page surface
- `--ivory-deep`: grouped or secondary surface
- `--bone`: image and placeholder surface
- `--ink`: primary text and primary controls
- `--ink-soft`: body text
- `--ink-mute`: secondary text with WCAG AA contrast
- `--sienna`: accent, focus, and selected state
- `--sienna-deep`: high-contrast accent text

Use sienna to indicate emphasis or state, not as general decoration. Normal-size text must maintain a contrast ratio of at least 4.5:1.

## Typography

- Playfair Display is the editorial display face.
- Inter is the functional body face.
- Space Mono is reserved for compact metadata, measurements, and short labels.
- Display type uses tight leading and negative tracking.
- Body copy uses a maximum measure of 65 to 75 characters.
- Functional labels should normally be at least 12px. Ten-pixel type is reserved for nonessential image metadata.
- Do not place an eyebrow above every heading. The heading should usually carry the hierarchy itself.

## Layout

- `.container-void` is the shared content container.
- `.section-gap-sm` is for utility bands and compact transitions.
- `.section-gap` is for ordinary commerce sections.
- `.section-gap-major` is reserved for major editorial chapters.
- Heroes use `min-h-[100dvh]`, never `h-screen`.
- Product grids should prioritize scanability on mobile. Avoid decorative empty space between commerce sections.
- Sharp frames and hairline rules are the default shape language. Rounded forms are reserved for icon controls and compact status indicators.

## Interaction

- Every interactive target must provide at least a 44 by 44 pixel hit area.
- Press feedback starts immediately and uses a subtle scale between 0.97 and 0.985.
- Hover-only effects must be gated to fine pointers.
- Focus remains visible and uses the sienna focus ring.
- Drawers and sheets follow the trigger direction and remain interruptible.

## Motion

Motion communicates hierarchy, state, spatial origin, or direct feedback.

- CSS handles hover, focus, and press feedback.
- Framer Motion handles component state and one-shot reveals.
- GSAP is reserved for parallax, pinning, and horizontal editorial storytelling.
- Ordinary content is visible by default. Animation must never be required to discover products or complete a task.
- Default UI motion is critically damped with no decorative bounce.
- Reduced motion removes parallax and positional movement while preserving short opacity or color feedback.
- `will-change` is applied only while an element is actively animating.

## Imagery

- Product and editorial imagery reserves its final aspect ratio before loading.
- The primary hero image may load eagerly. Lower-page imagery loads lazily.
- New image exports should include responsive AVIF or WebP variants where possible.
- Alt text describes the product or editorial subject; decorative imagery uses an empty alt attribute.

## Accessibility floor

- Normal text contrast: 4.5:1 minimum.
- Large text contrast: 3:1 minimum.
- Touch targets: 44 by 44 pixels minimum.
- Inputs retain visible labels above the field.
- Interactive icon controls require accessible names.
- Reduced motion and reduced transparency preferences receive intentional alternatives.

## Preservation rules

Do not silently change route slugs, navigation labels, form field names, legal copy, product claims, or the VOID wordmark. Refine these only with explicit product approval.
