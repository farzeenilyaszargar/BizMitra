# Vyapar Setu ERP

Vyapar Setu ERP is a desktop-first business app for kirana shops, mandi traders,
wholesalers, distributors, and Indian trade businesses. It includes billing,
inventory, parties, purchases, payments, mandi lots, reports, GST-ready UI, and
Hindi/English switching.

## Prerequisites

- Node.js `>=22.13.0`

## Desktop App

Run the desktop app in development:

```bash
npm install
npm run desktop:dev
```

Create a local unpacked desktop app for the current OS:

```bash
npm run desktop:pack
```

Create downloadable installers:

```bash
npm run desktop:build:mac
npm run desktop:build:win
npm run desktop:build:linux
```

Build outputs are written to `release/`.

## Web Preview

The same ERP interface can still run as a local web preview:

```bash
npm run dev
```

The hosted web deployment is optional and separate from the desktop app.

## Quality Checks

```bash
npm run lint
npm test
```
