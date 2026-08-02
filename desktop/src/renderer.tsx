import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErpApp } from "../../app/erp-app";
import "../../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Desktop root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <ErpApp />
  </StrictMode>,
);
