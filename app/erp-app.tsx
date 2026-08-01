"use client";

import type { CSSProperties } from "react";
import {
  BarChart3,
  Bell,
  Boxes,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Download,
  FileText,
  Globe2,
  Home,
  IndianRupee,
  Languages,
  Menu,
  PackagePlus,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  Truck,
  Users,
  Wifi,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Language = "en" | "hi";
type ModuleKey =
  | "dashboard"
  | "billing"
  | "inventory"
  | "parties"
  | "purchases"
  | "payments"
  | "mandi"
  | "reports";

const copy = {
  en: {
    app: "Vyapar Setu",
    tagline: "Simple ERP for Indian trade",
    search: "Search bills, parties, items",
    quickBill: "New bill",
    collect: "Collect payment",
    addStock: "Add stock",
    install: "Install app",
    online: "Online sync",
    offline: "Offline ready",
    owner: "Owner",
  },
  hi: {
    app: "व्यापार सेतु",
    tagline: "भारतीय व्यापार के लिए आसान ERP",
    search: "बिल, पार्टी, आइटम खोजें",
    quickBill: "नया बिल",
    collect: "पेमेंट लें",
    addStock: "स्टॉक जोड़ें",
    install: "ऐप इंस्टॉल",
    online: "ऑनलाइन सिंक",
    offline: "ऑफलाइन तैयार",
    owner: "मालिक",
  },
};

const modules: Array<{
  key: ModuleKey;
  label: string;
  hi: string;
  icon: typeof Home;
}> = [
  { key: "dashboard", label: "Dashboard", hi: "डैशबोर्ड", icon: Home },
  { key: "billing", label: "Sales billing", hi: "बिक्री बिल", icon: ReceiptText },
  { key: "inventory", label: "Inventory", hi: "स्टॉक", icon: Boxes },
  { key: "parties", label: "Parties", hi: "पार्टी खाते", icon: Users },
  { key: "purchases", label: "Purchases", hi: "खरीद", icon: PackagePlus },
  { key: "payments", label: "Payments", hi: "पेमेंट", icon: IndianRupee },
  { key: "mandi", label: "Mandi trade", hi: "मंडी व्यापार", icon: Truck },
  { key: "reports", label: "Reports", hi: "रिपोर्ट", icon: BarChart3 },
];

const metrics = [
  { label: "Today sales", hi: "आज की बिक्री", value: "Rs. 1,48,420", trend: "+18%", tone: "teal" },
  { label: "Cash in hand", hi: "हाथ में नकद", value: "Rs. 42,750", trend: "Synced", tone: "green" },
  { label: "Pending collection", hi: "उधार वसूली", value: "Rs. 2,16,300", trend: "29 parties", tone: "amber" },
  { label: "Low stock", hi: "कम स्टॉक", value: "17 items", trend: "Reorder", tone: "rose" },
];

const invoiceItems = [
  { item: "India Gate Basmati 25kg", qty: "4 bag", rate: 2480, gst: 5 },
  { item: "Fortune Oil 15L", qty: "6 tin", rate: 1625, gst: 5 },
  { item: "Tata Salt 1kg", qty: "40 pkt", rate: 24, gst: 0 },
];

const inventory = [
  { item: "Basmati rice 25kg", stock: "38 bag", low: "20", margin: "11.8%", hsn: "1006" },
  { item: "Mustard oil 15L", stock: "14 tin", low: "24", margin: "8.4%", hsn: "1514" },
  { item: "Sugar M30", stock: "7 qtl", low: "10", margin: "5.7%", hsn: "1701" },
  { item: "Onion Nasik", stock: "92 crate", low: "60", margin: "6.2%", hsn: "0703" },
];

const parties = [
  { name: "Sharma Kirana Store", type: "Customer", balance: "Rs. 86,420", limit: "Rs. 1,50,000", status: "Collect today" },
  { name: "Agrawal Traders", type: "Supplier", balance: "Rs. 1,12,300", limit: "Rs. 3,00,000", status: "Payment due" },
  { name: "Ramesh Farmer", type: "Farmer", balance: "Rs. 38,500", limit: "Mandi ledger", status: "Settled soon" },
];

const mandiRows = [
  { lot: "A-104", party: "Ramesh Farmer", crop: "Potato", weight: "42.5 qtl", rate: "Rs. 1,260/qtl", deduction: "2.5%", commission: "1.5%" },
  { lot: "A-105", party: "Iqbal Farms", crop: "Onion", weight: "63 crate", rate: "Rs. 740/crate", deduction: "1 crate", commission: "2%" },
  { lot: "A-106", party: "Patel Agro", crop: "Wheat", weight: "81 qtl", rate: "Rs. 2,310/qtl", deduction: "Hamali", commission: "1%" },
];

function money(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export function ErpApp() {
  const [language, setLanguage] = useState<Language>("en");
  const [active, setActive] = useState<ModuleKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
  });
  const [gstBill, setGstBill] = useState(true);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    }
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const t = copy[language];
  const subtotal = invoiceItems.reduce((sum, row) => sum + row.rate * Number.parseInt(row.qty, 10), 0);
  const gst = gstBill ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + gst - 860;

  const activeModule = modules.find((module) => module.key === active) ?? modules[0];
  const ActiveModuleIcon = activeModule.icon;

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-slate-950">
      <div className="flex min-h-screen">
        <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="brand-block">
            <div className="brand-mark">
              <Store size={25} />
            </div>
            <div>
              <p className="brand-title">{t.app}</p>
              <p className="brand-subtitle">{t.tagline}</p>
            </div>
          </div>

          <nav className="module-nav" aria-label="ERP modules">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  className={`module-button ${active === module.key ? "active" : ""}`}
                  key={module.key}
                  onClick={() => {
                    setActive(module.key);
                    setSidebarOpen(false);
                  }}
                  type="button"
                >
                  <Icon size={18} />
                  <span>{language === "hi" ? module.hi : module.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sync-card">
            <Cloud size={18} />
            <div>
              <strong>{isOnline ? t.online : t.offline}</strong>
              <span>IndexedDB queue: 3 pending bills</span>
            </div>
          </div>
        </aside>

        <section className="app-shell">
          <header className="topbar">
            <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} type="button" aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <div className="search-box">
              <Search size={18} />
              <input aria-label={t.search} placeholder={t.search} />
            </div>
            <div className="topbar-actions">
              <button className="ghost-button" type="button" onClick={() => setLanguage(language === "en" ? "hi" : "en")}>
                <Languages size={17} />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </button>
              <button className="ghost-button" type="button">
                <Download size={17} />
                <span>{t.install}</span>
              </button>
              <button className="icon-button" type="button" aria-label="Notifications">
                <Bell size={19} />
              </button>
            </div>
          </header>

          <div className="mobile-context">
            <ActiveModuleIcon size={17} />
            <span>{language === "hi" ? activeModule.hi : activeModule.label}</span>
          </div>

          <section className="hero-workspace">
            <div className="hero-copy">
              <div className="business-pill">
                <ShieldCheck size={16} />
                <span>GST-ready SaaS workspace for Indian trade</span>
              </div>
              <h1>Run billing, stock, payments, and mandi ledgers from one clear screen.</h1>
              <p>
                Built for kirana counters, mandi commission agents, wholesalers, distributors, and traders who need fast daily work without complicated training.
              </p>
            </div>
            <div className="quick-actions" aria-label="Quick actions">
              <button type="button" onClick={() => setActive("billing")}>
                <ReceiptText size={20} />
                <span>{t.quickBill}</span>
              </button>
              <button type="button" onClick={() => setActive("payments")}>
                <IndianRupee size={20} />
                <span>{t.collect}</span>
              </button>
              <button type="button" onClick={() => setActive("inventory")}>
                <PackagePlus size={20} />
                <span>{t.addStock}</span>
              </button>
            </div>
          </section>

          {active === "dashboard" && <Dashboard language={language} />}
          {active === "billing" && (
            <Billing gstBill={gstBill} setGstBill={setGstBill} subtotal={subtotal} gst={gst} total={total} />
          )}
          {active === "inventory" && <Inventory />}
          {active === "parties" && <Parties />}
          {active === "purchases" && <Purchases />}
          {active === "payments" && <Payments />}
          {active === "mandi" && <Mandi />}
          {active === "reports" && <Reports />}
        </section>
      </div>
    </main>
  );
}

