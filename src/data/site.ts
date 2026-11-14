/**
 * Single source of truth for facts that appear on more than one page.
 * Every value comes from the live site (reference/original-site/content and
 * docs/SITE-AUDIT.md). Do not invent facts, numbers, prices or testimonials.
 */

export const site = {
  name: "Leroy's Fish Shack",
  legalName: "Leroy's Fish Shack",
  tagline: 'From Our Boats To Your Table',
  url: 'https://leroysfishshack.com',
  description:
    "Fresh Gulf seafood, dockside at Fishermen's Village. Leroy's Fish Shack serves waterfront dining, a rum bar, and Charlotte Harbor views in Punta Gorda, FL.",
  /** Footer blurb, live wording. */
  blurb:
    "Locally harvested, Florida-fresh seafood. Upscale plates, laid-back waterfront shack, and a rum bar worth staying for. Dockside at Fishermen's Village, Punta Gorda.",
  locale: 'en_US',
} as const;

export const contact = {
  phoneDisplay: '(941) 397-5005',
  phoneHref: 'tel:+19413975005',
  /** schema.org telephone, E.164-ish. */
  phoneSchema: '+1-941-397-5005',
  street: '1200 Retta Esplanade, Unit J33-35',
  city: 'Punta Gorda',
  region: 'FL',
  postcode: '33950',
  /** Short location line for the footer. */
  serviceLine: "Fishermen's Village, Punta Gorda, FL",
  hours: 'Open Daily at 11am',
  directionsHref:
    'https://www.google.com/maps/dir/?api=1&destination=1200+Retta+Esplanade+Unit+J33-35,+Punta+Gorda,+FL+33950',
  mapEmbed: 'https://www.google.com/maps?q=1200+Retta+Esplanade+Unit+J33-35,+Punta+Gorda,+FL+33950&output=embed',
} as const;

export const links = {
  giftCards: 'https://order.toasttab.com/egiftcards/leroys-fish-shack-pg-1200-west-retta-esplanade',
  /** ipcamlive players on the patio. */
  camLeft: 'https://g1.ipcamlive.com/player/player.php?alias=6ab155fbabf71',
  camRight: 'https://g1.ipcamlive.com/player/player.php?alias=6ab157578f221',
} as const;

/** Leave a value empty ('') to hide that icon. */
export const social: { facebook: string; instagram: string } = {
  facebook: 'https://www.facebook.com/profile.php?id=61559071051762',
  instagram: 'https://www.instagram.com/leroys_fish_shack/',
};

/** The main call to action used in the header, footer and CTA bands. */
export const PRIMARY_CTA = { label: 'Reserve a Table', href: '/reservations/' } as const;

export const analytics = {
  /** Google tag ID from the live site. Only loaded on the production hostname. */
  googleTagId: 'GT-M6QWFDDG' as string,
  productionHost: 'leroysfishshack.com',
} as const;

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/** Keep every URL identical to the live site (trailing slash) so rankings carry over. */
export const nav: NavItem[] = [
  { label: 'Menu', href: '/#menu' },
  { label: 'Rum Bar', href: '/#rum-bar' },
  { label: 'The Dock', href: '/#dock' },
  { label: 'Private Events', href: '/private-events/' },
  { label: 'Reservations', href: '/reservations/' },
];

/** Footer link column. */
export const footerLinks: NavItem[] = [
  { label: 'Menu', href: '/#menu' },
  { label: 'Rum Bar', href: '/#rum-bar' },
  { label: 'Live Dock Cam', href: '/#dock' },
  { label: 'Private Events', href: '/private-events/' },
  { label: 'Reservations', href: '/reservations/' },
  { label: 'E-Gift Cards', href: '/#gift-cards' },
];
