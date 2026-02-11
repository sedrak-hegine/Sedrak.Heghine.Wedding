import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change this to your repo name if not user page
const repoName = '/sedrak-heghine-wedding/';

export default defineConfig({
  plugins: [react()],
  base: repoName
});
