# Brand: Leroy's Fish Shack

Taken from the live site CSS (inline `<style>` blocks in each page, custom properties `--lfs-*`), the logo files and the photos. Hex values are exact. Use counts are from the home page HTML.

## Colours

### Custom tokens (the real brand palette)

| Token | Hex | Uses (var refs on home) | Where it is used |
|---|---|---|---|
| `--lfs-teal` | `#3E8E86` | 24 (+19 literal) | Main brand colour: default buttons, visit info panel, hamburger lines, outline button hover, gradients (hero fallback, cam section, lead section, gift cards, footer, mobile drawer, photo placeholders). |
| `--lfs-teal-2` | `#2C6A64` | 11 literal | Darker teal end of the gradients. |
| (deep teal) | `#15312E` | 9 literal | Darkest gradient stop (hero fallback, footer, drawer, cam, lead, gift cards). |
| (button hover) | `#224E49` | 6 | Default button hover. |
| `--lfs-buoy` | `#C1442E` | 20 | Accent red-orange ("buoy"): primary CTA "Call to Reserve", eyebrow text, nav underline, Live badge, FAQ "+" sign, focus outline. |
| `--lfs-buoy-dk` | `#8F311F` | 6 | Buoy hover; gallery tile gradient. |
| `--lfs-sand` | `#F6F4EE` | 4 | Page canvas and header base colour (under the textures). |
| `--lfs-charcoal` | `#111111` | 9 | Headings, announcement bar, facts bar. |
| `--lfs-text` | `#2A2A2A` | 4 | Body text. |
| `--lfs-mint` | `#8BE3C0` | 6 literal | Eyebrows and rules on dark bands. Matches the logo roof green (sampled `#8BE3BF`). |
| `--lfs-line` | `#E6E1D3` | 10 | Borders, outline buttons. |
| `--lfs-brass` | `#3E8E86` | 1 | Misnamed: same value as teal. Small heading rules. |
| `--lfs-rum` | `#D98F2B` | 1 | Rum bar section accents. |
| `--lfs-rum-dk` | `#A6691C` | 0 | Rum bar (declared). |
| (rum bar bg) | `#1B1209` to `#3A2410` to `#6B4A1D` | rum section | Dark brown gradient behind the rum bar, with pattern strokes `#F2C98A`. |
| (blush) | `#F2C9BC` | 7 | Eyebrow text on the hero and gift card section. |
| (cam/dish frames) | `#0B1918` | 3 | Near-black teal behind cams and dish tiles. |
| (live dot) | `#5FCB86` | 2 | Green "Now open" status dot. |
| (facts bar text) | `#EDE9DC` | 1 | Light text on charcoal. |

Shadow: `0 18px 50px -26px rgba(17,17,17,.30)`. Radius: `4px`. Container: `1200px`. Dark band overlay: `rgba(8,10,9,.62)`. Hero scrim: `rgba(4,14,15,.6 to .8)`.

Ranking by visual weight: teal family (`#3E8E86`, `#2C6A64`, `#15312E`) first, then sand/white surfaces, charcoal text, buoy `#C1442E` for actions, mint `#8BE3C0` as the logo-matching highlight, rum browns for the bar only.

### Ignore (defaults, not brand)

- Elementor globals in `post-5.css`: `#6EC1E4`, `#54595F`, `#7A7A7A`, `#61CE70`, `#FFBC7D` (Elementor kit defaults, unused by the custom HTML).
- WordPress block presets (`#ABB8C3`, `#F78DA7`, `#CF2E2E`, `#FF6900`, `#FCB900`, `#7BDCB5`, `#00D084`, `#8ED1FC`, `#0693E3`, `#9B51E0`, `#32373C`) and the Hello theme base (`#706F6F`, `#0C0D0E`, `#D6D5D5`).

### Colours in the logo and menu

- Logo: black `#000000`, grey drop shadow around `#A8A8A8` to `#B4B4B4`, roof mint `#8BE3BF` with darker roof lines around `#60A890`.
- Printed menu: cream panels around `#F0E4D8`, weathered blue-white boards, rope borders, rusty metal sign headers, mint `#8BE3C0`-like highlight swashes.
- Interior: teal stained concrete floor with rust patches, knotty pine walls, dark ceilings (see photos `IMG_9861/9862/9868`); the River Room has wood floors and black leather chairs.

## Fonts

Loaded from Google Fonts in one request: `Anton`, `Cinzel Decorative` (400/700/900), `Yeseva One`, `Lora` (400 to 700, italic 400), `IBM Plex Mono` (500/600). Elementor also loads `Roboto` and `Roboto Slab` with all 18 weights each, and the Ally plugin loads its own Roboto; cookie banner loads Noto Sans.

What is really used (resolved CSS cascade):

