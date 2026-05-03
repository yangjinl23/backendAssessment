import type { Product } from "../../types/product";

/** Minimal `Product` for unit / component tests (two colors × two sizes). */
export const testProduct: Product = {
  id: "test-buds",
  name: "Test Buds",
  brand: "TestCo",
  currency: "USD",
  rating: 4,
  reviews: 42,
  description: "Default product description.",
  highlights: ["Highlight A", "Highlight B"],
  variantOptions: {
    color: ["Black", "White"],
    size: ["Standard", "Pro"],
  },
  skus: [
    {
      id: "sku-bs",
      color: "Black",
      size: "Standard",
      price: 99,
      stock: 10,
      image: "/images/headphones-black.svg",
      description: "Black Standard copy.",
      highlights: ["BS-1", "BS-2"],
    },
    {
      id: "sku-bp",
      color: "Black",
      size: "Pro",
      price: 149,
      stock: 3,
      image: "/images/headphones-black.svg",
      description: "Black Pro copy.",
      highlights: ["BP-1", "BP-2"],
    },
    {
      id: "sku-ws",
      color: "White",
      size: "Standard",
      price: 109,
      stock: 2,
      image: "/images/headphones-white.svg",
      description: "White Standard copy.",
      highlights: ["WS-1", "WS-2"],
    },
    {
      id: "sku-wp",
      color: "White",
      size: "Pro",
      price: 159,
      stock: 0,
      image: "/images/headphones-white.svg",
      description: "White Pro copy.",
      highlights: ["WP-1", "WP-2"],
    },
  ],
};
