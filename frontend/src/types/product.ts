/** Variant dimension values — aligned with `public/products.json`. */

export type ColorId = "Black" | "White" | "Blue";

export type SizeId = "Standard" | "Pro";

export interface Sku {
  readonly id: string;
  readonly color: ColorId;
  readonly size: SizeId;
  readonly price: number;
  readonly stock: number;
  readonly image: string;
  /** When set, overrides `Product.description` for this SKU. */
  readonly description?: string;
  /** When set, overrides `Product.highlights` for this SKU. */
  readonly highlights?: readonly string[];
}

export interface VariantOptions {
  readonly color: readonly ColorId[];
  readonly size: readonly SizeId[];
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly currency: string;
  readonly rating: number;
  readonly reviews: number;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly variantOptions: VariantOptions;
  readonly skus: readonly Sku[];
}
