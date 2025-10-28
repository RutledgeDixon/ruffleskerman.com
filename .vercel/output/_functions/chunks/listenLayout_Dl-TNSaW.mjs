import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent } from './astro/server_BAyaMtYH.mjs';
/* empty css                                          */
/* empty css                             */
import { $ as $$Navigation } from './Navigation_DFJyeg4y.mjs';

const $$Astro = createAstro();
const $$ListenLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ListenLayout;
  const {
    title,
    description,
    showNavigation = true,
    navigationItems
  } = Astro2.props;
  const base = "/";
  const defaultNavigationItems = [
    { label: "Home", href: "/" },
    {
      label: "Google",
      href: "https://google.com",
      external: true
    }
  ];
  const navItems = navigationItems || defaultNavigationItems;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"${addAttribute(`${base}/favicon.svg`, "href")}>${description && renderTemplate`<meta name="description"${addAttribute(description, "content")}>`}<title>${title}</title>${renderHead()}</head> <body class="bg-blue-950 min-h-screen"> ${showNavigation && renderTemplate`${renderComponent($$result, "Navigation", $$Navigation, { "items": navItems })}`} <div class="text-white"> <main${addAttribute(showNavigation ? "pt-4" : "", "class")}> ${renderSlot($$result, $$slots["default"])} </main> </div> </body></html>`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/layouts/listenLayout.astro", void 0);

export { $$ListenLayout as $ };
