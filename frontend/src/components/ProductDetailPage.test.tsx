import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { track } from "../analytics";
import { addToCart, getProduct } from "../api/mockApi";
import { CartProvider } from "../context/CartContext";
import { testProduct } from "../test/fixtures/product";
import Header from "./Header";
import ProductDetailPage from "./ProductDetailPage";

jest.mock("../api/mockApi", () => ({
  getProduct: jest.fn(),
  addToCart: jest.fn(),
}));

jest.mock("../analytics", () => ({
  track: jest.fn(),
}));

const mockedGetProduct = jest.mocked(getProduct);
const mockedAddToCart = jest.mocked(addToCart);
const mockedTrack = jest.mocked(track);

function renderPdp(): void {
  render(
    <CartProvider>
      <Header />
      <ProductDetailPage productId="test-buds" />
    </CartProvider>
  );
}

describe("ProductDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetProduct.mockResolvedValue(testProduct);
    mockedAddToCart.mockImplementation(async (payload) => ({
      ok: true,
      skuId: payload.skuId,
      qty: payload.qty,
      at: new Date().toISOString(),
    }));
  });

  it("loads product, updates price when size changes, and adds to cart", async () => {
    const user = userEvent.setup();
    renderPdp();

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Buds");
    });

    await waitFor(() => {
      expect(mockedTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "view_item",
          productId: "test-buds",
          skuId: "sku-bs",
        })
      );
    });

    expect(mockedGetProduct).toHaveBeenCalledWith("test-buds");
    expect(screen.getByText(/99\.00/)).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /^Pro$/ }));
    await waitFor(() => {
      expect(screen.getByText(/149\.00/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockedTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "select_variant",
          skuId: "sku-bp",
        })
      );
    });

    expect(screen.getByText(/Black Pro copy/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Add to cart/i }));

    expect(await screen.findByText(/Added 1/)).toBeInTheDocument();
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");

    expect(mockedAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ skuId: "sku-bp", qty: 1 })
    );

    expect(mockedTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "add_to_cart",
        skuId: "sku-bp",
        quantity: 1,
        value: 149,
      })
    );
  });

  it("shows error UI and retries when getProduct fails", async () => {
    const user = userEvent.setup();
    mockedGetProduct.mockRejectedValueOnce(new Error("network down"));
    renderPdp();

    expect(await screen.findByText(/network down/)).toBeInTheDocument();

    mockedGetProduct.mockResolvedValueOnce(testProduct);
    await user.click(screen.getByRole("button", { name: /Try again/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Buds");
    });
  });

  it("tracks add_to_cart_error when addToCart rejects", async () => {
    const user = userEvent.setup();
    mockedAddToCart.mockRejectedValueOnce(new Error("rate limited"));
    renderPdp();

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Buds");
    });

    await user.click(screen.getByRole("button", { name: /Add to cart/i }));

    expect(await screen.findByText(/rate limited/)).toBeInTheDocument();
    expect(mockedTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "add_to_cart_error",
        message: "rate limited",
      })
    );
  });
});