function Dashboard({ language }: { language: Language }) {
  return (
    <div className="workspace-grid">
      <section className="metric-grid">
        {metrics.map((metric) => (
          <article className={`metric-card ${metric.tone}`} key={metric.label}>
            <span>{language === "hi" ? metric.hi : metric.label}</span>
            <strong>{metric.value}</strong>
            <em>{metric.trend}</em>
          </article>
        ))}
      </section>
      <section className="panel wide">
        <PanelHeader icon={Calculator} title="Owner view" action="Close day" />
        <div className="owner-grid">
          <StatusLine label="Cash sales" value="Rs. 72,180" />
          <StatusLine label="UPI received" value="Rs. 48,550" />
          <StatusLine label="Credit bills" value="Rs. 27,690" />
          <StatusLine label="Profit estimate" value="Rs. 18,240" />
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={Smartphone} title="No-training onboarding" action="3 min setup" />
        <ol className="setup-list">
          <li><CheckCircle2 size={18} /> Business profile and GSTIN</li>
          <li><CheckCircle2 size={18} /> Opening stock and balances</li>
          <li><CheckCircle2 size={18} /> Staff roles and invoice prefix</li>
        </ol>
      </section>
      <section className="panel">
        <PanelHeader icon={Wifi} title="Offline sync queue" action="Healthy" />
        <p className="muted">
          Bills, payments, and stock edits can be saved locally first and synced when the counter is back online.
        </p>
      </section>
    </div>
  );
}

