# Site audit: leroysfishshack.com

Audited 2026-11-14 from the mirror in `reference/original-site/` (mirrored the same day, 6 pages, 0 failures) plus live checks (redirects, sitemaps, robots.txt, Jotform, weight test).

Conventions:
- Quotes are exact live wording. The live copy uses em dashes (14 on home, 12 on reservations, 7 on private events). In this file every em dash inside a quote is written as ` -- ` so the doc stays dash-free. New copy must not use em dashes (owner preference), so these sentences need rewording at build time.
- "(schema)" means the fact only appears in JSON-LD, not in visible text.

Platform: WordPress 7.1 on GoDaddy managed hosting, Hello Elementor theme, Elementor + Elementor Pro 4.4.0, Yoast SEO 28.8, Google Site Kit, "Ally" accessibility widget (pojo-accessibility), "cookiez" cookie banner. The visible page content is not built with Elementor widgets: each page is one big hand-written HTML block (classes `lfs-*`, inline `<style>`, inline JS). Header and footer are also custom HTML repeated in each page.

---

## 1. Pages and URLs

All URLs redirect correctly: `http://` and `www.` 301 to `https://leroysfishshack.com/`; `/reservations` 301s to `/reservations/`. Trailing slash is canonical.

| URL (keep) | Title | Meta description | h1 | Purpose |
|---|---|---|---|---|
| `/` | Leroy's Fish Shack \| Waterfront Seafood Restaurant \| Punta Gorda, FL. | "Fresh Gulf seafood, dockside at Fishermen's Village. Leroy's Fish Shack serves waterfront dining, a rum bar, and Charlotte Harbor views in Punta Gorda, FL." | Leroy's Fish Shack | One-page home: hero video, dishes, story, live cams, menu, gift cards, rum bar, events teaser, visit, newsletter, FAQ. |
| `/reservations/` | Reservations - Leroy's Fish Shack | **missing** | Reserve Your Table | Phone-only reservation info, policies, FAQ. |
| `/private-events/` | Private Events - Leroy's Fish Shack | **missing** (Yoast falls back to an auto-excerpt for og:description) | Host Your Next Event in the River Room | River Room private hire, call to book, FAQ. |

WordPress leftovers (do not rebuild):

| URL | Title | Status |
|---|---|---|
| `/hello-world/` | Hello world! - Leroy's Fish Shack | Default WP post with the default "A WordPress Commenter" comment. 200, `index, follow`, listed in Yoast `post-sitemap.xml`. Not linked from the 3 real pages. |
| `/category/uncategorized/` | Uncategorized Archives - Leroy's Fish Shack | 200, `index, follow`, in `category-sitemap.xml`. Links only to hello-world. |
| `/author/leroysfishshack/` | leroysfishshack, Author at Leroy's Fish Shack | 200, `index, follow`, in `author-sitemap.xml`. Exposes the WP admin username "leroysfishshack". |

These three are indexable and submitted in the sitemap index (`/sitemap_index.xml`), so Google may have them. In the rebuild: do not recreate them; add 301s to `/` (or let them 404/410) if the host allows redirects. `/?s=` search also returns 200 (WP search, declared in WebSite schema SearchAction); not needed in the rebuild.

`robots.txt` (Yoast): allow all, `Sitemap: https://leroysfishshack.com/sitemap_index.xml`.

### 1.1 Home `/`: sections in order (each counted once)

Header (all pages): utility bar "Directions" (`#lfs-visit`), "(941) 397-5005" (`tel:+19413975005`), "Reservations" (`/reservations/`), Facebook and Instagram icon links; logo (links to `/`); nav "Menu", "Rum Bar", "The Dock", "Private Events", "Reservations"; button "Reserve a Table"; announcement bar "NOW OPEN -- 11am Daily"; mobile drawer repeats the nav.

