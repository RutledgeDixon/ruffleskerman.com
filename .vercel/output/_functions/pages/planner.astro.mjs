import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BAyaMtYH.mjs';
/* empty css                                                  */
/* empty css                                     */
import { $ as $$Navigation } from '../chunks/Navigation_DFJyeg4y.mjs';
/* empty css                                   */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { B as Button } from '../chunks/button_DHK_v4Xg.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$PlannerLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PlannerLayout;
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
      label: "Github - ex navItem",
      href: "https://github.com/rutledgedixon",
      external: true
    }
  ];
  const navItems = navigationItems || defaultNavigationItems;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"${addAttribute(`${base}/favicon.svg`, "href")}>${description && renderTemplate`<meta name="description"${addAttribute(description, "content")}>`}<title>${title}</title>${renderHead()}</head> <body class="bg-blue-950 min-h-screen"> ${showNavigation && renderTemplate`${renderComponent($$result, "Navigation", $$Navigation, { "items": navItems })}`} <div class="text-white"> <main${addAttribute(showNavigation ? "pt-16" : "", "class")}> ${renderSlot($$result, $$slots["default"])} </main> </div> </body></html>`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/layouts/plannerLayout.astro", void 0);

function Login({ setUserData }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        console.log("Login successful, storing user data");
        setUserData(result.user);
        console.log("Stored user data:", result.user);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error2) {
      setError("An error occurred");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "login-container", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Login" }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-500 mb-4", children: error }),
    /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Username", className: "border p-2 mb-4 w-full", required: true }),
    /* @__PURE__ */ jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password", className: "border p-2 mb-4 w-full", required: true }),
    /* @__PURE__ */ jsx(Button, { variant: "letu", type: "submit", children: "Login" })
  ] }) });
}

function CategoryCard({ title, description, progress, showCards, toggleShowCards }) {
  return /* @__PURE__ */ jsxs("div", { className: "category-card", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3", children: title }),
    /* @__PURE__ */ jsx("p", { children: description }),
    /* @__PURE__ */ jsx("progress", { value: progress, max: "100" }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(Button, { variant: "letu", className: "px-8 py-3 text-lg", onClick: toggleShowCards, children: showCards ? "Hide" : "Show" }) })
  ] });
}

function Card({ title, description, answer, updateAnswer, imageurl, url, updateUrl, checked, toggleChecked, saved, saveFunc }) {
  return /* @__PURE__ */ jsxs("div", { className: "planning-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "planning-card-top", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-2", children: description })
      ] }),
      !saved && /* @__PURE__ */ jsx(Button, { type: "button", variant: "letu", className: "px-4 py-2 text-sm self-start", onClick: (e) => {
        e.preventDefault();
        saveFunc();
      }, children: "Save" })
    ] }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value: answer,
        onChange: (e) => updateAnswer(e.target.value),
        placeholder: "Type your answer...",
        className: "w-full p-1 mb-2 border rounded"
      }
    ),
    imageurl && imageurl !== "" && /* @__PURE__ */ jsx("img", { src: imageurl, alt: title }),
    /* @__PURE__ */ jsxs("div", { className: "planning-card-top", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "url-input",
            type: "url",
            value: url,
            onChange: (e) => updateUrl(e.target.value),
            placeholder: "Enter URL here"
          }
        ),
        url && url !== "" && /* @__PURE__ */ jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", children: "Visit site" })
      ] }),
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked, onChange: (e) => toggleChecked?.(e.target.checked) })
    ] })
  ] });
}

