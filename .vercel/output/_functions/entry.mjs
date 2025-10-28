import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C5oVcJ5Q.mjs';
import { manifest } from './manifest_Cwir5UVC.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/access-db.astro.mjs');
const _page3 = () => import('./pages/api/login.astro.mjs');
const _page4 = () => import('./pages/api/submit-contact.astro.mjs');
const _page5 = () => import('./pages/broadcast.astro.mjs');
const _page6 = () => import('./pages/catancounter.astro.mjs');
const _page7 = () => import('./pages/create-account-p4a7ea1.astro.mjs');
const _page8 = () => import('./pages/listen.astro.mjs');
const _page9 = () => import('./pages/planner.astro.mjs');
const _page10 = () => import('./pages/wordlebot.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/access-db.ts", _page2],
    ["src/pages/api/login.ts", _page3],
    ["src/pages/api/submit-contact.ts", _page4],
    ["src/pages/broadcast.astro", _page5],
    ["src/pages/catancounter.astro", _page6],
    ["src/pages/create-account-p4A7EA1.astro", _page7],
    ["src/pages/listen.astro", _page8],
    ["src/pages/planner.astro", _page9],
    ["src/pages/wordlebot.astro", _page10],
    ["src/pages/index.astro", _page11]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0d3d73b5-b505-4746-b88d-0619d5e0c288",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
