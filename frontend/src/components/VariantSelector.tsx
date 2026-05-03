import { memo, type ReactElement } from "react";
import type { ColorId, SizeId, Sku, VariantOptions } from "../types/product";

const COLOR_SWATCH: Record<ColorId, string> = {
  Black: "#1a1c20",
  White: "#f3f4f7",
  Blue: "#3a86ff",
};

function isAvailable(
  skus: readonly Sku[],
  filter: Partial<Pick<Sku, "color" | "size">>
): boolean {
  return skus.some((s) => {
    if (filter.color !== undefined && s.color !== filter.color) return false;
    if (filter.size !== undefined && s.size !== filter.size) return false;
    return s.stock > 0;
  });
}

export interface VariantSelectorProps {
  readonly options: VariantOptions;
  readonly skus: readonly Sku[];
  readonly selectedColor: ColorId;
  readonly selectedSize: SizeId;
  readonly onChangeColor: (color: ColorId) => void;
  readonly onChangeSize: (size: SizeId) => void;
}

function VariantSelector({
  options,
  skus,
  selectedColor,
  selectedSize,
  onChangeColor,
  onChangeSize,
}: VariantSelectorProps): ReactElement {
  return (
    <div className="variants">
      <div className="variant-group">
        <div className="variant-group__head">
          <span className="variant-group__label">Color</span>
          <span className="variant-group__value">{selectedColor}</span>
        </div>
        <div className="variant-group__pills" role="radiogroup" aria-label="Color">
          {options.color.map((c) => {
            const available = isAvailable(skus, { color: c });
            const active = c === selectedColor;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={active}
                className={`pill pill--swatch ${active ? "is-active" : ""} ${
                  !available ? "is-unavailable" : ""
                }`}
                onClick={() => {
                  onChangeColor(c);
                }}
                title={`${c}${available ? "" : " (sold out)"}`}
              >
                <span
                  className="swatch"
                  style={{ background: COLOR_SWATCH[c] }}
                  aria-hidden
                />
                <span className="pill__label">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="variant-group">
        <div className="variant-group__head">
          <span className="variant-group__label">Size</span>
          <span className="variant-group__value">{selectedSize}</span>
        </div>
        <div className="variant-group__pills" role="radiogroup" aria-label="Size">
          {options.size.map((s) => {
            const available = isAvailable(skus, {
              color: selectedColor,
              size: s,
            });
            const active = s === selectedSize;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                className={`pill ${active ? "is-active" : ""} ${
                  !available ? "is-unavailable" : ""
                }`}
                onClick={() => {
                  onChangeSize(s);
                }}
                title={`${s}${available ? "" : " (sold out for this color)"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(VariantSelector);