| # | id | Eyebrow | Heading | Content |
|---|---|---|---|---|
| 1 | (hero) | "Punta Gorda, FL · Fishermen's Village · Charlotte Harbor" | h1 "Leroy's Fish Shack" | Background video `IMG_6736.mov`. Sub: "Locally harvested, Florida-fresh seafood off the Gulf -- upscale plates, laid-back waterfront shack. Flip-flops or button-downs, either works." Buttons "Call to Reserve" (tel), "Watch the Live Dock Cam" (`#lfs-cam`). Mobile only: small live cam preview with "Live" badge. Status line "Now Open · 11am Daily • Rum Bar & Live Music on the Water". |
| 2 | (facts bar) | | | "Source: Locally Harvested", "Bar: High-End Sipping Rums", "Vibe: Flip-Flops or Button-Downs", "26.9294° N, 82.0454° W" |
| 3 | `lfs-dishes` | "A taste of the menu" | h2 "Fresh From Our Kitchen" | "A look at what's coming out of the kitchen at Leroy's Fish Shack." 11 named dish tiles + "More from the kitchen" strip of 6 unnamed photos; click opens a lightbox. |
| 4 | `lfs-dock-story` | "Locally Harvested · Florida Fresh" | h2 "FROM OUR BOATS TO YOUR TABLE"; h3 "Designed around the view" | Sourcing paragraph; dining room photo captioned "Harbor views from every table"; 3 checklist points; button "See the Harbor Live". |
| 5 | `lfs-cam` | "Watch the Working Waterfront" | h2 "Grab a seat and watch the boats come in." | Intro, 3 bullets, two live cam iframes "Live Camera Left" / "Live Camera Right". |
| 6 | `lfs-menu` | "Straight off the boat" | h2 "Our Menu" | "Fresh Gulf seafood, locally caught favorites, and something for everyone." Two menu PNGs (link to full-size file), QR code "Scan to pull up the menu on your phone", "Call to Reserve". |
| 7 | `lfs-gift-cards` | "Give the Gift of the Gulf" | h2 "E-Gift Cards" | Gift card image, paragraph, "Buy an E-Gift Card" (Toast). |
| 8 | `lfs-rum-bar` | "Keys Vibes, Harbor Views" | h2 "The Rum Bar"; h3 x4 | Intro, photo `IMG_9868`, four cards (see facts). |
| 9 | (gallery) | "From our fishermen to our floor" | h2 "The Shack & the Boats Behind It" | A single photo `IMG_9862` captioned "The dining room". The "boats" in the heading are not shown. |
| 10 | `lfs-events` | "Weddings, Rehearsal Dinners & Private Parties" | h2 "Host Your Next Event at Leroy's" | Front Dining Room buyout paragraph, 3 bullets, "Inquire About Private Events" (`/private-events/`). |
| 11 | `lfs-visit` | "On the water, on the harbor" / "Find Us" | h2 "Visit Leroy's" and h2 "Fishermen's Village, Punta Gorda" | Address, hours, phone, reservations note, "Get Directions", "Call the Shack", Google Map iframe. |
| 12 | `lfs-lead` | "Join the crew" | h2 "Get the Music Lineup & Weekly Catch" | "Drop your email for the weekly live-music schedule, what's fresh off the boat, and first word on private events." Jotform email form. |
| 13 | `lfs-faq` | "Good to know" | h2 "Frequently Asked" | 7 Q&As (accordion buttons with `aria-expanded`). |

Footer (all pages): logo (header logo inverted with a CSS filter), blurb "Locally harvested, Florida-fresh seafood -- upscale plates, laid-back waterfront shack, and a rum bar worth staying for. Dockside at Fishermen's Village, Punta Gorda."; h4 "Explore" (Menu, Rum Bar, The Dock, Live Cam, Live Music, Private Events); h4 "Visit" (Hours & Directions, phone, Join the Crew); h4 "The Shack" (address); "©2026 Leroy's Fish Shack. All rights reserved."; "26.9294° N, 82.0454° W · Charlotte Harbor, FL".

### 1.2 Reservations `/reservations/`: sections in order

1. Hero: eyebrow "Punta Gorda, FL · Fishermen's Village · Charlotte Harbor"; h1 "Reserve Your Table"; "Waterfront seating on Charlotte Harbor, fresh-off-the-boat Gulf seafood, and live music on weekends. Save your spot before you go -- especially for sunset."; "Call to Reserve".
2. Eyebrow "Call to Reserve"; h2 "Reserve a Table at Leroy's"; h3 "Give us a call": "We're taking reservations by phone right now -- give us a call and we'll get you set up, no waiting required."; "Call (941) 397-5005"; facts "Hours Open Daily at 11am", "Party Size 1–8 guests by phone / 9+ → Private Events", "Location Fishermen's Village, Punta Gorda, FL"; "Walk-ins are always welcome as availability allows -- a reservation just guarantees your table, especially around sunset and on weekends with live music."
3. Eyebrow "Good to know before you book"; h2 "Reservation Details"; six h3 cards: Grace Period, Cancellations, Large Groups (9+), Sunset Seating, Live Music Nights, Dress Code.
4. Eyebrow "On the water, on the harbor" / "Details"; h2 "Find Us at Fishermen's Village" and h2 "1200 Retta Esplanade"; address, hours, phone, "Parking Free on-site parking at Fishermen's Village."; Get Directions, Call the Shack, map.
5. Eyebrow "Reservation questions"; h2 "Frequently Asked"; 6 Q&As (mirrored in FAQPage schema).

An HTML comment in the page says: "Online booking via Toast is not live yet -- this section is phone-only by design for now."

### 1.3 Private events `/private-events/`: sections in order

