import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BAyaMtYH.mjs';
/* empty css                                                  */
/* empty css                                     */
import { $ as $$Navigation } from '../chunks/Navigation_DFJyeg4y.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ProjectLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProjectLayout;
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
      label: "Github",
      href: "https://github.com/rutledgedixon",
      external: true
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/rutledgedixon",
      external: true
    }
  ];
  const navItems = navigationItems || defaultNavigationItems;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"${addAttribute(`${base}/favicon.svg`, "href")}>${description && renderTemplate`<meta name="description"${addAttribute(description, "content")}>`}<title>${title}</title>${renderHead()}</head> <body class="bg-blue-950 min-h-screen"> ${showNavigation && renderTemplate`${renderComponent($$result, "Navigation", $$Navigation, { "items": navItems })}`} <div class="text-white"> <main${addAttribute(showNavigation ? "pt-16" : "", "class")}> ${renderSlot($$result, $$slots["default"])} </main> </div> </body></html>`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/layouts/projectLayout.astro", void 0);

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$ProjectLayout, { "title": "About", "description": "About" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-start gap-4"> <div class="card bg-white shadow-lg rounded-lg p-6 m-4 flex-1"> <h2 class="text-gray-800 font-bold mb-2">Education</h2> <p class="text-gray-700 whitespace-pre-line">
Bachelor of Science in Computer Science Engineering from Letourneau University.
                Minor in mathematics.
                GPA 4.0 - Expected graduation date: May 2026
</p> </div> <div class="flex flex-col gap-4 flex-1"> <div class="card bg-white shadow-lg rounded-lg p-6 m-4 flex-1"> <h2 class="text-gray-800 font-bold mb-2">Experience</h2> <p class="text-gray-700 whitespace-pre-line">
Software Development / IT Intern at Righteous Rides
                    - Summer 2025 - Warrenton, MO
                    - Developed web applications using react and electron
                    - Integrated databases and CRMs with APIs
                    - Wrote Python scripts to automate CRM management tasks
                    - Provided IT support for internal systems and server infrastructure
</p> </div> <div class="card bg-white shadow-lg rounded-lg p-6 m-4 flex-1"> <h2 class="text-gray-800 font-bold mb-2">Hobbies</h2> <p class="text-gray-700 whitespace-pre-line">
- Playing piano
                    - Making tea
                    - Swimming
                    - Working on this website
                    - Spending time with family
</p> </div> </div> </div> ` })}`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/about.astro", void 0);

const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$About,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
