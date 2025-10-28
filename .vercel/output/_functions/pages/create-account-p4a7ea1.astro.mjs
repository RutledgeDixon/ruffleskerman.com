import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent, m as maybeRenderHead, o as renderScript } from '../chunks/astro/server_BAyaMtYH.mjs';
import 'clsx';
/* empty css                                                  */
/* empty css                                                  */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$FundsLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FundsLayout;
  const { title } = Astro2.props;
  const base = "/";
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"${addAttribute(`${base}/favicon.svg`, "href")}><title>${title}</title>${renderHead()}</head> <body class="bg-blue-950 min-h-screen"> <div class="text-white"> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/layouts/fundsLayout.astro", void 0);

const $$CreateAccountP4A7EA1 = createComponent(async ($$result, $$props, $$slots) => {
  const title = "RK Apple Funds";
  return renderTemplate`${renderComponent($$result, "Layout", $$FundsLayout, { "title": title }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen py-12 px-4"> <div class="contact-container"> <h1 class="contact-title">RK - Apple Funds</h1> <p class="contact-subtitle">
Please create an account in order to transfer funds
</p> <form id="contact-form"> <!-- Name Field --> <div class="form-group"> <label for="name" class="form-label">
Full Name <span class="required">*</span> </label> <input type="text" id="name" name="name" required class="form-input" placeholder="Enter your full name"> </div> <!-- Email Field --> <div class="form-group"> <label for="email" class="form-label">
Email Address <span class="required">*</span> </label> <input type="email" id="email" name="email" required class="form-input" placeholder="your.email@example.com"> </div> <!-- Phone Field --> <div class="form-group"> <label for="phone" class="form-label">
Phone Number <span class="required">*</span> </label> <input type="tel" id="phone" name="phone" required class="form-input" placeholder="(555) 123-4567"> </div> <!-- Company Field (Optional) --> <div class="form-group"> <label for="company" class="form-label"> Company </label> <input type="text" id="company" name="company" class="form-input" placeholder="Your company name"> </div> <!-- Message Field (Optional) --> <div class="form-group"> <label for="message" class="form-label"> Message </label> <textarea id="message" name="message" rows="4" class="form-textarea" placeholder="Why are you creating an apple funds account?"></textarea> </div> <!-- Choice Text --> <div class="choice-text">Choose one of the following:</div> <!-- Submit Buttons --> <div class="button-container"> <button type="submit" class="submit-button" id="phone-verify-btn">
Verify with Phone Number
</button> <button type="submit" class="submit-button" id="email-verify-btn">
Verify with Email
</button> </div> </form> <!-- Status Message --> <div id="status-message" class="status-message" style="display: none;"> <p id="status-text"></p> </div> </div> </main> ${renderScript($$result2, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/create-account-p4A7EA1.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/create-account-p4A7EA1.astro", void 0);

const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/create-account-p4A7EA1.astro";
const $$url = "/create-account-p4A7EA1";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$CreateAccountP4A7EA1,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