1. Hero: eyebrow "Private Events · Full & Partial Buyouts"; h1 "Host Your Next Event in the River Room"; "Rent the River Room at Leroy's Fish Shack for rehearsal dinners, birthdays, corporate gatherings, and celebrations -- groups of up to 50, with fresh Gulf seafood and a rum bar at Fishermen's Village."; "Call to Book Your Event"; facts "Max Capacity 50 guests", "Space The River Room, private", "Location Fishermen's Village, Punta Gorda". Background `IMG_1013` (decorative, `alt=""`).
2. Eyebrow "See the space"; h2 "The River Room"; "Our private River Room holds up to 50 guests."; photos `IMG_1013`, `IMG_1010`.
3. Eyebrow "Let's plan your event"; h2 "Call to Book Your Event"; "Tell us your date, guest count, and what you have in mind -- we'll walk you through availability, menus, and pricing over the phone."; "Call (941) 397-5005".
4. Eyebrow "Private event questions"; h2 "Frequently Asked"; 7 Q&As.
5. Eyebrow "On the water, on the harbor" / "Details"; h2 "Find the Shack" and h2 "1200 Retta Esplanade"; address, phone, "Events Contact us for a private event tour and walkthrough of the River Room."; "Call to Book Your Event"; map.

There is no inquiry form; booking is by phone only.

---

## 2. Facts stated on the site

| Fact | Exact wording | Where |
|---|---|---|
| Name | "Leroy's Fish Shack" | all |
| Address | "1200 Retta Esplanade, Unit J33-35, Punta Gorda, FL 33950" | home visit + FAQ, reservations, private events, footer, schema |
| Location | "inside Fishermen's Village ... right on Charlotte Harbor" | home FAQ |
| Phone | "(941) 397-5005", `tel:+19413975005`; schema "+1-941-397-5005" | all |
| Email | none anywhere on the site | |
| Hours (visible) | "Open Daily at 11am"; "NOW OPEN -- 11am Daily"; "Now Open · 11am Daily" | all pages (header), home, reservations |
| Hours (schema only) | Mon-Thu 11:00-21:00, Fri-Sat 11:00-22:00, Sun 11:00-21:00 | home Restaurant schema |
| Price range (schema only) | "$$-$$$" | all Restaurant schema |
| Cuisine (schema) | "Seafood", "American" | schema |
| Coordinates | "26.9294° N, 82.0454° W" (schema 26.9294, -82.0454) | home facts bar, footer, schema |
| Parking | "Free parking is available on-site." / "Free on-site parking at Fishermen's Village." / "Fishermen's Village offers free on-site parking for all guests." | home FAQ, reservations, private events FAQ |
| Dogs | "Well-behaved leashed dogs are welcome on our outdoor patio seating." / "Leashed, well-behaved dogs are welcome on the patio." | home FAQ, reservations |
| Dress code | "Fish shack casual. Flip-flops are just as welcome as button-down shirts -- come as you are, off the boat or off the golf course." | home FAQ; similar on reservations |
| Sourcing | "We source directly from local Gulf commercial fishermen, bringing the freshest catch available to our dock at Fishermen's Village. Every fish is professionally harvested and expertly handled to ensure exceptional flavor and freshness. The menu follows the Gulf, showcasing the best seafood the season has to offer." | home story |
| Sourcing (FAQ) | "Yes. Our commercial fishing partners deliver the catch straight to our dock -- you can watch it happen live on our patio webcam. What's on the menu changes with what came in that day." | home FAQ |
| Interior | "Every detail inside Leroy's fish shack was thoughtfully reimagined to showcase charlotte harbor while creating a warm, welcoming place to gather to enjoy fresh Florida seafood." (lower-case "fish shack", "charlotte harbor": typos to fix) | home story |
| Rum bar | "This isn't a cocktail bar -- it's a curated collection of high-end sipping rums, poured over a hand-cut ice ball and savored the way you'd enjoy a fine bourbon." | home |
| Rum cards | "Aged 12 Year: Smooth, oak-forward, notes of caramel -- served neat over the ice ball"; "Single Barrel Reserve: Rich and full-bodied, drawn one barrel at a time"; "Cask Strength: Bold, high-proof pour for the serious sipper"; "Rare & Limited: Small-batch releases -- ask your bartender what's pouring" | home |
| Live music | "Rum Bar & Live Music on the Water"; "live music on the patio most weekends, with the lineup posted and updated weekly above"; "live music on weekends"; "Weekends with live music fill up fast -- reserve early if you want a table close to the stage." | home hero + FAQ, reservations |
| Live cams | "Our patio cams stream live from Charlotte Harbor, right where the commercial boats unload." Bullets: "Live 24/7 from the patio, rain or shine", "Watch the fishing fleet unload right at our dock", "Beautiful live Charlotte Harbor sunsets". ipcamlive aliases `6ab155fbabf71` (left, also hero mobile preview) and `6ab157578f221` (right). | home |
| Reservations | "Highly recommended, especially for sunset seating. Walk-ins welcome as availability allows." | home visit |
| Reservation method | "We're taking reservations by phone right now" | reservations |
| Party size | "1–8 guests by phone", "9+ → Private Events" | reservations |
| Grace period | "Tables are held for 15 minutes past your reservation time." / FAQ "about 15 minutes" | reservations |
| Cancellation | "No fee for standard tables" | reservations FAQ |
| Booking lead time | "A few days ahead is ideal for weekend and sunset tables. Weeknight reservations can usually be made the same day." | reservations FAQ |
| Private room | "The River Room", "holds up to 50 guests", "Full & Partial Buyouts" | private events |
| Private room (home) | "Our front Dining Room is available for private buyouts"; "Full or partial buyout of the front Dining Room" | home |
| Event types | "rehearsal dinners, birthdays, corporate gatherings, and celebrations"; home eyebrow adds "Weddings"; schema adds "weddings" | private events, home |
| Event menus | "menus can be built around the day's fresh catch, with plated, family-style, or stationed service" | private events FAQ |
| Event add-ons | "Rum bar service and live music add-ons available" | home, private events FAQ |
| Event pricing/deposit | "Pricing and minimums depend on your date, guest count, and whether it's a full or partial buyout." "Booking details, including any deposit, are confirmed once we go over your date and event specifics together" | private events FAQ |
| Outside hours | "Depending on availability, full buyouts can sometimes be arranged before opening or after close" | private events FAQ |
| Gift cards | "delivered instantly by email"; Toast e-gift link `https://order.toasttab.com/egiftcards/leroys-fish-shack-pg-1200-west-retta-esplanade` | home |
| Socials | Facebook `https://www.facebook.com/profile.php?id=61559071051762`; Instagram `https://www.instagram.com/leroys_fish_shack/` | header, all pages (icons only) |
| People named | Only on the menu image: "Devon's Seafood Pancake", "Devon's Smokehouse Trio" ("Devon's signature blend of seasonings"), "Chef Hans Smoked Fish Dip", "The Yates Burger". No team section. | menu images |
| Taglines | "From Our Boats To Your Table" (gift card image, door mat in video, home h2); "Flip-flops or button-downs, either works"; "Keys Vibes, Harbor Views"; "Give the Gift of the Gulf"; "Fresh from the Gulf, crafted with Southern hospitality." (menu) | see BRAND.md |