function Billing({
  gstBill,
  setGstBill,
  subtotal,
  gst,
  total,
}: {
  gstBill: boolean;
  setGstBill: (value: boolean) => void;
  subtotal: number;
  gst: number;
  total: number;
}) {
  return (
    <section className="billing-layout">
      <div className="panel bill-panel">
        <PanelHeader icon={ShoppingCart} title="Quick sales bill" action="Print / share PDF" />
        <div className="form-grid">
          <label>Customer<input defaultValue="Sharma Kirana Store" /></label>
          <label>Invoice no.<input defaultValue="VS-24-00184" /></label>
          <label>Payment<input defaultValue="Credit + UPI" /></label>
          <label className="toggle-row">GST bill<input checked={gstBill} onChange={(event) => setGstBill(event.target.checked)} type="checkbox" /></label>
        </div>
        <div className="line-table">
          {invoiceItems.map((row) => (
            <div className="line-row" key={row.item}>
              <span>{row.item}</span>
              <span>{row.qty}</span>
              <span>{money(row.rate)}</span>
              <span>{row.gst}%</span>
            </div>
          ))}
        </div>
      </div>
      <aside className="panel bill-summary">
        <PanelHeader icon={FileText} title="Invoice total" action="A4 + thermal" />
        <StatusLine label="Subtotal" value={money(subtotal)} />
        <StatusLine label="GST" value={money(gst)} />
        <StatusLine label="Discount" value="Rs. 860" />
        <div className="grand-total">
          <span>Amount due</span>
          <strong>{money(total)}</strong>
        </div>
        <button className="primary-button" type="button">Save bill</button>
      </aside>
    </section>
  );
}

function Inventory() {
  return (
    <section className="panel">
      <PanelHeader icon={Boxes} title="Inventory and stock ledger" action="Low stock alerts" />
      <DataTable
        columns={["Item", "Stock", "Reorder", "Margin", "HSN"]}
        rows={inventory.map((row) => [row.item, row.stock, row.low, row.margin, row.hsn])}
      />
    </section>
  );
}

