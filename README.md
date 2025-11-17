# Bling.it - Next.js Starter

This is a minimal Next.js starter created for the `Bling.it.com` site. Drop your existing Next.js files into this structure or copy the contents into your Windows folder `C:\Users\Kristijonas\Documents\Bling.it.com`.

## Setup

1. Install dependencies:

```powershell
cd Bling.it.com; npm install
```

2. Start the dev server:

```powershell
npm run dev
```

Open http://localhost:3000 to view the site.

## Files added

- `pages` - Next.js pages
- `components` - Example component
- `styles` - Global styles
- `package.json` - Next.js scripts & dependencies

## Copy instruction

If you want the same structure in your Windows folder:

```powershell
# from your project's root
robocopy . "C:\Users\Kristijonas\Documents\Bling.it.com" /s /e /njh /njs
```

If you'd prefer a zip, I can prepare one (requires workspace access to save zip).

## Tailwind CSS (optional but recommended)

This project uses Tailwind utility classes in the configurator UI. To install Tailwind locally run:

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then ensure `tailwind.config.js` content points to `pages` and `components`, and `styles/globals.css` includes Tailwind directives. The project already includes a minimal `tailwind.config.js` and `postcss.config.js` in this scaffold.

## New page

The Bling configurator is available at `/bling-configurator`.

If you copy the scaffold into your existing Next.js app, add `pages/bling-configurator.js` and `components/BlingItConfigurator.jsx` and ensure the global CSS loads the Tailwind directives as seen in `styles/globals.css`.