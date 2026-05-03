import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartLineItem {
  readonly skuId: string;
  readonly qty: number;
}

export interface CartContextValue {
  readonly items: readonly CartLineItem[];
  readonly count: number;
  readonly addItem: (item: CartLineItem) => void;
}

interface CartStateValue {
  readonly items: readonly CartLineItem[];
  readonly count: number;
}

interface CartDispatchValue {
  readonly addItem: (item: CartLineItem) => void;
}

const CartStateContext = createContext<CartStateValue | null>(null);
const CartDispatchContext = createContext<CartDispatchValue | null>(null);

export function CartProvider({ children }: { readonly children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  const addItem = useCallback((item: CartLineItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.skuId === item.skuId);
      if (idx === -1) return [...prev, item];
      const next = prev.slice();
      const existing = next[idx];
      if (!existing) return prev;
      next[idx] = { ...existing, qty: existing.qty + item.qty };
      return next;
    });
  }, []);

  const stateValue = useMemo<CartStateValue>(() => {
    const count = items.reduce((sum, it) => sum + it.qty, 0);
    return { items, count };
  }, [items]);

  const dispatchValue = useMemo<CartDispatchValue>(
    () => ({ addItem }),
    [addItem]
  );

  return (
    <CartDispatchContext.Provider value={dispatchValue}>
      <CartStateContext.Provider value={stateValue}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

/** Subscribe to cart contents / count only (e.g. header badge). */
export function useCartState(): CartStateValue {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error("useCartState must be used within <CartProvider>");
  return ctx;
}

/** Subscribe to cart actions only; does not re-render when the cart count changes. */
export function useCartDispatch(): CartDispatchValue {
  const ctx = useContext(CartDispatchContext);
  if (!ctx) throw new Error("useCartDispatch must be used within <CartProvider>");
  return ctx;
}

export function useCart(): CartContextValue {
  const state = useCartState();
  const dispatch = useCartDispatch();
  return useMemo(
    () => ({ ...state, ...dispatch }),
    [state, dispatch]
  );
}
