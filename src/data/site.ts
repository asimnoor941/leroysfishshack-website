/**
 * Single source of truth for facts that appear on more than one page.
 *
 * EVERY VALUE BELOW IS A PLACEHOLDER. Replace each one with the real fact from
 * the live site (reference/original-site/content) or from the owner. Do not
 * invent facts, numbers, prices, testimonials or team details.
 */

export const site = {
  name: 'Business Name',
  legalName: 'Business Name LLC',
  tagline: 'What the business does, in a few words',
  url: 'https://example.com',
  description: 'One or two sentences, taken from the live site, describing the business.',
  locale: 'en_US',
} as const;

export const contact = {
  phoneDisplay: '(000) 000-0000',
  phoneHref: 'tel:+10000000000',
  /** schema.org telephone, E.164-ish. */
  phoneSchema: '+1-000-000-0000',
  email: 'hello@example.com',
  emailHref: 'mailto:hello@example.com',
  /** Short location line for the footer, e.g. the city or service region. */
  serviceLine: 'City, State',
} as const;

/** Leave a value empty ('') to hide that icon. */
export const social: { facebook: string; instagram: string } = {
  facebook: '',
  instagram: '',
};

/** The main call to action used in the header, footer and CTA bands. */
export const PRIMARY_CTA = { label: 'Get in Touch', href: '/contact-us/' } as const;

export const analytics = {
  /** Google tag ID from the live site, if it has one. Only loaded on the production hostname. */
  googleTagId: '' as string,
  productionHost: 'example.com',
} as const;

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/** Keep every URL identical to the live site (trailing slash) so rankings carry over. */
export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about-us/' },
  { label: 'Contact', href: '/contact-us/' },
];

/** Footer link column. */
export const footerLinks: NavItem[] = [
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contact Us', href: '/contact-us/' },
];
