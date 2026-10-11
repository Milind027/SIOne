# TableCraft — Restaurant OS & Customer QR Dining App

A production-grade restaurant operating system featuring mobile-first table QR ordering, real-time kitchen kanban display, POS billing with WhatsApp invoice generation, recipe inventory auto-deduction, and customer loyalty rewards.

---

## 🌟 Key Features

### 1. Customer QR App (`/menu?table=N`)
- **Table Auto-Detection:** Automatically loads the table number from the URL query parameter (e.g., `?table=4`) with an in-app table switcher.
- **Curated Menu:** Starters, Wood-Fired Pizza, Artisan Burgers, Fresh Pastas, Desserts, and Craft Beverages with Veg/Non-Veg filters, spice customizations, and live search.
- **Offers & Coupons:** Zomato-style promo card carousel (`FIRSTBITE`, `CRAFT100`, `GOLDMEMBER`, `SWEETTREAT`) with instant 1-tap apply.
- **Cart & Direct Order:** Custom kitchen notes, diner name & phone verification, itemized tax calculations (5% GST + 5% service charge), and instant order push to the kitchen.
- **Live Kitchen Cam & Tracking:** Real-time 5-stage order progress timeline with an animated `LIVE 🔴` station camera feed (simulating woodstone oven sizzle & temperatures).
- **"While You Wait" Strip:** Highlights trending dishes ordered at nearby tables with 1-tap add-to-order capability.
- **Loyalty Card & Stamps:** Points balance, Gold membership tier status with progress bar, and a 10-stamp digital card with celebratory reward redemption.
- **Refer & Earn:** Unique invite link with a 1-tap WhatsApp sharing integration.
- **Order History:** Recent 30-day itemized receipts with quick reorder, plus a locked older history archive demonstrating TableCraft Pro features.
- **Anonymous Feedback:** 5-point emoji rating (`😍 😃 😐 🙁 😡`), tag selection, and direct feedback submission to management.
- **Google Review Booster:** 5-star Google review prompt with copyable feedback templates.

### 2. Owner Operating System & POS (`/owner`)
- **Executive Metrics:** Today's settled revenue, occupied tables count, pending kitchen orders, and average ticket turnaround.
- **Live Orders Kanban:** Drag/advance orders across Received, Preparing, Ready, and Served states with real-time kitchen bell chimes.
- **POS Checkout & WhatsApp Invoices:** Itemized bills supporting UPI QR, Cards, and Cash, with a 1-tap formatted WhatsApp invoice dispatch.
- **Inventory with Auto-Deduction:** Raw recipe ingredients (Truffle oil, Sourdough balls, Mozzarella, Brioche buns) automatically decrement whenever a dish is ordered.
- **Menu Management:** Instant price adjustments and 86'd out-of-stock toggles.
- **Customer CRM:** Guest profiles, visit counts, lifetime spend, loyalty tier management, and table feedback monitoring.
- **Table Stand QR Generator:** Generate and print scan-to-order QR stand acrylic signs for tables 1 through 24.

### 3. Demo Mode & Simulator
- **Interactive Landing Page (`/`):** Quick-launch cards for both Owner OS and Customer QR App with dynamic on-screen QR codes.
- **Simulate Rush Hour:** Triggers 5 incoming rush orders across multiple tables over 10 seconds to showcase live kitchen activity and inventory deductions.
- **Interactive Demo Guide:** 6-step walkthrough highlighting dashboard, kanban, billing, WhatsApp invoices, QR ordering, and inventory.
- **Real-Time Cross-Window Sync:** Built with `BroadcastChannel` and local storage synchronization—placing an order in one tab updates the kitchen board in another tab instantly without a backend server!

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone repository or navigate to directory
cd tablecraft

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Landing Page & Demo Switcher:** `http://localhost:3000/`
- **Owner Dashboard:** `http://localhost:3000/owner`
- **Customer QR App (Table 4):** `http://localhost:3000/menu?table=4`

---

## 🚢 Deployment Steps

### Deploying to Vercel
1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset will automatically detect **Vite**.
5. Set Build & Output settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**.

*Tip for Single Page App routing on Vercel:* Ensure a `vercel.json` exists with rewrites if routing directly to `/menu`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploying to Netlify
1. Sign in to [Netlify](https://netlify.com) and select **"Add new site" > "Import an existing project"**.
2. Connect your Git provider and choose the repository.
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add a `_redirects` file in `public/` (or set redirect rule in `netlify.toml`):
```text
/*    /index.html   200
```
5. Click **"Deploy TableCraft"**.

---

## 📂 Project Architecture

```
├── index.html                   # HTML Entry point with Google Fonts
├── package.json                 # Project dependencies & scripts
├── src/
│   ├── App.tsx                  # Main router & root application
│   ├── index.css                # Tailwind CSS v4 styling rules
│   ├── main.tsx                 # React DOM mount point
│   ├── data/
│   │   ├── menuData.ts          # Curated culinary dishes, ingredients & recipes
│   │   ├── couponsData.ts       # Zomato-style offers & promo codes
│   │   ├── initialOrders.ts     # Initial orders, statuses & past records
│   │   ├── inventoryData.ts     # Ingredient SKUs, stock levels & thresholds
│   │   └── customerData.ts      # CRM profiles & loyalty points
│   ├── store/
│   │   └── restaurantStore.tsx  # React Context, reactive state & BroadcastChannel
│   ├── lib/
│   │   ├── audioChime.ts        # Web Audio API kitchen chimes
│   │   ├── formatters.ts        # Currency, elapsed time & string utils
│   │   └── qrUtils.ts           # Dynamic SVG QR code generator
│   ├── components/
│   │   ├── common/              # Modals, ribbons, dish graphics & demo tour
│   │   ├── customer/            # QR header, carousel, cart, live kitchen cam, loyalty
│   │   └── owner/               # Live Kanban, POS billing, WhatsApp modal, inventory
│   └── pages/
│       ├── LandingPage.tsx      # Welcome landing with QR & quick-switchers
│       ├── CustomerQrApp.tsx    # Mobile-first QR dining application (/menu?table=N)
│       └── OwnerDashboard.tsx   # Complete restaurant POS & management system
```

---

## 📄 License
Apache-2.0
