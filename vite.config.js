import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative asset paths so the site works whether it is served from
  // a repository subpath or a custom domain root.
  base: './'
});
