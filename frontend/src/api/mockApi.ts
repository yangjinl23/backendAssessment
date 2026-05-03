import type { Product } from "../types/product";

type DemoFailFlag = "product" | "cart";

/**
 * Mock API layer.
 *
 * Demo flags via URL query string:
 *   ?fail=product  -> getProduct rejects (API error path)
 *   ?fail=cart     -> addToCart rejects (post-submit error path)
 *   ?slow=1        -> doubles the latency
 */

const baseDelay = (): number => {
  const params = new URLSearchParams(window.location.search);
  const slow = params.get("slow") === "1";
  return slow ? 1400 : 700;
};

const shouldFail = (which: DemoFailFlag): boolean => {
  const params = new URLSearchParams(window.location.search);
  return params.get("fail") === which;
};

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function getProduct(_productId: string): Promise<Product> {
  void _productId; // reserved for future multi-product routing
  await wait(baseDelay());
  if (shouldFail("product")) {
    throw new Error("Failed to load product (simulated).");
  }
  const res = await fetch("/products.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Product fetch failed with HTTP ${String(res.status)}`);
  }
  const data: unknown = await res.json();
  return data as Product;
}

export interface AddToCartPayload {
  readonly skuId: string;
  readonly qty: number;
}

export interface AddToCartResult {
  readonly ok: true;
  readonly skuId: string;
  readonly qty: number;
  readonly at: string;
}

export async function addToCart({
  skuId,
  qty,
}: AddToCartPayload): Promise<AddToCartResult> {
  await wait(Math.max(300, baseDelay() / 2));
  if (shouldFail("cart")) {
    throw new Error("Add to cart failed (simulated).");
  }
  if (!skuId || !Number.isInteger(qty) || qty < 1) {
    throw new Error("Invalid cart payload.");
  }
  return { ok: true, skuId, qty, at: new Date().toISOString() };
}