function DisplayCategories({ userData, saveUserData }) {
  if (!userData || !userData.categories) {
    return /* @__PURE__ */ jsx("div", { children: "No user data or categories available." });
  }
  const [userDataState, setUserDataState] = useState(userData);
  const [savedCard, setSavedCard] = useState(userData.categories.map((cat) => cat.cards.map((card) => true)));
  const categories = userData.categories;
  const progress = (category) => {
    const checkedCards = category.cards.filter((card) => card.checked).length;
    const totalCards = category.cards.length;
    return totalCards === 0 ? 0 : Math.round(checkedCards / totalCards * 100);
  };
  const [showCards, setShowCards] = useState(userData.categories.map((cat) => cat.showCards));
  const toggleShowCards = (index) => {
    console.log("Toggling showCards for index:", index);
    const newShowCards = [...showCards];
    newShowCards[index] = !newShowCards[index];
    setShowCards(newShowCards);
  };
  const [urls, setUrls] = useState(userData.categories.map((cat) => cat.cards.map((card) => card.url)));
  const updateUrl = (catIndex, cardIndex, newUrl) => {
    console.log(`Updating URL for cat ${catIndex} card ${cardIndex} to ${newUrl}`);
    const newUrls = [...urls];
    newUrls[catIndex][cardIndex] = newUrl;
    setUrls(newUrls);
    setSavedCard((prevSaved) => {
      const newSaved = [...prevSaved];
      newSaved[catIndex][cardIndex] = false;
      return newSaved;
    });
  };
  const [cardChecked, setCardChecked] = useState(userData.categories.map((cat) => cat.cards.map((card) => card.checked)));
  const toggleCardChecked = (catIndex, cardIndex) => {
    console.log("Toggling card checked for category index:", catIndex, "and card index:", cardIndex);
    const newCardChecked = [...cardChecked];
    newCardChecked[catIndex][cardIndex] = !cardChecked[catIndex][cardIndex];
    setCardChecked(newCardChecked);
    setSavedCard((prevSaved) => {
      const newSaved = [...prevSaved];
      newSaved[catIndex][cardIndex] = false;
      return newSaved;
    });
  };
  const [answers, setAnswers] = useState(userData.categories.map((cat) => cat.cards.map((card) => card.answer)));
  const updateAnswer = (catIndex, cardIndex, newAnswer) => {
    console.log(`Updating answer for cat ${catIndex} card ${cardIndex} to ${newAnswer}`);
    const newAnswers = [...answers];
    newAnswers[catIndex][cardIndex] = newAnswer;
    setAnswers(newAnswers);
    setSavedCard((prevSaved) => {
      const newSaved = [...prevSaved];
      newSaved[catIndex][cardIndex] = false;
      return newSaved;
    });
  };
  const saveCard = async (catIndex, cardIndex) => {
    console.log(`Saving card for cat ${catIndex} card ${cardIndex}`);
    const newUserData = { ...userDataState };
    newUserData.categories[catIndex].cards[cardIndex] = {
      ...newUserData.categories[catIndex].cards[cardIndex],
      answer: answers[catIndex][cardIndex],
      url: urls[catIndex][cardIndex],
      checked: cardChecked[catIndex][cardIndex]
    };
    setUserDataState(newUserData);
    setSavedCard((prevSaved) => {
      const newSaved = [...prevSaved];
      newSaved[catIndex][cardIndex] = true;
      return newSaved;
    });
    await saveUserData(newUserData);
  };
  return /* @__PURE__ */ jsx("div", { className: "categories-container", children: categories.map((category, catIndex) => /* @__PURE__ */ jsxs("div", { className: "category-section", children: [
    /* @__PURE__ */ jsx(
      CategoryCard,
      {
        title: category.title,
        description: category.description,
        progress: progress(category),
        showCards: showCards[catIndex],
        toggleShowCards: () => toggleShowCards(catIndex)
      },
      catIndex
    ),
    showCards[catIndex] && category.cards.map((card, cardIndex) => /* @__PURE__ */ jsx(
      Card,
      {
        title: card.title,
        description: card.description,
        answer: answers[catIndex][cardIndex],
        updateAnswer: (newAnswer) => updateAnswer(catIndex, cardIndex, newAnswer),
        imageurl: card.imageurl,
        url: urls[catIndex][cardIndex],
        updateUrl: (newUrl) => updateUrl(catIndex, cardIndex, newUrl),
        checked: cardChecked[catIndex][cardIndex],
        toggleChecked: () => toggleCardChecked(catIndex, cardIndex),
        saved: savedCard[catIndex][cardIndex],
        saveFunc: () => saveCard(catIndex, cardIndex)
      },
      cardIndex
    ))
  ] }, catIndex)) });
}

function PlannerPage() {
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const saveUserData = async (newUserData) => {
    try {
      const response = await fetch("/api/access-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          name: userName,
          userData: newUserData
        })
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Save successful:", result.message);
      } else {
        console.error("Save failed:", result.error);
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };
  const handleLogin = (data) => {
    setUserData(data);
    setUserName(data.name);
  };
  return /* @__PURE__ */ jsxs("div", { className: "planner-page", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-400 my-8 text-center", children: userName ? `${userName}'s Planner` : "RK Planner" }),
    !userData ? /* @__PURE__ */ jsx(Login, { setUserData: handleLogin }) : /* @__PURE__ */ jsx(DisplayCategories, { userData, saveUserData })
  ] });
}

const $$Planner = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$PlannerLayout, { "title": "RK Planner", "description": "Chocolate" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4"> ${renderComponent($$result2, "PlannerPage", PlannerPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/planner/plannerPage.tsx", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/planner.astro", void 0);

const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/planner.astro";
const $$url = "/planner";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Planner,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
