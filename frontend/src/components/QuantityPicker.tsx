import { memo, type ChangeEvent, type ReactElement } from "react";

export interface QuantityPickerProps {
  readonly value: number;
  readonly max: number;
  readonly onChange: (next: number) => void;
  readonly disabled: boolean;
}

function QuantityPicker({
  value,
  max,
  onChange,
  disabled,
}: QuantityPickerProps): ReactElement {
  const safeMax = Math.max(0, max);
  const dec = (): void => {
    onChange(Math.max(1, value - 1));
  };
  const inc = (): void => {
    onChange(Math.min(safeMax || 1, value + 1));
  };
  const onInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const n = parseInt(e.target.value, 10);
    if (Number.isNaN(n)) {
      onChange(1);
      return;
    }
    onChange(Math.min(Math.max(1, n), Math.max(1, safeMax)));
  };

  return (
    <div className={`qty ${disabled ? "is-disabled" : ""}`}>
      <span className="qty__label">Quantity</span>
      <div className="qty__controls" role="group" aria-label="Quantity">
        <button
          type="button"
          className="qty__btn"
          onClick={dec}
          disabled={disabled || value <= 1}
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <input
          className="qty__input"
          type="number"
          min={1}
          max={Math.max(1, safeMax)}
          value={value}
          onChange={onInput}
          disabled={disabled}
          aria-label="Quantity"
        />
        <button
          type="button"
          className="qty__btn"
          onClick={inc}
          disabled={disabled || value >= safeMax}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      {!disabled && <span className="qty__hint">{String(safeMax)} in stock</span>}
    </div>
  );
}

export default memo(QuantityPicker);
