import type { AnalyticsEvent } from "./types";

declare global {
  interface Window {
    /** Optional GA4 / GTM queue — if present, events are pushed in a compatible shape. */
    dataLayer?: unknown[];
  }
}

function toGa4Payload(event: AnalyticsEvent): Record<string, unknown> {
  switch (event.name) {
    case "view_item":
      return {
        event: "view_item",
        ecommerce: {
          currency: event.currency,
          value: event.price,
          items: [
            {
              item_id: event.skuId,
              item_name: event.productName,
              item_variant: `${event.color} / ${event.size}`,
              price: event.price,
              quantity: 1,
            },
          ],
        },
      };
    case "select_variant":
      return {
        event: "select_item",
        ecommerce: {
          currency: event.currency,
          items: [
            {
              item_id: event.skuId,
              item_variant: `${event.color} / ${event.size}`,
              price: event.price,
            },
          ],
        },
      };
    case "add_to_cart":
      return {
        event: "add_to_cart",
        ecommerce: {
          currency: event.currency,
          value: event.value,
          items: [
            {
              item_id: event.skuId,
              item_name: event.productName,
              item_variant: `${event.color} / ${event.size}`,
              price: event.unitPrice,
              quantity: event.quantity,
            },
          ],
        },
      };
    case "add_to_cart_error":
      return {
        event: "add_to_cart_error",
        error_message: event.message,
        item_id: event.skuId,
        product_id: event.productId,
      };
  }
}

/**
 * Application analytics entry point.
 * - In development, logs a structured object to the console.
 * - If `window.dataLayer` exists (GTM / gtag), pushes a GA4-oriented payload.
 * - Swap this module for Segment / Amplitude / internal beacon without changing call sites.
 */
export function track(event: AnalyticsEvent): void {
  const envelope = {
    ...event,
    ts: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console -- intentional dev-only analytics sink
    console.info("[analytics]", envelope);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(toGa4Payload(event));
  }
}