### 2.1 Embeds and third parties

| What | Detail | Pages |
|---|---|---|
| Newsletter form | Jotform `262564109573158`, embedded with `<script src="https://form.jotform.com/jsform/262564109573158">`. Form title "New Customer Registration Form"; one field "Your email address" (`q6_email6`), Submit, honeypot. | home `#lfs-lead` |
| Live cams | `https://g1.ipcamlive.com/player/player.php?alias=6ab155fbabf71` (left; also hero preview on mobile), `...alias=6ab157578f221` (right) | home |
| Map | Google Maps embed `https://www.google.com/maps?q=1200+Retta+Esplanade+Unit+J33-35,+Punta+Gorda,+FL+33950&output=embed`; directions link `https://www.google.com/maps/dir/?api=1&destination=...` | all 3 pages |
| Gift cards | Toast e-gift cards (URL above; returns 403 to a script, normal for Toast bot protection) | home |
| Online booking | None. Toast booking "not live yet" (HTML comment). | |
| Menu QR | QR encodes `http://www.qrdatacenter.com/?L=1853` (dynamic QR service; comment says "Lee can update the destination"). The landing could not be confirmed from here. | home |
| Analytics | Google tag `GT-M6QWFDDG` via Site Kit (also loads google-analytics.com). GoDaddy `img1.wsimg.com/traffic-assets/js/tccl-tti.min.js` and `csp.secureserver.net`. No Meta pixel. | all |
| Accessibility widget | Elementor "Ally" `cdn.elementor.com/a11y/widget.js?api_key=ea11y-2141fcaf-...` | all |
| Cookie banner | "cookiez" plugin | all |
| Fonts | Google Fonts (see BRAND.md) | all |
| External image host | `assets.cdn.filesafe.space/YOmIBTWLjwIOQwl6vvuA/...` (GoHighLevel/LeadConnector-style media CDN): header/footer logo and two background textures | all |

### 2.2 Menu (transcribed from image, verify)

Source: `media/2026/08/Leroys-Fish-Shack-Menu-1.png` and `-2.png` (821x1265 and 822x1268 px). Small date code "08/2026" bottom right of page 1. Prices as printed (no $ sign). "MK" = market price. Spelling kept as printed (e.g. "SAUTEED", "Fresh gulf Shrimp", "prepared grill", "flakes.12"). The images are low resolution: every price was read at 2x zoom and is legible, but a second check against the images before publishing is advised.

Page 1 header: logo. Badges: "Fresh from the Gulf, crafted with Southern hospitality." and "crisp ingredients, and a Southern Hospitality in every bite".

**FIRST BITES**
- BUFFALO SHRIMP: Five lightly battered Gulf shrimp, golden fried & tossed in our house-made buffalo sauce. Served with house-made blue cheese dressing. 16
- DEVON'S SEAFOOD PANCAKE: A savory Korean-style seafood pancake loaded with shrimp, clams, scallops, bean sprouts, green onions & Thai chili, finished with a drizzle of house-made eel sauce. 16
- CHEF HANS SMOKED FISH DIP: Fresh local fish smoked in-house, blended with celery, onions & our signature seasoning. Served with toasted bread rounds. 14
- FRESH CEVICHE (highlighted): Fresh local fish marinated in citrus juices with jalapeños, red onions, cucumbers, tomatoes, cilantro & avocado. Served with crispy fried tostones. 18
- CALAMARI: Lightly breaded calamari, fried to perfection & served with a Thai sweet chili butter sauce. 18
- SAUTEED MUSSELS: A pound of PEI mussels simmered in a garlic wine butter sauce with smoky bacon, finished with blue cheese crumbles & a toasted garlic bread wedge. 18
- CONCH FRITTERS: Tender conch blended with onions, fresh herbs & seasonings, then fried golden brown. Served with our signature dipping sauce. 18
- SMOKED WINGS: Ten jumbo wings slow-smoked in our house rub & served with your choice of house-made blue cheese or buttermilk dressing. 18

