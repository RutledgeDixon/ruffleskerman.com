// @ts-check

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import node from '@astrojs/node';

const base = '' // make this the directory where all the pages go


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  base: base, //where the project is deployed
  vite: {
    css: {
      postcss: './postcss.config.js',
    },
    resolve: {
      alias: {
        '@rollup/rollup-linux-x64-gnu': '@rollup/rollup-linux-x64-gnu'
      }
    }
  },

  integrations: [react()],
});