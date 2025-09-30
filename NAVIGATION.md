# Navigation Component Documentation

## Overview
The Navigation component is a customizable top navigation bar for your Astro site. It includes responsive design with mobile menu support and can be easily customized per page.

## Basic Usage

### Default Navigation
The navigation component is automatically included in the `mainLayout.astro` and will show default navigation items:

```astro
<Layout title="Page Title" description="Page description">
  <!-- Your content -->
</Layout>
```

### Custom Navigation Items
You can customize navigation items by passing a `navigationItems` prop:

```astro
---
// Define custom navigation items
const customNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "GitHub", href: "https://github.com/username", external: true }
];
---

<Layout title="Page Title" navigationItems={customNavItems}>
  <!-- Your content -->
</Layout>
```

### Disable Navigation
To hide the navigation on specific pages:

```astro
<Layout title="Page Title" showNavigation={false}>
  <!-- Your content without navigation -->
</Layout>
```

## Navigation Item Properties

Each navigation item is an object with the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | string | Yes | The text to display in the navigation |
| `href` | string | Yes | The URL or path to navigate to |
| `external` | boolean | No | Set to `true` for external links (opens in new tab) |
| `variant` | string | No | Button style variant (for future use) |

## Navigation Component Properties

The Navigation component accepts these props:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | NavigationItem[] | Required | Array of navigation items |
| `logo` | string | undefined | URL to logo image |
| `logoText` | string | "RK" | Text to display as logo |
| `logoHref` | string | "/" | Link for the logo |
| `className` | string | "" | Additional CSS classes |
| `sticky` | boolean | true | Whether navigation sticks to top when scrolling |

## Examples

### Basic Navigation with Logo
```astro
---
const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" }
];
---

<Layout 
  title="My Site" 
  navigationItems={navItems}
>
  <div>Your page content</div>
</Layout>
```

### Navigation with External Links
```astro
---
const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "GitHub", href: "https://github.com/yourusername", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourprofile", external: true }
];
---

<Layout title="Developer Portfolio" navigationItems={navItems}>
  <!-- Your content -->
</Layout>
```

### Page-Specific Navigation
Different pages can have different navigation items:

```astro
// pages/admin.astro
---
const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Back to Site", href: "/" }
];
---

<Layout title="Admin Panel" navigationItems={adminNavItems}>
  <!-- Admin content -->
</Layout>
```

## Styling and Customization

### Custom CSS Classes
You can add custom styling by passing a `className` prop to the Layout:

```astro
<Layout 
  title="Custom Styled Page" 
  navigationItems={navItems}
  className="bg-blue-600 text-white"
>
  <!-- Your content -->
</Layout>
```

### Logo Customization
```astro
<Layout 
  title="My Site"
  logoText="My Brand"
  logoHref="/home"
  navigationItems={navItems}
>
  <!-- Your content -->
</Layout>
```

### With Logo Image
```astro
<Layout 
  title="My Site"
  logo="/images/logo.png"
  logoText="My Brand"
  navigationItems={navItems}
>
  <!-- Your content -->
</Layout>
```

## Mobile Responsiveness

The navigation automatically:
- Collapses to a hamburger menu on mobile devices
- Shows/hides menu items when the hamburger is clicked
- Closes the menu when clicking outside
- Maintains accessibility with proper ARIA attributes

## Layout Properties Reference

The `mainLayout.astro` accepts these properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | Required | Page title for `<title>` tag |
| `description` | string | undefined | Meta description |
| `showNavigation` | boolean | true | Whether to show navigation |
| `navigationItems` | NavigationItem[] | Default items | Custom navigation items |

## Default Navigation Items

If no custom navigation items are provided, these defaults are used:
- Home (/)
- Listen (/listen)
- Broadcast (/broadcast)
- LinkedIn (external link)

You can modify these defaults in `src/layouts/mainLayout.astro`.