**SOUPS & SALADS**
- LEROY'S SEAFOOD CHOWDER (highlighted): (Yes, around here we pronounce chowder with a hard "R"!) A hearty coastal favorite loaded with locally caught fresh fish, shrimp, clams, potatoes, celery, carrots & onions slowly simmered to create a rich, comforting bowl of Gulf Coast goodness. Bowl 16 | Cup 9
- BLUEBERRY PISTACHIO SPINACH: Fresh baby spinach topped with sweet blueberries, red onions, creamy feta & pistachios, finished with a house-made honey vinaigrette. 18
- HEIRLOOM TOMATO & MOZZARELLA: Fresh sliced heirloom tomatoes & creamy mozzarella blooms drizzled with extra virgin olive oil, garnished with fresh basil, cracked black pepper & a touch of sea salt. 16
- CAESAR: Crisp Romaine hearts topped with freshly shaved Parmesan, house-made croutons & Caesar dressing. 16
- HOUSE: A blend of fresh romaine & spinach topped with cucumbers, baby heirloom tomatoes, shredded carrots, red onions & house-made croutons. Served with your choice of buttermilk dressing, blue cheese, or oil & vinegar. 16
- ADD A PROTEIN: Make any salad a meal with your choice of: Fresh Local Catch MK; Shrimp (Grilled, Fried, or Blackened) 10; Fried Oysters 10; Chicken Breast (Grilled, Fried, or Blackened) 8

**SANDWICHES, TACOS & BURGERS**
Note: "Fish & chicken may be prepared grilled, blackened or fried & are served on a fresh-baked Brioche roll with salted fries"
- LOCAL CATCH SANDWICH: Today's fresh local catch topped with crisp lettuce, ripe tomato & our house-made tartar sauce. MK
- CHICKEN SANDWICH: An 8 oz. chicken breast prepared grill, blackened or fried, topped with a lettuce, carrot & red onion blended with ginger soy sauce. 16
- FISH OR SHRIMP TACOS: Three tacos featuring your choice of grilled or fried fish or shrimp. Served in a warm naan bread & stuffed with shredded green papaya, red cabbage & carrots, with a side of sweet Thai chili sauce. 26
- GROUPER REUBEN (highlighted): Fresh fried grouper stacked high with sauerkraut, Swiss & a Russian dressing on grilled marbled rye. MK
- CLASSIC HAMBURGER: An 8-ounce hand-formed beef burger cooked to order & topped with lettuce, tomato & red onion on a Brioche bun. Add American, Swiss or white cheddar. 20
- THE YATES BURGER: An 8-ounce beef burger cooked to order on an inverted grilled bun, pressed with double American & finished with our signature black coffee steak sauce. A local favorite that's messy, rich & unforgettable. 20

Footer: "*CONSUMING RAW OR UNDERCOOKED MEATS, POULTRY, SEAFOOD, SHELLFISH, OR EGGS MAY INCREASE YOUR RISK OF FOODBORNE ILLNESS, ESPECIALLY IF YOU HAVE CERTAIN MEDICAL CONDITIONS"

**MAINLAND ENTRÉES** (page 2; badge "From the smokehouse to the steakhouse, every plate is crafted wit[h] Southern hospitality and coastal flavor")
- DEVON'S SMOKEHOUSE TRIO: Slow-smoked & dry-rubbed with Devon's signature blend of seasonings. Choose one, two or go all in with three: Smoked Beef Brisket, St. Louis-Style Ribs, Smoked Half Chicken. Served with salted fries & a garnish of coleslaw. Three 42 | Two 35 | One 28
- 8 OZ. FILET MIGNON: A tender filet grilled to your preferred temperature & served with your choice of two signature sides. 42
- 16 OZ. NEW YORK STRIP: A richly marbled hand-cut New York strip steak, expertly grilled & served with your choice of two signature sides. 44
- GRILLED AIRLINE CHICKEN BREAST: A juicy airline chicken breast grilled to perfection & served with herb-roasted potatoes & fresh seasonal vegetables. 32
- SPANISH CHICKEN & RICE (highlighted): Bone-in chicken leg & thigh slowly cooked with traditional Spanish herbs in seasoned rice. A comforting, flavor-packed classic. 32
- DOUBLE-BONED PORK CHOP: A thick-cut, double-boned pork chop smoked, grilled & finished with a bourbon apple glaze, served with herb-roasted potatoes & fresh seasonal vegetables. 36

