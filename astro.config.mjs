// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITEMAP_EXCLUDE = ['/404/'];

export default defineConfig({
  // PLACEHOLDER: set to the business's real domain.
  site: 'https://example.com',
  // Match the live site's URL style (WordPress uses trailing slashes) so links and rankings carry over.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Keep HTML whitespace rules (Astro 7 otherwise strips the space between inline elements).
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.some((path) => page.endsWith(path)),
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    server: { watch: { ignored: ['**/reference/**', '**/docs/**'] } },
    build: { assetsInlineLimit: 2048 },
  },
});
