import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change this to your repository name
const repoName = '/sedrak-heghine-wedding/';

export default defineConfig({
  plugins: [react()],
  base: repoName
});
