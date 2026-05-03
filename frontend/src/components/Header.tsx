import type { ReactElement } from "react";
import { useCartState } from "../context/CartContext";

export default function Header(): ReactElement {
  const { count } = useCartState();
  return (
    <header className="header">
      <div className="header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden>
            A
          </span>
          <span className="brand__name">Aurora Audio</span>
        </div>
        <button type="button" className="cart" aria-label={`Cart, ${String(count)} items`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
            <path
              d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L21 7H6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="20" r="1.5" fill="currentColor" />
            <circle cx="17" cy="20" r="1.5" fill="currentColor" />
          </svg>
          <span className="cart__label">Cart</span>
          <span
            className={`cart__badge ${count > 0 ? "is-active" : ""}`}
            data-testid="cart-count"
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