**COASTAL CARB CRAVINGS**
- LINGUINE YOUR WAY (highlighted): Fresh-made linguine tossed in your choice of house-made scampi or rich Alfredo sauce. 25. Add your favorite protein: Chicken 32 | Fresh gulf Shrimp 37 | Local catch 38 | Combo (Shrimp, Scallop, Local Catch) 44
- SEAFOOD LASAGNA: Layers of fresh fish, shrimp, crab meat, spinach & a blend of cheeses in a creamy white sauce. Served with grilled garlic bread. 38
- LA COSTA PASTA: Six lobster ravioli topped with grilled Gulf shrimp & finished in a creamy lemon butter sauce. 38

**COASTAL BOWLS**
- PASTA: Fresh pasta tossed in a silky key lime butter sauce with roasted heirloom tomatoes. 25
- BASMATI RICE: Fragrant basmati rice with sautéed spinach, finished with our Thai Sweet chili butter sauce. 25
- ZUCCHINI NOODLE: Fresh zucchini pasta sautéed with mushrooms & tomatoes, finished with Thai sweet chili butter sauce. 25
- Add your choice of: Fresh Gulf Shrimp 37 | Local Catch 38 | Seafood Combo (Shrimp, Local catch & Scallops) 44 | Grilled Chicken Breast 32

**SHACK COMBOS**
- PICK ONE, TWO OR THREE MAINS. Choose From: Fried Fish | Fried Shrimp | Fried Oysters | Clam Strips. Served with salted fries, cocktail sauce, house-made tartar sauce & a coleslaw garnish. Three 48 | Two 40 | One 32

**SIGNATURE SIDES**
- COCONUT RICE 6; JALAPEÑO CHEDDAR HUSH PUPPIES 6; HERB-ROASTED POTATOES 8; FRENCH FRIES 6; FRESH SEASONAL VEGETABLES 8; LOBSTER MAC & CHEESE (additionally priced) 16

**SHACK SPECIALTIES**
- FRESH LOCAL CATCH: Ask your server about today's local catch. Prepared grilled or blackened, served with coconut rice & seasonal vegetables, paired with your choice of signature sauce: Lemon, Garlic & Thyme Butter; Ginger Soy Glaze; Lemon Dill Cream; Key Lime Butter Sauce. MK Price
- SHACK SEAFOOD STEW: A hearty fisherman's stew loaded with shrimp, clams, mussels, fresh fish, crab, potatoes, carrots, onions, celery & ditalini pasta. Served with a thick slice of garlic bread. 52
- TROPICAL GROUPER (highlighted): Fresh Gulf grouper grilled & topped with island-inspired flavors & a spicy coconut sauce. Served with coconut rice. 48
- SEAFOOD PAELLA: A Spanish coastal classic featuring saffron-infused rice with fresh fish, shrimp, clams & mussels simmered in a rich seafood broth. 52
- STUFFED SHRIMP: Seven jumbo butterflied prawns stuffed with our signature seafood dressing & baked until golden, glazed with a key lime butter sauce. Served with fresh seasonal vegetables. 42

**SWEET ENDINGS**
- KEY LIME PIE: A Florida classic with the perfect balance of sweet & tart. 10
- SWEET GEORGIA COCONUT CRÈME BOMBE: A trifecta of coconut featuring real coconut milk & a thick pie pudding filling, coated in velvety buttercream & generously rolled in fresh sweet coconut flakes. 12
- BREAD PUDDING: Warm house-made bread pudding finished with a rich homemade rum glaze. 12
- THREE LAYER FLORIDA ORANGE SUNSHINE CAKE: Baked from scratch with fresh Florida orange juice & the finest ingredients. 12

Not on the menu images: drinks list, rum list or prices, kids menu, happy hour, brunch, allergens/gluten-free marks.

---

## 3. Restructure notes

The new site is a full redesign, not a copy of this layout. Keep `/`, `/reservations/` and `/private-events/` live at the same URLs. Build only from the content listed in section 2; do not invent content to fill new sections.

Content that exists, grouped by topic:

| Topic | Existing content | Where it lives today |
|---|---|---|
| Identity and arrival | Name, hero line, location eyebrow, "Now Open · 11am Daily", hero video (own) | home hero, header bar |
| Food | 11 named dish photos + 6 unnamed, full menu (two images, transcribed in 2.2), sourcing story | home dishes, story, menu |
| Waterfront | Interior photos with harbor views, patio video, two live cams | home story, cams, hero |
| Rum bar | Intro paragraph, four cards, bar photo | home |
| Private events | River Room (50 guests), event types, add-ons, FAQ (7), 2 room photos, phone booking | `/private-events/` + home teaser |
| Reservations | Phone-only booking, party size, policies (6 cards), FAQ (6) | `/reservations/` |
| Visit | Address, hours line, phone, parking, dogs, dress code, map, directions | all three pages (repeated) |
| Gift cards | Toast e-gift link, gift card image | home |
| Newsletter | Jotform email signup | home |
| General FAQ | 7 Q&As | home |

