import type { Metadata } from "next";
import { ErpApp } from "./erp-app";

export const metadata: Metadata = {
  title: "BizMitra | Kirana, Mandi and Trader Business Software",
  description:
    "Billing, inventory, payments, GST-ready reports, and mandi ledgers in one simple Indian trade ERP.",
};

export default function Home() {
  return <ErpApp />;
}
