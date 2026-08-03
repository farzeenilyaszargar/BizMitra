# BizMitra

BizMitra is a desktop-first business app for kirana shops, mandi traders,
wholesalers, distributors, and Indian trade businesses. It includes billing,
inventory, parties, purchases, payments, mandi lots, reports, GST-ready UI, and
Hindi/English/Punjabi switching.

## What Is Built So Far

- Electron desktop app packaging for local testing and OS-specific installers.
- Modal business onboarding with business type, owner details, GSTIN, city/state,
  invoice prefix, opening cash, and financial year.
- Fixed left sidebar with dashboard, billing, inventory, parties, purchases,
  payments, mandi trade, reports, and settings.
- Dashboard with sales, cash, pending collection, low stock, owner view, and
  local sync status.
- Sales billing workflow with GST totals, payment modes, invoice numbering, and
  print/export-ready structure.
- Inventory with demo items, stock ledger, low stock alerts, and item creation.
- Searchable GST/HSN catalog that lists possible item matches first; clicking a
  match autofills HSN, GST, unit, and rates.
- Locked GST value after selecting an official catalog item.
- Parties, purchases, payments, mandi settlement, reports, and settings screens.
- Language dropdown for English, Hindi, and Punjabi labels.

BizMitra is currently a functional prototype. It does not yet include a
production backend, live official GST API integration, user accounts,
multi-device sync, or statutory filing automation.

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