| Font | Used for |
|---|---|
| **Cinzel Decorative 700** | The single h1 per page, uppercase, `clamp(40px,7vw,84px)`, letter-spacing .02em. |
| **Yeseva One** | All h2 (uppercase via the shared rule, `clamp(30px,4.4vw,52px)`), desktop nav links (19px, not uppercase), header/drawer buttons, dish names, lightbox captions, drawer links (24px). |
| **Lora** | Body text (17px, line-height 1.65), h3 (700, not uppercase), FAQ questions (700, 18px). |
| **IBM Plex Mono 500/600** | Eyebrows (13px, uppercase, .16em tracking, buoy colour), buttons (14px uppercase), utility bar, announcement bar, facts bar, photo captions, cam badges, footer headings and bar, visit list labels. The most-used font by rule count (26). |
| Anton | Declared for h1/h2/h3/eyebrow but overridden by every one of them. Effectively unused; drop it. |
| Roboto / Roboto Slab | Elementor kit defaults; nothing in the custom HTML uses them. Drop. |

Logo lettering is custom artwork, not a web font: a distressed, worn slab serif with drop shadow for "LEROY'S" and a decorative fishhook-style display face for "FISH SHACK" (the "F" and "S" have hook terminals). The menu uses a western/woodtype slab for section signs and a script for badges.

## Logo files

| File | Size | Format | Notes |
|---|---|---|---|
| `media/2026/08/Leroys_Fish_Shack_logo.png` | 5520x3650, 1.34 MB | PNG, transparent | Best master. Black artwork, grey shadow, mint roof, white knock-outs inside the letters. Use this to build web versions. |
| `media/2026/08/Leroys_Fish_Shack_logo-scaled.png` | 2560x1693, 0.77 MB | PNG, transparent | WP-scaled copy of the master. |
| `media/external/6a627d58f7d31b0eb43b9ac4.png` | 1840x1217, 0.35 MB | PNG, transparent | The file actually shown in the live header and footer (hosted on filesafe CDN). Same artwork. |
| `media/2026/08/Leroys_Fish_Shack_logo_1080x1080.png` | 1080x1080, 0.26 MB | PNG, transparent | Square padded version. |
| `media/2026/08/cropped-Leroys_Fish_Shack_logo_1080x1080.png` (+ `-32x32`, `-180x180`, `-192x192`, `-270x270`) | 512 down to 32 | PNG | WP site icon set (favicon, apple-touch). At 32px the detailed shack drawing is unreadable; a simplified mark (roof + "L") would be better, but none exists: do not invent one without approval. |
| `media/2026/08/Untitled-design-1.png` | 512x512 | PNG (Canva export) | Logo on white; used as og:image. |
| `media/2026/08/e-gift-card.png` | 428x268 | PNG | Logo plus script tagline "From Our Boats To Your Table" on white. Only source of the tagline lockup. |

Quality notes:
- No SVG and no reversed (white) logo exist. The live footer fakes a white logo with a CSS invert filter, which also turns the mint roof pink/red. For dark backgrounds we either place the logo on a light panel or trace an SVG and make a reversed version (needs approval as it is a new brand asset).
- The logo is wide (about 3:2) and highly detailed; it needs at least about 150px width in the header to stay legible.
- The logo's white knock-outs inside the letters mean it only reads on light backgrounds.

## Visual tone

- Old-Florida fish camp meets upscale dining: weathered painted boards, fishing nets, rope, rusty sign plates, a tin-roof stilt shack drawing. The site background and header are board/net textures (both likely stock, see ASSET-INVENTORY.md).
- Colour story: harbor teal and mint, sand/cream, black ink, with a buoy red-orange for actions and warm rum browns for the bar.
- Interior is industrial-coastal: teal concrete floors, pine walls, Edison pendants, mounted sharks and fish, big harbor windows.

## Tone of voice

Casual, warm, local, a little cheeky, second person, short sentences. Leans on "shack", "dock", "harbor", "Gulf", "fresh off the boat". Uses many em dashes (rewrite those for the new site per owner preference).

Taglines and signature lines, quoted exactly (em dashes shown as ` -- `):

- "From Our Boats To Your Table" (gift card, door mat in hero video); "FROM OUR BOATS TO YOUR TABLE" (home h2)
- "Flip-flops or button-downs, either works." / "Vibe: Flip-Flops or Button-Downs"
- "Locally harvested, Florida-fresh seafood off the Gulf -- upscale plates, laid-back waterfront shack."
- "Keys Vibes, Harbor Views"
- "Give the Gift of the Gulf"
- "a rum bar worth staying for"
- "Grab a seat and watch the boats come in."
- "Straight off the boat"
- "Join the crew"
- "Fish shack casual."
- "come as you are, off the boat or off the golf course."
- Menu: "Fresh from the Gulf, crafted with Southern hospitality."; "crisp ingredients, and a Southern Hospitality in every bite"; "From the smokehouse to the steakhouse, every plate is crafted wit[h] Southern hospitality and coastal flavor"; "(Yes, around here we pronounce chowder with a hard "R"!)"
