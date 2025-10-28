// @ts-check

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

const base = '' // make this the directory where all the pages go


// https://astro.build/config
export default defineConfig({
  output: 'static',
  base: base, //where the project is deployed
  vite: {
    css: {
      postcss: './postcss.config.js',
    }
  },

  integrations: [react()],
});