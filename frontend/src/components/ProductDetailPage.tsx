import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { track } from "../analytics";
import { addToCart, getProduct } from "../api/mockApi";
import { useCartDispatch } from "../context/CartContext";
import type { ColorId, Product, SizeId, Sku } from "../types/product";
import AddToCartButton from "./AddToCartButton";
import Description from "./Description";
import ProductGallery from "./ProductGallery";
import QuantityPicker from "./QuantityPicker";
import Skeleton from "./Skeleton";
import Toast, { type ToastKind } from "./Toast";
import VariantSelector from "./VariantSelector";

const formatPrice = (n: number, currency = "USD"): string =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

function findSku(
  skus: readonly Sku[],
  color: ColorId,
  size: SizeId
): Sku | undefined {
  return skus.find((s) => s.color === color && s.size === size);
}

function pickInitialVariant(product: Product): {
  color: ColorId;
  size: SizeId;
} {
  const inStock = product.skus.find((s) => s.stock > 0) ?? product.skus[0];
  if (!inStock) {
    throw new Error("Product has no SKUs");
  }
  return { color: inStock.color, size: inStock.size };
}

interface ToastState {
  readonly kind: ToastKind;
  readonly message: string;
}

export interface ProductDetailPageProps {
  readonly productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps): ReactElement {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [color, setColor] = useState<ColorId | null>(null);
  const [size, setSize] = useState<SizeId | null>(null);
  const [qty, setQty] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { addItem } = useCartDispatch();

  const viewItemFired = useRef(false);
  const prevSkuId = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProduct(productId);
      viewItemFired.current = false;
      prevSkuId.current = null;
      setProduct(data);
      const initial = pickInitialVariant(data);
      setColor(initial.color);
      setSize(initial.size);
      setQty(1);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const currentSku = useMemo((): Sku | null => {
    if (!product || color === null || size === null) return null;
    return findSku(product.skus, color, size) ?? null;
  }, [product, color, size]);

  useEffect(() => {
    if (!currentSku) return;
    if (qty > currentSku.stock) {
      setQty(Math.max(1, currentSku.stock));
    }
  }, [currentSku, qty]);

  useEffect(() => {
    if (product === null || currentSku === null) return;
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    track({
      name: "view_item",
      productId: product.id,
      productName: product.name,
      skuId: currentSku.id,
      color: currentSku.color,
      size: currentSku.size,
      price: currentSku.price,
      currency: product.currency,
    });
  }, [product, currentSku]);

  useEffect(() => {
    if (product === null || currentSku === null) return;
    if (prevSkuId.current === null) {
      prevSkuId.current = currentSku.id;
      return;
    }
    if (prevSkuId.current === currentSku.id) return;
    prevSkuId.current = currentSku.id;
    track({
      name: "select_variant",
      productId: product.id,
      skuId: currentSku.id,
      color: currentSku.color,
      size: currentSku.size,
      price: currentSku.price,
      currency: product.currency,
    });
  }, [product, currentSku]);

  const onChangeColor = useCallback((c: ColorId): void => {
    setColor(c);
    setSize((prevSize) => {
      if (product === null || prevSize === null) return prevSize;
      const stillExists = findSku(product.skus, c, prevSize);
      if (stillExists && stillExists.stock > 0) return prevSize;
      const fallback =
        product.skus.find((s) => s.color === c && s.stock > 0) ??
        product.skus.find((s) => s.color === c);
      return fallback ? fallback.size : prevSize;
    });
  }, [product]);

  const onAdd = useCallback(async (): Promise<void> => {
    if (!currentSku || currentSku.stock === 0 || product === null) return;
    setSubmitting(true);
    setToast(null);
    try {
      const res = await addToCart({ skuId: currentSku.id, qty });
      addItem({ skuId: res.skuId, qty: res.qty });
      track({
        name: "add_to_cart",
        productId: product.id,
        productName: product.name,
        skuId: currentSku.id,
        color: currentSku.color,
        size: currentSku.size,
        quantity: res.qty,
        unitPrice: currentSku.price,
        currency: product.currency,
        value: currentSku.price * res.qty,
      });
      setToast({
        kind: "success",
        message: `Added ${String(res.qty)} \u00d7 ${product.name}`,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Add to cart failed.";
      track({
        name: "add_to_cart_error",
        productId: product.id,
        skuId: currentSku.id,
        message: msg,
      });
      setToast({ kind: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }, [addItem, currentSku, product, qty]);

  const dismissToast = useCallback((): void => {
    setToast(null);
  }, []);

  const handleAddClick = useCallback((): void => {
    void onAdd();
  }, [onAdd]);

  if (loading) return <Skeleton />;

  if (error !== null) {
    return (
      <div className="state state--error" role="alert">
        <h2>We couldn&apos;t load this product</h2>
        <p>{error}</p>
        <button type="button" className="btn" onClick={() => void load()}>
          Try again
        </button>
      </div>
    );
  }

  if (product === null || color === null || size === null || currentSku === null) {
    return (
      <div className="state state--error" role="alert">
        <h2>Product not available</h2>
        <p>The selected variant is not currently sold.</p>
      </div>
    );
  }

  const outOfStock = currentSku.stock === 0;

  return (
    <article className="pdp">
      <ProductGallery
        image={currentSku.image}
        alt={`${product.name} in ${color}`}
      />
      <div className="pdp__info">
        <div className="pdp__crumbs">
          {product.brand} <span aria-hidden> / </span> Headphones
        </div>
        <h1 className="pdp__title">{product.name}</h1>

        <div className="pdp__rating">
          <span className="stars" aria-hidden>
            {"\u2605".repeat(Math.round(product.rating))}
            {"\u2606".repeat(5 - Math.round(product.rating))}
          </span>
          <span className="rating__num">
            {product.rating.toFixed(1)} ({product.reviews.toLocaleString()} reviews)
          </span>
        </div>

        <div className="pdp__price-row">
          <div className="pdp__price">
            {formatPrice(currentSku.price, product.currency)}
          </div>
          <span
            className={`stock ${
              outOfStock ? "stock--oos" : currentSku.stock <= 4 ? "stock--low" : "stock--ok"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : currentSku.stock <= 4
                ? `Only ${String(currentSku.stock)} left`
                : "In stock"}
          </span>
        </div>

        <VariantSelector
          options={product.variantOptions}
          skus={product.skus}
          selectedColor={color}
          selectedSize={size}
          onChangeColor={onChangeColor}
          onChangeSize={setSize}
        />

        <QuantityPicker
          value={qty}
          max={currentSku.stock}
          onChange={setQty}
          disabled={outOfStock}
        />

        <AddToCartButton
          disabled={outOfStock || submitting}
          submitting={submitting}
          outOfStock={outOfStock}
          onClick={handleAddClick}
        />

        <Description
          variantLabel={`${color} · ${size}`}
          description={currentSku.description ?? product.description}
          highlights={currentSku.highlights ?? product.highlights}
        />
      </div>

      <Toast message={toast?.message} kind={toast?.kind} onDismiss={dismissToast} />
    </article>
  );
}