function Parties() {
  return (
    <section className="panel">
      <PanelHeader icon={Users} title="Customer, supplier and farmer ledgers" action="Credit control" />
      <div className="party-list">
        {parties.map((party) => (
          <article className="party-card" key={party.name}>
            <div>
              <strong>{party.name}</strong>
              <span>{party.type} | Limit {party.limit}</span>
            </div>
            <div>
              <strong>{party.balance}</strong>
              <span>{party.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Purchases() {
  return (
    <section className="workspace-grid">
      <div className="panel wide">
        <PanelHeader icon={PackagePlus} title="Supplier purchase entry" action="Updates stock" />
        <div className="form-grid">
          <label>Supplier<input defaultValue="Agrawal Traders" /></label>
          <label>Bill no.<input defaultValue="AGT/4489" /></label>
          <label>Freight<input defaultValue="Rs. 2,400" /></label>
          <label>Extra charges<input defaultValue="Hamali Rs. 680" /></label>
        </div>
      </div>
      <div className="panel">
        <PanelHeader icon={ChevronRight} title="Ledger effect" action="Traceable" />
        <p className="muted">Every purchase creates supplier balance, stock movement, tax entry, and immutable audit records.</p>
      </div>
    </section>
  );
}

function Payments() {
  return (
    <section className="workspace-grid">
      <div className="panel">
        <PanelHeader icon={IndianRupee} title="Collect payment" action="Partial allowed" />
        <div className="payment-stack">
          {["Cash Rs. 18,000", "UPI Rs. 24,550", "Bank Rs. 70,000"].map((item) => (
            <button type="button" key={item}>{item}</button>
          ))}
        </div>
      </div>
      <div className="panel wide">
        <PanelHeader icon={BarChart3} title="Receivables watchlist" action="Auto reminders later" />
        <DataTable
          columns={["Party", "Due", "Age", "Last payment"]}
          rows={[
            ["Sharma Kirana Store", "Rs. 86,420", "12 days", "UPI Rs. 8,000"],
            ["Bharat Mini Mart", "Rs. 54,210", "7 days", "Cash Rs. 5,500"],
            ["Ramesh Farmer", "Rs. 38,500", "2 days", "Mandi settlement"],
          ]}
        />
      </div>
    </section>
  );
}

function Mandi() {
  return (
    <section className="panel">
      <PanelHeader icon={Truck} title="Mandi lot settlement" action="Commission + deductions" />
      <DataTable
        columns={["Lot", "Farmer/Supplier", "Crop", "Weight", "Rate", "Deduction", "Commission"]}
        rows={mandiRows.map((row) => [row.lot, row.party, row.crop, row.weight, row.rate, row.deduction, row.commission])}
      />
    </section>
  );
}

function Reports() {
  const reports = useMemo(
    () => [
      ["GST sales summary", "GSTR export-ready", "Monthly"],
      ["Stock valuation", "Item, batch, unit", "Live"],
      ["Party ledger", "Customer/supplier/farmer", "PDF"],
      ["Profit estimate", "Sales minus purchase cost", "Owner"],
    ],
    [],
  );
  return (
    <section className="workspace-grid">
      <div className="panel wide">
        <PanelHeader icon={BarChart3} title="Reports and exports" action="Accountant friendly" />
        <DataTable columns={["Report", "Covers", "Format"]} rows={reports} />
      </div>
      <div className="panel">
        <PanelHeader icon={Globe2} title="SaaS controls" action="Multi-business" />
        <p className="muted">
          Tenant-safe accounts, staff roles, audit logs, and future mobile apps use the same business APIs.
        </p>
      </div>
    </section>
  );
}

function PanelHeader({ icon: Icon, title, action }: { icon: typeof Home; title: string; action: string }) {
  return (
    <div className="panel-header">
      <div>
        <Icon size={19} />
        <h2>{title}</h2>
      </div>
      <span>{action}</span>
    </div>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  const tableStyle = { "--cols": columns.length } as CSSProperties;

  return (
    <div className="data-table" role="table" style={tableStyle}>
      <div className="table-row table-head" role="row">
        {columns.map((column) => (
          <span role="columnheader" key={column}>{column}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div className="table-row" role="row" key={row.join("-")}>
          {row.map((cell) => (
            <span role="cell" key={cell}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
