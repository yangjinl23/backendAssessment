import { track } from "./analytics";

describe("track", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    delete (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  });

  it("pushes a GA4-shaped add_to_cart object when window.dataLayer exists", () => {
    process.env.NODE_ENV = "production";
    window.dataLayer = [];

    track({
      name: "add_to_cart",
      productId: "p1",
      productName: "Widget",
      skuId: "sku-1",
      color: "Black",
      size: "Standard",
      quantity: 2,
      unitPrice: 50,
      currency: "USD",
      value: 100,
    });

    expect(window.dataLayer.length).toBeGreaterThanOrEqual(1);
    const pushed = window.dataLayer[window.dataLayer.length - 1] as {
      event: string;
      ecommerce?: { value?: number };
    };
    expect(pushed.event).toBe("add_to_cart");
    expect(pushed.ecommerce?.value).toBe(100);
  });
});
