import { e as createComponent, n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BAyaMtYH.mjs';
import { $ as $$ListenLayout } from '../chunks/listenLayout_Dl-TNSaW.mjs';
/* empty css                                                  */
import { B as Button } from '../chunks/button_DHK_v4Xg.mjs';
export { renderers } from '../renderers.mjs';

const $$Broadcast = createComponent(($$result, $$props, $$slots) => {
  const baseURL = "/";
  return renderTemplate`${renderComponent($$result, "Layout", $$ListenLayout, { "title": "RK Broadcast", "description": "RK Broadcast" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid place-items-center h-screen content-center"> <a${addAttribute(baseURL, "href")} class="p-4 underline"> ${renderComponent($$result2, "Button", Button, { "variant": "letu" }, { "default": ($$result3) => renderTemplate`Go home` })} </a> ${renderComponent($$result2, "BroadcastSoundbyte", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/sound/BroadcastSoundbyte", "client:component-export": "default" })} ${renderComponent($$result2, "BroadcastMic", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/sound/BroadcastMic", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/broadcast.astro", void 0);
const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/broadcast.astro";
const $$url = "/broadcast";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Broadcast,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