Suggested structure (same URLs, regrouped):

- `/` (home): a shorter story-led page. Hero (video) then a few calm sections: the food (dish photos, link to the menu), the waterfront (interior photos + live cam), the rum bar, a private events teaser linking to `/private-events/`, visit block (address, hours line, phone, map), gift cards and newsletter as a compact pair, general FAQ. Remove the duplicated "Visit" h2 pair and the one-photo "The Shack & the Boats Behind It" block (merge the dining room photo into the waterfront section).
- `/menu/` (new, real HTML): the transcribed menu from 2.2, grouped by the printed sections (First Bites, Soups & Salads, Sandwiches Tacos & Burgers, Mainland Entrees, Coastal Carb Cravings, Coastal Bowls, Shack Combos, Signature Sides, Shack Specialties, Sweet Endings), with the dish photos placed beside matching items and the consumer advisory at the foot. This is the biggest SEO and accessibility gain. The nav item "Menu" points here instead of `/#lfs-menu`. Keep the printed menu PNGs only as an optional download. A new URL is additive, so no existing ranking is lost.
- `/reservations/`: keep; lead with the phone CTA, then policies and FAQ. Fix the large-groups link to `/private-events/`.
- `/private-events/`: keep; River Room photos, capacity, event types, add-ons, FAQ, call CTA.
- Rum bar and live cams stay as home sections (not enough content for their own pages). 
- Shared facts (address, phone, hours line, socials, coordinates) go in `src/data/site.ts` once and appear in the footer, not repeated as full sections on every page.
- Do not rebuild `/hello-world/`, `/category/uncategorized/`, `/author/leroysfishshack/`; leave them out of the sitemap (301 to `/` if the host supports redirects).
- Footer anchors become absolute links (`/menu/`, `/#rum-bar` style) so they work from every page; drop the "Live Music" link until a schedule exists.

## 4. Missing information and gaps

- No meta description on `/reservations/` and `/private-events/`.
- No closing hours in visible text; no holiday hours.
- No email, no contact form, no event inquiry form (events are phone only).
- No live music schedule despite repeated mentions; `#lfs-music` anchor is dead.
- No drinks list or rum prices; menu only as two images (not indexable, not accessible, not zoomable on phone without opening the PNG).
- No reviews, testimonials or press (none should be invented).
- No kids menu, allergen info, happy hour, accessibility/ADA info, outdoor vs indoor seating details beyond the patio dog rule.
- Section "The Shack & the Boats Behind It" has one photo and no boats (placeholder gallery; HTML comment "GALLERY: swap in more real photos as they come in").
- WordPress leftovers indexed (hello-world, category, author).
- Developer notes shipped in public HTML comments ("guessed paths", "Leroys-Fish-Shack-Dish-Photos.zip", "Lee can update the destination", "Toast is not live yet").

### Broken or weak links

| Link | Problem |
|---|---|
| Footer "Live Music" `#lfs-music` | Target does not exist on any page. |
| Header "Directions" `#lfs-visit`, footer "Menu/Rum Bar/The Dock/Live Cam/Private Events/Hours & Directions/Join the Crew" | Relative anchors. Work on home only. On `/reservations/` and `/private-events/` only `#lfs-visit` resolves (those pages have their own visit block); the others go nowhere. |
| Skip link `#content` | No element with `id="content"` on home, reservations or private events. |
| Footer "Private Events" `#lfs-events` | Goes to the home teaser, not `/private-events/`. |
| Reservations "Private Events" `/#lfs-events` | Should be `/private-events/`. |
| Menu QR | Third-party redirect over plain `http://`. |

---

## 5. SEO notes

- Titles: home is good but ends in "FL." with a stray period; inner pages use the default "Page - Site" pattern. Keep URLs, improve titles and add descriptions.
- og:image on every page is `Untitled-design-1.png` (512x512 square logo) while twitter:card is `summary_large_image`. Make a 1200x630 share image from an own photo.
- Schema: Restaurant schema exists on all three pages, but: hours in schema are flagged in an HTML comment as not yet confirmed and are not shown in visible text, geo longitude -82.0454 differs from the hero video GPS (-82.0645, about 1.9 km west), no `sameAs` (Facebook/Instagram), no `hasMenu`/`menu` URL, no `email`, `acceptsReservations` is the string "True". The home FAQ (7 Qs) has no FAQPage schema; reservations and private events do. Private events FAQPage omits the 7th question. WebSite name is double-encoded "Leroy&#039;s Fish Shack".
- One h1 per page: yes. Home has two consecutive h2s in the visit section ("Visit Leroy's", "Fishermen's Village, Punta Gorda"); same pattern on inner pages. Footer uses h4 directly under h2 (skips h3).
- Menu text is inside images: zero indexable menu content. A real HTML menu (with Menu schema) is the biggest SEO win.
- Dish images have good descriptive alt text and file names; interior photos use camera names (`IMG_9862`).
- Sitemaps include the WP leftovers; the new site should ship a sitemap with only `/`, `/reservations/`, `/private-events/` (plus `/menu/` if built).
- Redirects in place: http to https, www to apex, no-slash to slash. Keep the apex domain with trailing slashes.

