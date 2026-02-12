import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// EXACT repository name with slashes
const repoName = '/Sedrak.Heghine.Wedding/';

export default defineConfig({
  plugins: [react()],
  base: repoName
});
