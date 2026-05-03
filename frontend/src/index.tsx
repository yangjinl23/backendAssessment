import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { CartProvider } from "./context/CartContext";

const el = document.getElementById("root");
if (!el) {
  throw new Error('Missing root element with id "root"');
}

createRoot(el).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