---

## 6. Speed and weight

Measured 2026-11-14 with an adapted copy of `tools/qa/weigh.mjs` (same logic, DNS pinned to 160.153.0.117, cache disabled, Chrome headless). Desktop 1400x900, mobile 390x844.

| Page | View | MB transferred* | Requests | Script requests | Hosts | Load event | DCL | FCP | DOM nodes |
|---|---|---|---|---|---|---|---|---|---|
| `/` | desktop | 7.52 | 85 | 32 | 11 | 7.1 s | 2.5 s | 0.8 s | 535 |
| `/reservations/` | desktop | 5.33 | 65 | 28 | 11 | 2.8 s | 1.3 s | 1.1 s | 369 |
| `/private-events/` | desktop | 5.73 | 64 | 28 | 11 | 2.2 s | 1.1 s | 0.9 s | 332 |
| `/` | mobile | 7.31 | 84 | 32 | 12 | 2.6 s | 0.7 s | 0.4 s | 535 |
| `/reservations/` | mobile | 5.33 | 62 | 28 | 10 | 2.4 s | 0.7 s | 0.3 s | 369 |
| `/private-events/` | mobile | 5.73 | 64 | 28 | 11 | 2.2 s | 1.4 s | 1.1 s | 332 |

\* Excludes the hero video. `IMG_6736.mov` is **53.9 MB** (HEVC/H.265 1920x1080 rotated to portrait 1080x1920, 30 fps, 48.8 s, 8.8 Mbit/s, with an audio track, `preload="auto"`). It streams by range requests and was still downloading when measured, so it is not in the totals. On a real visit the home page can pull tens of MB more on desktop and mobile alike.

Biggest items on every page:
- `assets.cdn.filesafe.space/.../6a627985f9c6f6a920b49626.png`: 2.82 MB page background texture (1536x1024 PNG of painted boards).
- `.../6a627e64ca81015f1c7983e3.png`: 1.41 MB header background (1816x866 PNG, fishing net on white boards).
- `.../6a627d58f7d31b0eb43b9ac4.png`: 0.34 MB logo, loaded twice in markup (header and footer).
- Home dish JPGs 0.1 to 0.35 MB each (served as JPG, not the WebP copies that exist in the library).
- Menu PNGs 1.6 to 1.7 MB each (lazy).
- gtag 0.17 MB; Elementor, jQuery, jQuery Migrate, underscore, wp-util, Ally widget, cookie banner, GoDaddy traffic script: 28 to 32 script requests for a static page.
- 7 Google font families requested (Anton, Cinzel Decorative, Yeseva One, Lora, IBM Plex Mono, Roboto, Roboto Slab with all 18 weights each), plus Roboto and Noto Sans woff2 from plugins.

Video compatibility risk: HEVC in a `.mov` with no MP4/H.264 or WebM fallback and no `poster`. It played in this Chrome build on Windows (hardware decoder), but `canPlayType('video/mp4; codecs="hvc1"')` returned empty, and Firefox and many Android/Linux/older Windows browsers cannot decode HEVC: they fall back to the teal gradient. Rebuild: re-encode to H.264 MP4 (and/or AV1/WebM), strip audio, crop to landscape and portrait cuts, about 2 to 4 MB each, with a JPG/AVIF poster, and do not preload on mobile.

---

## 7. Accessibility issues spotted

- Autoplaying looping hero video (49 s) with no visible pause control (WCAG 2.2.2). Only the third-party Ally widget offers "pause animations". It does respect `prefers-reduced-motion` for CSS animations only, not the video.
- Skip link targets `#content`, which does not exist on the three real pages.
- Menu is two images; alt text is only "Leroy's Fish Shack menu, page 1/2". Screen-reader users get no menu at all.
- Hero text sits on video under a dark scrim (fine), but eyebrow colour `#F2C9BC` and `#8BE3C0` small mono text on textured backgrounds should be contrast-checked in the rebuild. `--lfs-buoy` `#C1442E` eyebrow text at 13px on sand `#F6F4EE` is about 4.7:1 (passes AA, just).
- Footer heading levels jump h2 to h4; two consecutive h2s in visit blocks.
- Live cam iframes have titles (good). Map iframes have titles (good).
- Accordions use real `<button>`s with `aria-expanded` (good); lightbox has `role="dialog"` and labelled buttons (good).
- Social links are icon-only with `aria-label` (good).
- Footer logo is the dark logo inverted with a CSS filter (works visually, no proper reversed file).
- Third-party overlay widget (Ally) is not a substitute for accessible markup; leave it out of the rebuild.

---

## 8. Privacy and hygiene

- Hero video file keeps its GPS tag (+26.9284 -082.0645) and device (iPhone 15 Pro Max). The full-size `IMG_*.jpeg` originals in the library keep iPhone EXIF (model, date). Strip metadata from anything we publish.
- Author archive exposes the WordPress login name "leroysfishshack".
- HTML comments expose internal notes (see section 4).
