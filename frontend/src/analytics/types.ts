import type { ColorId, SizeId } from "../types/product";

/** Discriminated union — extend with new `name` literals as product surface grows. */
export type AnalyticsEvent =
  | {
      readonly name: "view_item";
      readonly productId: string;
      readonly productName: string;
      readonly skuId: string;
      readonly color: ColorId;
      readonly size: SizeId;
      readonly price: number;
      readonly currency: string;
    }
  | {
      readonly name: "select_variant";
      readonly productId: string;
      readonly skuId: string;
      readonly color: ColorId;
      readonly size: SizeId;
      readonly price: number;
      readonly currency: string;
    }
  | {
      readonly name: "add_to_cart";
      readonly productId: string;
      readonly productName: string;
      readonly skuId: string;
      readonly color: ColorId;
      readonly size: SizeId;
      readonly quantity: number;
      readonly unitPrice: number;
      readonly currency: string;
      readonly value: number;
    }
  | {
      readonly name: "add_to_cart_error";
      readonly productId: string;
      readonly skuId: string;
      readonly message: string;
    };
