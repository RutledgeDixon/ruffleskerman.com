import { e as createComponent, n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BAyaMtYH.mjs';
import { $ as $$ListenLayout } from '../chunks/listenLayout_Dl-TNSaW.mjs';
/* empty css                                                  */
import { B as Button } from '../chunks/button_DHK_v4Xg.mjs';
export { renderers } from '../renderers.mjs';

const $$Listen = createComponent(($$result, $$props, $$slots) => {
  const baseURL = "/";
  return renderTemplate`${renderComponent($$result, "Layout", $$ListenLayout, { "title": "RK Listen", "description": "Listen to audio content" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4"> <div class="max-w-2xl mx-auto flex justify-center items-center"> ${renderComponent($$result2, "ListenAudio", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/sound/ListenAudio", "client:component-export": "default" })} </div> <div class="text-center py-12"> <h1 class="text-4xl font-bold text-gray-400 mb-6">
Listen to Broadcast
</h1> <p class="text-lg text-gray-400 mb-8">
Only if the server is up lol
</p> </div> <div> <!-- This is where the mute and ask question buttons will go --> <div class="flex flex-col items-center space-y-4"> ${renderComponent($$result2, "Button", Button, { "variant": "letu", "className": "px-6 py-2" }, { "default": ($$result3) => renderTemplate`Mute` })} ${renderComponent($$result2, "Button", Button, { "variant": "letu", "className": "px-6 py-2" }, { "default": ($$result3) => renderTemplate`Ask Question` })} </div> </div> <div class="text-center mt-8"> <a${addAttribute(baseURL, "href")} class="inline-block mr-4"> ${renderComponent($$result2, "Button", Button, { "variant": "letu", "className": "px-6 py-2" }, { "default": ($$result3) => renderTemplate`← Back to Home` })} </a> <a href="/broadcast" class="inline-block"> ${renderComponent($$result2, "Button", Button, { "variant": "letu", "className": "px-6 py-2" }, { "default": ($$result3) => renderTemplate`Start Broadcasting →` })} </a> </div> </div> ` })}`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/listen.astro", void 0);
const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/listen.astro";
const $$url = "/listen";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Listen,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
