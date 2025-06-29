import { defineConfig } from 'vite';

export default defineConfig({
  base: '/goit-js-hw-12/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
