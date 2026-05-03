import { memo, type ReactElement } from "react";

export interface AddToCartButtonProps {
  readonly disabled: boolean;
  readonly submitting: boolean;
  readonly outOfStock: boolean;
  readonly onClick: () => void;
}

function AddToCartButton({
  disabled,
  submitting,
  outOfStock,
  onClick,
}: AddToCartButtonProps): ReactElement {
  let label = "Add to cart";
  if (outOfStock) label = "Out of stock";
  else if (submitting) label = "Adding\u2026";

  return (
    <button
      type="button"
      className={`atc ${outOfStock ? "atc--oos" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {!outOfStock && !submitting && (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L21 7H6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}

export default memo(AddToCartButton);
