import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, o as renderScript, r as renderTemplate } from './astro/server_BAyaMtYH.mjs';
import 'clsx';

const $$Astro = createAstro();
const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Navigation;
  const {
    items,
    logo,
    logoText = "RK",
    logoHref = "/",
    className = "",
    sticky = true
  } = Astro2.props;
  const base = "/";
  return renderTemplate`${maybeRenderHead()}<nav${addAttribute(`navigation-bar ${sticky ? "navigation-sticky" : ""} ${className}`, "class")}> <div class="navigation-container"> <div class="navigation-content"> <!-- Logo/Brand Section --> <div class="navigation-logo-section"> <a${addAttribute(base + logoHref.replace("/", ""), "href")} class="navigation-logo-link"> ${logo && renderTemplate`<img${addAttribute(logo, "src")} alt="Logo" class="navigation-logo-image">`} <span class="navigation-logo-text">${logoText}</span> </a> </div> <!-- Desktop Navigation --> <div class="navigation-desktop-menu"> <div class="navigation-menu-list"> ${items.map((item) => renderTemplate`<a${addAttribute(
    item.external ? item.href : base + item.href.replace("/", ""),
    "href"
  )}${addAttribute(`navigation-menu-link navigation-menu-link-${item.variant || "default"}`, "class")}${addAttribute(item.external ? "_blank" : void 0, "target")}${addAttribute(item.external ? "noopener noreferrer" : void 0, "rel")}> ${item.label} </a>`)} </div> </div> <!-- Mobile menu button --> <div class="navigation-mobile-menu"> <button type="button" class="navigation-mobile-menu-button" aria-controls="mobile-menu" aria-expanded="false"> <span class="sr-only">Open main menu</span> <!-- Menu icon --> <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> <!-- Close icon (hidden by default) --> <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> </div> <!-- Mobile Navigation Menu --> <div class="navigation-mobile-menu-list"> ${items.map((item) => renderTemplate`<div class="navigation-mobile-menu-item"> <a${addAttribute(
    item.external ? item.href : base + item.href.replace("/", ""),
    "href"
  )} class="navigation-mobile-menu-link"${addAttribute(item.external ? "_blank" : void 0, "target")}${addAttribute(item.external ? "noopener noreferrer" : void 0, "rel")}> ${item.label} </a> </div>`)} </div> </div> </nav> ${renderScript($$result, "C:/Users/rutle/source/repos/ruffleskerman.com/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/components/Navigation.astro", void 0);

export { $$Navigation as $ };
