/**
 * Analytics. The Google tag is the one already on the live site. It is loaded
 * only on the production hostname, after the page is idle, so local and
 * preview builds never send data and it never blocks rendering.
 */
import { analytics } from '../data/site';

let loaded = false;

function isProduction(): boolean {
  const host = window.location.hostname.replace(/^www\./, '');
  return host === analytics.productionHost;
}

export function loadAnalytics(): void {
  if (loaded || !analytics.googleTagId || !isProduction()) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  // gtag must push the real `arguments` object, not an array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', analytics.googleTagId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleTagId}`;
  document.head.append(script);
}

/** Sends an event if analytics is running; otherwise does nothing. */
export function track(event: string, params: Record<string, string | number | boolean> = {}): void {
  window.gtag?.('event', event, params);
}
