"use client";

import type { CSSProperties, FormEvent } from "react";
import {
  BarChart3,
  Bell,
  Boxes,
  Calculator,
  CheckCircle2,
  Cloud,
  Download,
  FileText,
  Home,
  IndianRupee,
  Languages,
  Menu,
  PackagePlus,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
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
type PartyType = "Customer" | "Supplier" | "Farmer" | "Buyer";
type PaymentMode = "Cash" | "UPI" | "Bank";

type Item = {
  id: string;
  name: string;
  unit: string;
  hsn: string;
  stock: number;
  lowStock: number;
  saleRate: number;
  purchaseRate: number;
  gstRate: number;
};

type Party = {
  id: string;
  name: string;
  type: PartyType;
  phone: string;
  creditLimit: number;
  balance: number;
};

type LedgerEntry = {
  id: string;
  at: string;
  type: string;
  partyId?: string;
  itemId?: string;
  description: string;
  debit: number;
  credit: number;
};

type Invoice = {
  id: string;
  no: string;
  at: string;
  partyId: string;
  itemId: string;
  qty: number;
  rate: number;
  discount: number;
  gstRate: number;
  paymentMode: PaymentMode | "Credit";
  subtotal: number;
  gst: number;
  total: number;
};

type Purchase = {
  id: string;
  no: string;
  at: string;
  partyId: string;
  itemId: string;
  qty: number;
  rate: number;
  freight: number;
  total: number;
};

type Payment = {
  id: string;
  at: string;
  partyId: string;
  amount: number;
  mode: PaymentMode;
  note: string;
};

type MandiLot = {
  id: string;
  lotNo: string;
  at: string;
  farmerId: string;
  buyerId: string;
  crop: string;
  weight: number;
  unit: string;
  rate: number;
  deduction: number;
  commissionRate: number;
  payable: number;
};

type BusinessProfile = {
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  gstin: string;
  state: string;
  city: string;
  invoicePrefix: string;
  openingCash: number;
  financialYear: string;
};

type BusinessState = {
  business: BusinessProfile;
  onboardingComplete: boolean;
  invoiceSeq: number;
  purchaseSeq: number;
  lotSeq: number;
  items: Item[];
  parties: Party[];
  invoices: Invoice[];
  purchases: Purchase[];
  payments: Payment[];
  mandiLots: MandiLot[];
  ledger: LedgerEntry[];
  syncQueue: number;
};

type SaleForm = {
  partyId: string;
  itemId: string;
  qty: string;
  rate: string;
  discount: string;
  paymentMode: PaymentMode | "Credit";
  gstBill: boolean;
};

type PurchaseForm = {
  partyId: string;
  itemId: string;
  qty: string;
  rate: string;
  freight: string;
};

type PaymentForm = {
  partyId: string;
  amount: string;
  mode: PaymentMode;
  note: string;
};

type ItemForm = {
  name: string;
  unit: string;
  hsn: string;
  stock: string;
  lowStock: string;
  saleRate: string;
  purchaseRate: string;
  gstRate: string;
};

type PartyForm = {
  name: string;
  type: PartyType;
  phone: string;
  creditLimit: string;
  balance: string;
};

type MandiForm = {
  farmerId: string;
  buyerId: string;
  crop: string;
  weight: string;
  unit: string;
  rate: string;
  deduction: string;
  commissionRate: string;
};

type OnboardingForm = {
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  gstin: string;
  state: string;
  city: string;
  invoicePrefix: string;
  openingCash: string;
  financialYear: string;
};

const copy = {
  en: {
    app: "BizMitra",
    tagline: "Desktop ERP for Indian trade",
    search: "Search bills, parties, items",
    quickBill: "New bill",
    collect: "Collect payment",
    addStock: "Add stock",
    export: "Export CSV",
    online: "Online sync",
    offline: "Offline ready",
  },
  hi: {
    app: "बिजमित्र",
    tagline: "भारतीय व्यापार के लिए डेस्कटॉप ERP",
    search: "बिल, पार्टी, आइटम खोजें",
    quickBill: "नया बिल",
    collect: "पेमेंट लें",
    addStock: "स्टॉक जोड़ें",
    export: "CSV एक्सपोर्ट",
    online: "ऑनलाइन सिंक",
    offline: "ऑफलाइन तैयार",
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

const initialState: BusinessState = {
  onboardingComplete: false,
  business: {
    name: "Demo Trading Co.",
    businessType: "Kirana + Wholesale",
    ownerName: "Owner",
    phone: "",
    gstin: "",
    state: "Jammu and Kashmir",
    city: "Srinagar",
    invoicePrefix: "BM",
    openingCash: 25000,
    financialYear: "2026-27",
  },
  invoiceSeq: 185,
  purchaseSeq: 42,
  lotSeq: 107,
  syncQueue: 0,
  items: [
    { id: "item-rice", name: "India Gate Basmati 25kg", unit: "bag", hsn: "1006", stock: 38, lowStock: 20, saleRate: 2480, purchaseRate: 2210, gstRate: 5 },
    { id: "item-oil", name: "Fortune Oil 15L", unit: "tin", hsn: "1514", stock: 14, lowStock: 24, saleRate: 1625, purchaseRate: 1490, gstRate: 5 },
    { id: "item-salt", name: "Tata Salt 1kg", unit: "pkt", hsn: "2501", stock: 180, lowStock: 80, saleRate: 24, purchaseRate: 21, gstRate: 0 },
    { id: "item-onion", name: "Onion Nasik", unit: "crate", hsn: "0703", stock: 92, lowStock: 60, saleRate: 740, purchaseRate: 690, gstRate: 0 },
    { id: "item-potato", name: "Potato Agra", unit: "qtl", hsn: "0701", stock: 42.5, lowStock: 20, saleRate: 1260, purchaseRate: 1190, gstRate: 0 },
  ],
  parties: [
    { id: "party-sharma", name: "Sharma Kirana Store", type: "Customer", phone: "9876501111", creditLimit: 150000, balance: 86420 },
    { id: "party-agrawal", name: "Agrawal Traders", type: "Supplier", phone: "9876502222", creditLimit: 300000, balance: -112300 },
    { id: "party-ramesh", name: "Ramesh Farmer", type: "Farmer", phone: "9876503333", creditLimit: 0, balance: -38500 },
    { id: "party-bharat", name: "Bharat Mini Mart", type: "Customer", phone: "9876504444", creditLimit: 100000, balance: 54210 },
    { id: "party-city", name: "City Wholesale Buyer", type: "Buyer", phone: "9876505555", creditLimit: 200000, balance: 0 },
  ],
  invoices: [],
  purchases: [],
  payments: [],
  mandiLots: [],
  ledger: [
    { id: "led-open-1", at: today(), type: "Opening", partyId: "party-sharma", description: "Opening customer balance", debit: 86420, credit: 0 },
    { id: "led-open-2", at: today(), type: "Opening", partyId: "party-agrawal", description: "Opening supplier payable", debit: 0, credit: 112300 },
    { id: "led-open-3", at: today(), type: "Opening", partyId: "party-ramesh", description: "Opening farmer payable", debit: 0, credit: 38500 },
  ],
};

const storageKey = "bizmitra-demo-state-v2";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function numberValue(value: string | number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number) {
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function getParty(state: BusinessState, partyId: string) {
  return state.parties.find((party) => party.id === partyId) ?? state.parties[0];
}

function getItem(state: BusinessState, itemId: string) {
  return state.items.find((item) => item.id === itemId) ?? state.items[0];
}

function normalizeState(candidate: Partial<BusinessState>): BusinessState {
  return {
    ...initialState,
    ...candidate,
    business: {
      ...initialState.business,
      ...(candidate.business ?? {}),
    },
    onboardingComplete: Boolean(candidate.onboardingComplete),
    items: candidate.items ?? initialState.items,
    parties: candidate.parties ?? initialState.parties,
    invoices: candidate.invoices ?? initialState.invoices,
    purchases: candidate.purchases ?? initialState.purchases,
    payments: candidate.payments ?? initialState.payments,
    mandiLots: candidate.mandiLots ?? initialState.mandiLots,
    ledger: candidate.ledger ?? initialState.ledger,
  };
}

function computeSale(state: BusinessState, form: SaleForm) {
  const item = getItem(state, form.itemId);
  const qty = numberValue(form.qty);
  const rate = numberValue(form.rate);
  const discount = numberValue(form.discount);
  const subtotal = qty * rate;
  const gstRate = form.gstBill ? item.gstRate : 0;
  const gst = Math.round(((subtotal - discount) * gstRate) / 100);
  const total = Math.max(0, subtotal - discount + gst);
  return { item, qty, rate, discount, gstRate, subtotal, gst, total };
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function loadState(): BusinessState {
  if (typeof window === "undefined") return initialState;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? normalizeState(JSON.parse(stored) as Partial<BusinessState>) : initialState;
  } catch {
    return initialState;
  }
}

export function ErpApp() {
  const [language, setLanguage] = useState<Language>("en");
  const [active, setActive] = useState<ModuleKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Ready for testing. Try saving a bill, purchase, payment, or mandi lot.");
  const [state, setState] = useState<BusinessState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const loaded = loadState();
      setState(loaded);
      setShowOnboarding(!loaded.onboardingComplete);
      setHydrated(true);
    }, 0);
    const syncOnlineStatus = () => setIsOnline(navigator.onLine);
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    const statusTimer = window.setTimeout(syncOnlineStatus, 0);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    }
    return () => {
      window.clearTimeout(loadTimer);
      window.clearTimeout(statusTimer);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const t = copy[language];
  const activeModule = modules.find((module) => module.key === active) ?? modules[0];
  const ActiveModuleIcon = activeModule.icon;

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return [
      ...state.parties.map((party) => ({ label: party.name, detail: `${party.type} | ${money(party.balance)}`, module: "parties" as ModuleKey })),
      ...state.items.map((item) => ({ label: item.name, detail: `${item.stock} ${item.unit} | HSN ${item.hsn}`, module: "inventory" as ModuleKey })),
      ...state.invoices.map((invoice) => ({ label: invoice.no, detail: `${getParty(state, invoice.partyId).name} | ${money(invoice.total)}`, module: "billing" as ModuleKey })),
    ].filter((result) => `${result.label} ${result.detail}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query, state]);

  function mutate(updater: (current: BusinessState) => BusinessState, message: string) {
    setState((current) => ({ ...updater(current), syncQueue: current.syncQueue + 1 }));
    setNotice(message);
  }

  function resetDemo() {
    setState((current) => ({
      ...initialState,
      business: current.business,
      onboardingComplete: current.onboardingComplete,
    }));
    setNotice("Demo data reset. You can test workflows from a clean sample state.");
  }

  function saveOnboarding(form: OnboardingForm) {
    setState((current) => ({
      ...current,
      onboardingComplete: true,
      business: {
        name: form.name.trim() || "My Business",
        businessType: form.businessType,
        ownerName: form.ownerName.trim() || "Owner",
        phone: form.phone.trim(),
        gstin: form.gstin.trim().toUpperCase(),
        state: form.state.trim(),
        city: form.city.trim(),
        invoicePrefix: (form.invoicePrefix.trim() || "BM").toUpperCase(),
        openingCash: numberValue(form.openingCash),
        financialYear: form.financialYear.trim() || "2026-27",
      },
    }));
    setShowOnboarding(false);
    setNotice("Business profile saved. Your billing prefix, GST details, and owner view are ready.");
  }

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
              <span>Local queue: {state.syncQueue} saved actions</span>
            </div>
          </div>
        </aside>

        <section className="app-shell">
          <header className="topbar">
            <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} type="button" aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <div className="search-wrap">
              <div className="search-box">
                <Search size={18} />
                <input aria-label={t.search} placeholder={t.search} value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result) => (
                    <button key={`${result.module}-${result.label}`} type="button" onClick={() => { setActive(result.module); setQuery(""); }}>
                      <strong>{result.label}</strong>
                      <span>{result.detail}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="topbar-actions">
              <button className="ghost-button" type="button" onClick={() => setLanguage(language === "en" ? "hi" : "en")}>
                <Languages size={17} />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </button>
              <button className="ghost-button" type="button" onClick={resetDemo}>
                <RotateCcw size={17} />
                <span>Reset</span>
              </button>
              <button className="ghost-button" type="button" onClick={() => setShowOnboarding(true)}>
                <Store size={17} />
                <span>Business</span>
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
                <span>{state.business.businessType} | {state.business.city || "Your city"}</span>
              </div>
              <h1>{state.business.name}</h1>
              <p>
                Owner: {state.business.ownerName} | GSTIN: {state.business.gstin || "Not added"} | Invoice prefix: {state.business.invoicePrefix}
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

          {showOnboarding && <Onboarding state={state} onSave={saveOnboarding} onClose={() => setShowOnboarding(false)} />}

          <p className="notice">{notice}</p>

          {active === "dashboard" && <Dashboard state={state} language={language} />}
          {active === "billing" && <Billing state={state} mutate={mutate} />}
          {active === "inventory" && <Inventory state={state} mutate={mutate} />}
          {active === "parties" && <Parties state={state} mutate={mutate} />}
          {active === "purchases" && <Purchases state={state} mutate={mutate} />}
          {active === "payments" && <Payments state={state} mutate={mutate} />}
          {active === "mandi" && <Mandi state={state} mutate={mutate} />}
          {active === "reports" && <Reports state={state} />}
        </section>
      </div>
    </main>
  );
}

function Onboarding({
  state,
  onSave,
  onClose,
}: {
  state: BusinessState;
  onSave: (form: OnboardingForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<OnboardingForm>({
    name: state.business.name,
    businessType: state.business.businessType,
    ownerName: state.business.ownerName,
    phone: state.business.phone,
    gstin: state.business.gstin,
    state: state.business.state,
    city: state.business.city,
    invoicePrefix: state.business.invoicePrefix,
    openingCash: String(state.business.openingCash),
    financialYear: state.business.financialYear,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <section className="onboarding-shell" aria-label="Business onboarding">
      <div className="onboarding-intro">
        <div className="business-pill">
          <ShieldCheck size={16} />
          <span>Intro and onboarding</span>
        </div>
        <h2>Test billing, stock, payments, purchases, and mandi settlement end to end.</h2>
        <p>
          First add your business details. BizMitra uses this for invoice prefix, GST fields, owner reports, and future desktop/mobile sync setup.
        </p>
        <ol className="setup-list">
          <li><CheckCircle2 size={18} /> Business identity and owner contact</li>
          <li><CheckCircle2 size={18} /> GST/state details for invoice setup</li>
          <li><CheckCircle2 size={18} /> Opening cash and financial year</li>
        </ol>
      </div>
      <form className="onboarding-form" onSubmit={submit}>
        <div className="form-grid">
          <label>Business name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoFocus /></label>
          <label>Business type<Select value={form.businessType} onChange={(value) => setForm({ ...form, businessType: value })} options={["Kirana", "Mandi trader", "Wholesaler", "Distributor", "Kirana + Wholesale", "Commission agent"].map((type) => [type, type])} /></label>
          <label>Owner name<input value={form.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} /></label>
          <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
          <label>GSTIN optional<input value={form.gstin} onChange={(event) => setForm({ ...form, gstin: event.target.value })} maxLength={15} /></label>
          <label>State<input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></label>
          <label>City<input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
          <label>Invoice prefix<input value={form.invoicePrefix} onChange={(event) => setForm({ ...form, invoicePrefix: event.target.value })} maxLength={6} /></label>
          <label>Opening cash<input value={form.openingCash} onChange={(event) => setForm({ ...form, openingCash: event.target.value })} type="number" min="0" /></label>
          <label>Financial year<input value={form.financialYear} onChange={(event) => setForm({ ...form, financialYear: event.target.value })} /></label>
        </div>
        <div className="action-row">
          <button className="primary-button" type="submit">Save and enter app</button>
          {state.onboardingComplete && <button className="ghost-button" type="button" onClick={onClose}>Close</button>}
        </div>
      </form>
    </section>
  );
}

function Dashboard({ state, language }: { state: BusinessState; language: Language }) {
  const todaySales = state.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const cash = state.business.openingCash + state.payments.filter((payment) => payment.mode === "Cash").reduce((sum, payment) => sum + payment.amount, 0);
  const receivable = state.parties.filter((party) => party.balance > 0).reduce((sum, party) => sum + party.balance, 0);
  const lowStock = state.items.filter((item) => item.stock <= item.lowStock).length;
  const metrics = [
    { label: "Today sales", hi: "आज की बिक्री", value: money(todaySales), trend: `${state.invoices.length} bills`, tone: "teal" },
    { label: "Cash collected", hi: "नकद वसूली", value: money(cash), trend: "Local day book", tone: "green" },
    { label: "Pending collection", hi: "उधार वसूली", value: money(receivable), trend: `${state.parties.filter((party) => party.balance > 0).length} parties`, tone: "amber" },
    { label: "Low stock", hi: "कम स्टॉक", value: `${lowStock} items`, trend: "Reorder list", tone: "rose" },
  ];
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
        <PanelHeader icon={Calculator} title="Owner day view" action="Live from saved workflows" />
        <div className="owner-grid">
          <StatusLine label="Sales bills" value={`${state.invoices.length}`} />
          <StatusLine label="Purchase bills" value={`${state.purchases.length}`} />
          <StatusLine label="Mandi lots" value={`${state.mandiLots.length}`} />
          <StatusLine label="Financial year" value={state.business.financialYear} />
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={CheckCircle2} title="Testing checklist" action="Try these" />
        <ol className="setup-list">
          <li><CheckCircle2 size={18} /> Save credit bill and check party due</li>
          <li><CheckCircle2 size={18} /> Enter purchase and verify stock increase</li>
          <li><CheckCircle2 size={18} /> Collect payment and see balance reduce</li>
        </ol>
      </section>
      <section className="panel">
        <PanelHeader icon={Wifi} title="Local-first queue" action="Desktop ready" />
        <p className="muted">
          Data is saved in this device browser/app storage for testing. Production can replace this with SQLite/PostgreSQL sync.
        </p>
      </section>
    </div>
  );
}

function Billing({ state, mutate }: { state: BusinessState; mutate: (updater: (current: BusinessState) => BusinessState, message: string) => void }) {
  const firstCustomer = state.parties.find((party) => party.type === "Customer") ?? state.parties[0];
  const [form, setForm] = useState<SaleForm>({
    partyId: firstCustomer.id,
    itemId: state.items[0].id,
    qty: "1",
    rate: String(state.items[0].saleRate),
    discount: "0",
    paymentMode: "Credit",
    gstBill: true,
  });
  const estimate = computeSale(state, form);

  function saveBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (estimate.qty <= 0) return;
    if (estimate.qty > estimate.item.stock) {
      mutate((current) => current, `Not enough stock for ${estimate.item.name}. Available: ${estimate.item.stock} ${estimate.item.unit}.`);
      return;
    }
    mutate((current) => {
      const invoiceNo = `${current.business.invoicePrefix}-${String(current.invoiceSeq).padStart(5, "0")}`;
      const invoice: Invoice = {
        id: id("inv"),
        no: invoiceNo,
        at: today(),
        partyId: form.partyId,
        itemId: form.itemId,
        qty: estimate.qty,
        rate: estimate.rate,
        discount: estimate.discount,
        gstRate: estimate.gstRate,
        paymentMode: form.paymentMode,
        subtotal: estimate.subtotal,
        gst: estimate.gst,
        total: estimate.total,
      };
      return {
        ...current,
        invoiceSeq: current.invoiceSeq + 1,
        items: current.items.map((item) => item.id === form.itemId ? { ...item, stock: item.stock - estimate.qty } : item),
        parties: current.parties.map((party) => party.id === form.partyId && form.paymentMode === "Credit" ? { ...party, balance: party.balance + estimate.total } : party),
        invoices: [invoice, ...current.invoices],
        ledger: [
          { id: id("led"), at: today(), type: "Sale", partyId: form.partyId, itemId: form.itemId, description: `${invoiceNo} sale of ${estimate.item.name}`, debit: form.paymentMode === "Credit" ? estimate.total : 0, credit: form.paymentMode === "Credit" ? 0 : estimate.total },
          { id: id("stk"), at: today(), type: "Stock out", itemId: form.itemId, description: `${invoiceNo} stock reduced by ${estimate.qty} ${estimate.item.unit}`, debit: 0, credit: estimate.qty },
          ...current.ledger,
        ],
      };
    }, `Saved bill for ${getParty(state, form.partyId).name}. Stock and ledger updated.`);
  }

  return (
    <section className="billing-layout">
      <form className="panel bill-panel" onSubmit={saveBill}>
        <PanelHeader icon={ShoppingCart} title="Quick sales bill" action="Updates stock + ledger" />
        <div className="form-grid">
          <label>Customer<Select value={form.partyId} onChange={(value) => setForm({ ...form, partyId: value })} options={state.parties.filter((party) => party.type === "Customer" || party.type === "Buyer").map((party) => [party.id, party.name])} /></label>
          <label>Item<Select value={form.itemId} onChange={(value) => {
            const item = getItem(state, value);
            setForm({ ...form, itemId: value, rate: String(item.saleRate), gstBill: item.gstRate > 0 });
          }} options={state.items.map((item) => [item.id, `${item.name} (${item.stock} ${item.unit})`])} /></label>
          <label>Quantity<input value={form.qty} onChange={(event) => setForm({ ...form, qty: event.target.value })} type="number" min="0" step="0.01" /></label>
          <label>Rate<input value={form.rate} onChange={(event) => setForm({ ...form, rate: event.target.value })} type="number" min="0" /></label>
          <label>Discount<input value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} type="number" min="0" /></label>
          <label>Payment<Select value={form.paymentMode} onChange={(value) => setForm({ ...form, paymentMode: value as SaleForm["paymentMode"] })} options={["Credit", "Cash", "UPI", "Bank"].map((mode) => [mode, mode])} /></label>
          <label className="toggle-row">GST bill<input checked={form.gstBill} onChange={(event) => setForm({ ...form, gstBill: event.target.checked })} type="checkbox" /></label>
        </div>
        <div className="action-row">
          <button className="primary-button" type="submit"><Plus size={17} />Save bill</button>
          <button className="ghost-button" type="button" onClick={() => window.print()}><Printer size={17} />Print</button>
        </div>
      </form>
      <aside className="panel bill-summary">
        <PanelHeader icon={FileText} title="Invoice total" action={`Next ${`${state.business.invoicePrefix}-${String(state.invoiceSeq).padStart(5, "0")}`}`} />
        <StatusLine label="Subtotal" value={money(estimate.subtotal)} />
        <StatusLine label="GST" value={money(estimate.gst)} />
        <StatusLine label="Discount" value={money(estimate.discount)} />
        <div className="grand-total">
          <span>Amount due</span>
          <strong>{money(estimate.total)}</strong>
        </div>
        <DataTable
          columns={["Recent bill", "Party", "Total"]}
          rows={state.invoices.slice(0, 4).map((invoice) => [invoice.no, getParty(state, invoice.partyId).name, money(invoice.total)])}
          empty="No bills saved yet"
        />
      </aside>
    </section>
  );
}

function Inventory({ state, mutate }: { state: BusinessState; mutate: (updater: (current: BusinessState) => BusinessState, message: string) => void }) {
  const [form, setForm] = useState<ItemForm>({ name: "", unit: "pcs", hsn: "", stock: "0", lowStock: "5", saleRate: "0", purchaseRate: "0", gstRate: "0" });
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) return;
    mutate((current) => ({
      ...current,
      items: [{
        id: id("item"),
        name: form.name.trim(),
        unit: form.unit.trim() || "pcs",
        hsn: form.hsn.trim(),
        stock: numberValue(form.stock),
        lowStock: numberValue(form.lowStock),
        saleRate: numberValue(form.saleRate),
        purchaseRate: numberValue(form.purchaseRate),
        gstRate: numberValue(form.gstRate),
      }, ...current.items],
      ledger: [{ id: id("led"), at: today(), type: "Item", description: `Added item ${form.name.trim()}`, debit: 0, credit: 0 }, ...current.ledger],
    }), `Added item ${form.name}.`);
    setForm({ name: "", unit: "pcs", hsn: "", stock: "0", lowStock: "5", saleRate: "0", purchaseRate: "0", gstRate: "0" });
  }
  return (
    <section className="workspace-grid">
      <div className="panel wide">
        <PanelHeader icon={Boxes} title="Inventory and stock ledger" action="Live reorder alerts" />
        <DataTable
          columns={["Item", "Stock", "Reorder", "Sale rate", "HSN"]}
          rows={state.items.map((row) => [row.name, `${row.stock} ${row.unit}`, row.stock <= row.lowStock ? `Low: ${row.lowStock}` : `${row.lowStock}`, money(row.saleRate), row.hsn])}
        />
      </div>
      <form className="panel" onSubmit={addItem}>
        <PanelHeader icon={PackagePlus} title="Add item" action="Creates stock master" />
        <div className="mini-form">
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Unit<input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></label>
          <label>HSN<input value={form.hsn} onChange={(event) => setForm({ ...form, hsn: event.target.value })} /></label>
          <label>Opening stock<input value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} type="number" /></label>
          <label>Low stock<input value={form.lowStock} onChange={(event) => setForm({ ...form, lowStock: event.target.value })} type="number" /></label>
          <label>Sale rate<input value={form.saleRate} onChange={(event) => setForm({ ...form, saleRate: event.target.value })} type="number" /></label>
          <button className="primary-button" type="submit">Add item</button>
        </div>
      </form>
    </section>
  );
}

function Parties({ state, mutate }: { state: BusinessState; mutate: (updater: (current: BusinessState) => BusinessState, message: string) => void }) {
  const [form, setForm] = useState<PartyForm>({ name: "", type: "Customer", phone: "", creditLimit: "0", balance: "0" });
  function addParty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) return;
    mutate((current) => ({
      ...current,
      parties: [{ id: id("party"), name: form.name.trim(), type: form.type, phone: form.phone.trim(), creditLimit: numberValue(form.creditLimit), balance: numberValue(form.balance) }, ...current.parties],
      ledger: [{ id: id("led"), at: today(), type: "Party", description: `Added ${form.type} ${form.name.trim()}`, debit: Math.max(0, numberValue(form.balance)), credit: Math.max(0, -numberValue(form.balance)) }, ...current.ledger],
    }), `Added ${form.type.toLowerCase()} ${form.name}.`);
    setForm({ name: "", type: "Customer", phone: "", creditLimit: "0", balance: "0" });
  }
  return (
    <section className="workspace-grid">
      <div className="panel wide">
        <PanelHeader icon={Users} title="Customer, supplier and farmer ledgers" action="Credit control" />
        <div className="party-list">
          {state.parties.map((party) => (
            <article className="party-card" key={party.id}>
              <div>
                <strong>{party.name}</strong>
                <span>{party.type} | {party.phone || "No phone"} | Limit {money(party.creditLimit)}</span>
              </div>
              <div>
                <strong>{money(Math.abs(party.balance))}</strong>
                <span>{party.balance >= 0 ? "Receivable" : "Payable"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <form className="panel" onSubmit={addParty}>
        <PanelHeader icon={Plus} title="Add party" action="Opening balance" />
        <div className="mini-form">
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Type<Select value={form.type} onChange={(value) => setForm({ ...form, type: value as PartyType })} options={["Customer", "Supplier", "Farmer", "Buyer"].map((type) => [type, type])} /></label>
          <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
          <label>Credit limit<input value={form.creditLimit} onChange={(event) => setForm({ ...form, creditLimit: event.target.value })} type="number" /></label>
          <label>Opening balance<input value={form.balance} onChange={(event) => setForm({ ...form, balance: event.target.value })} type="number" /></label>
          <button className="primary-button" type="submit">Add party</button>
        </div>
      </form>
    </section>
  );
}

function Purchases({ state, mutate }: { state: BusinessState; mutate: (updater: (current: BusinessState) => BusinessState, message: string) => void }) {
  const supplier = state.parties.find((party) => party.type === "Supplier") ?? state.parties[0];
  const [form, setForm] = useState<PurchaseForm>({ partyId: supplier.id, itemId: state.items[0].id, qty: "5", rate: String(state.items[0].purchaseRate), freight: "0" });
  const item = getItem(state, form.itemId);
  const total = numberValue(form.qty) * numberValue(form.rate) + numberValue(form.freight);
  function savePurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate((current) => {
      const purchaseNo = `PUR-${String(current.purchaseSeq).padStart(4, "0")}`;
      const purchase: Purchase = { id: id("pur"), no: purchaseNo, at: today(), partyId: form.partyId, itemId: form.itemId, qty: numberValue(form.qty), rate: numberValue(form.rate), freight: numberValue(form.freight), total };
      return {
        ...current,
        purchaseSeq: current.purchaseSeq + 1,
        purchases: [purchase, ...current.purchases],
        items: current.items.map((row) => row.id === form.itemId ? { ...row, stock: row.stock + purchase.qty, purchaseRate: purchase.rate } : row),
        parties: current.parties.map((party) => party.id === form.partyId ? { ...party, balance: party.balance - total } : party),
        ledger: [
          { id: id("led"), at: today(), type: "Purchase", partyId: form.partyId, itemId: form.itemId, description: `${purchaseNo} purchase of ${item.name}`, debit: 0, credit: total },
          { id: id("stk"), at: today(), type: "Stock in", itemId: form.itemId, description: `${purchaseNo} stock increased by ${purchase.qty} ${item.unit}`, debit: purchase.qty, credit: 0 },
          ...current.ledger,
        ],
      };
    }, `Purchase saved. ${item.name} stock increased and supplier payable updated.`);
  }
  return (
    <section className="workspace-grid">
      <form className="panel wide" onSubmit={savePurchase}>
        <PanelHeader icon={PackagePlus} title="Supplier purchase entry" action="Updates stock + payable" />
        <div className="form-grid">
          <label>Supplier<Select value={form.partyId} onChange={(value) => setForm({ ...form, partyId: value })} options={state.parties.filter((party) => party.type === "Supplier").map((party) => [party.id, party.name])} /></label>
          <label>Item<Select value={form.itemId} onChange={(value) => setForm({ ...form, itemId: value, rate: String(getItem(state, value).purchaseRate) })} options={state.items.map((row) => [row.id, row.name])} /></label>
          <label>Quantity<input value={form.qty} onChange={(event) => setForm({ ...form, qty: event.target.value })} type="number" step="0.01" /></label>
          <label>Rate<input value={form.rate} onChange={(event) => setForm({ ...form, rate: event.target.value })} type="number" /></label>
          <label>Freight / extra charges<input value={form.freight} onChange={(event) => setForm({ ...form, freight: event.target.value })} type="number" /></label>
        </div>
        <div className="action-row">
          <button className="primary-button" type="submit">Save purchase {money(total)}</button>
        </div>
      </form>
      <div className="panel">
        <PanelHeader icon={Boxes} title="Recent purchases" action={`${state.purchases.length} saved`} />
        <DataTable columns={["Bill", "Supplier", "Total"]} rows={state.purchases.slice(0, 5).map((row) => [row.no, getParty(state, row.partyId).name, money(row.total)])} empty="No purchases saved yet" />
      </div>
    </section>
  );
}

function Payments({ state, mutate }: { state: BusinessState; mutate: (updater: (current: BusinessState) => BusinessState, message: string) => void }) {
  const firstDue = state.parties.find((party) => party.balance !== 0) ?? state.parties[0];
  const [form, setForm] = useState<PaymentForm>({ partyId: firstDue.id, amount: String(Math.min(Math.abs(firstDue.balance), 10000)), mode: "UPI", note: "Part payment" });
  function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const party = getParty(state, form.partyId);
    const amount = numberValue(form.amount);
    const direction = party.balance >= 0 ? -amount : amount;
    mutate((current) => {
      const payment: Payment = { id: id("pay"), at: today(), partyId: form.partyId, amount, mode: form.mode, note: form.note };
      return {
        ...current,
        payments: [payment, ...current.payments],
        parties: current.parties.map((row) => row.id === form.partyId ? { ...row, balance: row.balance + direction } : row),
        ledger: [{ id: id("led"), at: today(), type: "Payment", partyId: form.partyId, description: `${form.mode} ${party.balance >= 0 ? "received from" : "paid to"} ${party.name}`, debit: party.balance < 0 ? amount : 0, credit: party.balance >= 0 ? amount : 0 }, ...current.ledger],
      };
    }, `Payment saved for ${party.name}. Balance updated.`);
  }
  return (
    <section className="workspace-grid">
      <form className="panel" onSubmit={savePayment}>
        <PanelHeader icon={IndianRupee} title="Payment / receipt" action="Partial allowed" />
        <div className="mini-form">
          <label>Party<Select value={form.partyId} onChange={(value) => setForm({ ...form, partyId: value })} options={state.parties.map((party) => [party.id, `${party.name} (${money(party.balance)})`])} /></label>
          <label>Amount<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} type="number" /></label>
          <label>Mode<Select value={form.mode} onChange={(value) => setForm({ ...form, mode: value as PaymentMode })} options={["Cash", "UPI", "Bank"].map((mode) => [mode, mode])} /></label>
          <label>Note<input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
          <button className="primary-button" type="submit">Save payment</button>
        </div>
      </form>
      <div className="panel wide">
        <PanelHeader icon={BarChart3} title="Receivables and payables" action="Live balances" />
        <DataTable columns={["Party", "Type", "Balance", "Status"]} rows={state.parties.filter((party) => party.balance !== 0).map((party) => [party.name, party.type, money(Math.abs(party.balance)), party.balance > 0 ? "Collect" : "Pay"])} />
      </div>
    </section>
  );
}

function Mandi({ state, mutate }: { state: BusinessState; mutate: (updater: (current: BusinessState) => BusinessState, message: string) => void }) {
  const farmer = state.parties.find((party) => party.type === "Farmer") ?? state.parties[0];
  const buyer = state.parties.find((party) => party.type === "Buyer" || party.type === "Customer") ?? state.parties[0];
  const [form, setForm] = useState<MandiForm>({ farmerId: farmer.id, buyerId: buyer.id, crop: "Potato", weight: "10", unit: "qtl", rate: "1260", deduction: "250", commissionRate: "1.5" });
  const gross = numberValue(form.weight) * numberValue(form.rate);
  const commission = Math.round(gross * numberValue(form.commissionRate) / 100);
  const payable = Math.max(0, gross - numberValue(form.deduction) - commission);
  function saveLot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate((current) => {
      const lotNo = `LOT-${String(current.lotSeq).padStart(4, "0")}`;
      const lot: MandiLot = { id: id("lot"), lotNo, at: today(), farmerId: form.farmerId, buyerId: form.buyerId, crop: form.crop, weight: numberValue(form.weight), unit: form.unit, rate: numberValue(form.rate), deduction: numberValue(form.deduction), commissionRate: numberValue(form.commissionRate), payable };
      return {
        ...current,
        lotSeq: current.lotSeq + 1,
        mandiLots: [lot, ...current.mandiLots],
        parties: current.parties.map((party) => {
          if (party.id === form.farmerId) return { ...party, balance: party.balance - payable };
          if (party.id === form.buyerId) return { ...party, balance: party.balance + gross };
          return party;
        }),
        ledger: [
          { id: id("led"), at: today(), type: "Mandi lot", partyId: form.farmerId, description: `${lotNo} payable to farmer for ${form.crop}`, debit: 0, credit: payable },
          { id: id("led"), at: today(), type: "Mandi sale", partyId: form.buyerId, description: `${lotNo} buyer receivable for ${form.crop}`, debit: gross, credit: 0 },
          ...current.ledger,
        ],
      };
    }, `Mandi lot saved. Farmer payable and buyer receivable created.`);
  }
  return (
    <section className="workspace-grid">
      <form className="panel" onSubmit={saveLot}>
        <PanelHeader icon={Truck} title="Mandi lot settlement" action="Commission + deductions" />
        <div className="mini-form">
          <label>Farmer<Select value={form.farmerId} onChange={(value) => setForm({ ...form, farmerId: value })} options={state.parties.filter((party) => party.type === "Farmer").map((party) => [party.id, party.name])} /></label>
          <label>Buyer<Select value={form.buyerId} onChange={(value) => setForm({ ...form, buyerId: value })} options={state.parties.filter((party) => party.type === "Buyer" || party.type === "Customer").map((party) => [party.id, party.name])} /></label>
          <label>Crop<input value={form.crop} onChange={(event) => setForm({ ...form, crop: event.target.value })} /></label>
          <label>Weight<input value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} type="number" /></label>
          <label>Unit<input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></label>
          <label>Rate<input value={form.rate} onChange={(event) => setForm({ ...form, rate: event.target.value })} type="number" /></label>
          <label>Deductions<input value={form.deduction} onChange={(event) => setForm({ ...form, deduction: event.target.value })} type="number" /></label>
          <label>Commission %<input value={form.commissionRate} onChange={(event) => setForm({ ...form, commissionRate: event.target.value })} type="number" step="0.01" /></label>
          <button className="primary-button" type="submit">Settle lot {money(payable)}</button>
        </div>
      </form>
      <div className="panel wide">
        <PanelHeader icon={Truck} title="Saved mandi lots" action={`${state.mandiLots.length} lots`} />
        <DataTable columns={["Lot", "Farmer", "Buyer", "Crop", "Payable"]} rows={state.mandiLots.map((row) => [row.lotNo, getParty(state, row.farmerId).name, getParty(state, row.buyerId).name, `${row.weight} ${row.unit} ${row.crop}`, money(row.payable)])} empty="No mandi lots saved yet" />
      </div>
    </section>
  );
}

function Reports({ state }: { state: BusinessState }) {
  const sales = state.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const purchases = state.purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const gst = state.invoices.reduce((sum, invoice) => sum + invoice.gst, 0);
  function exportLedger() {
    downloadCsv("bizmitra-ledger.csv", [
      ["Date", "Type", "Description", "Debit", "Credit"],
      ...state.ledger.map((row) => [row.at, row.type, row.description, row.debit, row.credit]),
    ]);
  }
  return (
    <section className="workspace-grid">
      <div className="panel wide">
        <PanelHeader icon={BarChart3} title="Reports and exports" action="Generated from live data" />
        <div className="owner-grid">
          <StatusLine label="Sales total" value={money(sales)} />
          <StatusLine label="Purchase total" value={money(purchases)} />
          <StatusLine label="GST collected" value={money(gst)} />
          <StatusLine label="Estimated gross margin" value={money(sales - purchases)} />
        </div>
        <div className="action-row">
          <button className="primary-button" type="button" onClick={exportLedger}><Download size={17} />Export ledger CSV</button>
          <button className="ghost-button" type="button" onClick={() => window.print()}><Printer size={17} />Print reports</button>
        </div>
      </div>
      <div className="panel">
        <PanelHeader icon={FileText} title="Audit ledger" action={`${state.ledger.length} entries`} />
        <DataTable columns={["Type", "Description", "Dr", "Cr"]} rows={state.ledger.slice(0, 8).map((row) => [row.type, row.description, money(row.debit), money(row.credit)])} />
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

function Select({ value, options, onChange }: { value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map(([optionValue, label]) => (
        <option value={optionValue} key={optionValue}>{label}</option>
      ))}
    </select>
  );
}

function DataTable({ columns, rows, empty }: { columns: string[]; rows: string[][]; empty?: string }) {
  const tableStyle = { "--cols": columns.length } as CSSProperties;

  return (
    <div className="data-table" role="table" style={tableStyle}>
      <div className="table-row table-head" role="row">
        {columns.map((column) => (
          <span role="columnheader" key={column}>{column}</span>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="empty-row">{empty ?? "No records yet"}</div>
      ) : rows.map((row) => (
        <div className="table-row" role="row" key={row.join("-")}>
          {row.map((cell, index) => (
            <span role="cell" key={`${cell}-${index}`}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
