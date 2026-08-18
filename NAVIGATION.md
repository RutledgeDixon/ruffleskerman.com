# Adding a page

Every page uses one shared shell: [`src/layouts/Layout.astro`](src/layouts/Layout.astro). It renders `<html>/<head>/<body>`, pulls in the global styles, and shows the nav bar.

## Minimal page

```astro
---
import Layout from "@/layouts/Layout.astro";
---

<Layout title="Page Title" description="Shown in the meta description">
  <!-- your content -->
</Layout>
```

`wordlebot.astro` is a good copy-paste starting point for a simple page.

## Layout props

| Prop | Default | Use it when |
|---|---|---|
| `title` | — (required) | Always — sets the `<title>` tag |
| `description` | none | You want a meta description |
| `navigationItems` | site-wide nav (Home/About/RuRuComms/Github/LinkedIn) | The page needs a different nav, e.g. `moviepolls/stats.astro` |
| `showNavigation` | `true` | The page has no nav at all, e.g. `create-account-p4A7EA1.astro` |
| `padTop` | `true` | `false` for full-bleed pages that manage their own top spacing, e.g. `index.astro`, `planner.astro` |

## Custom nav example

```astro
const navItems = [
  { label: "Home", href: "/" },
  { label: "Stats", href: "/moviepolls/stats" },
];
---
<Layout title="..." navigationItems={navItems}>
```

Each nav item: `{ label, href, external? }`. Internal links are root-relative (`/about`); set `external: true` for off-site links (opens in a new tab).

## Pages without the shared shell

`catancounter.astro`, `projects/mandlebrot.astro`, `projects/particles.astro`, and `projects/sorting.astro` render raw `<html>` themselves instead of using `Layout.astro` — they're full-screen canvas/WebGL demos with no nav and page-specific `<head>` needs (inline `<style>`, `<script>` tags for the WebGL pipeline). Follow one of those as a template if you're adding another canvas-style project page.

## Imports

Use the `@/` alias (maps to `src/`) for everything — `@/layouts/Layout.astro`, `@/styles/...`, `@/components/...`. Don't use relative (`../`) imports in pages; it's easy to get wrong when copy-pasting a page into a different folder depth.

# Updating global styling

- **Design tokens** (colors, shadows, gradients) live in [`src/styles/global.css`](src/styles/global.css) as CSS custom properties under `:root`. Change a value there and it updates everywhere that references `var(--the-token)`.
- **Site-wide rules** (box-sizing reset, the nav bar, the attribution footer) live in [`src/styles/generic.css`](src/styles/generic.css).
- **Page-specific rules** live in their own file (`planner.css`, `wordle.css`, `catan-players.css`, etc.) and are imported only by the page(s) that need them.

When a page's styles use a raw color/shadow value that already has a token in `global.css`, reference the token instead of hardcoding the value again — that's what keeps a single edit from requiring a find-and-replace across files.
