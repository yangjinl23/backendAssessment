import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "./CartContext";

function CartProbe(): ReactElement {
  const { count, items, addItem } = useCart();
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="items">{JSON.stringify(items)}</span>
      <button type="button" onClick={() => addItem({ skuId: "a", qty: 2 })}>
        add-a-2
      </button>
      <button type="button" onClick={() => addItem({ skuId: "a", qty: 1 })}>
        add-a-1
      </button>
      <button type="button" onClick={() => addItem({ skuId: "b", qty: 3 })}>
        add-b-3
      </button>
    </div>
  );
}

describe("CartProvider", () => {
  it("starts at zero and merges quantities for the same skuId", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: "add-a-2" }));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("items")).toHaveTextContent(
      JSON.stringify([{ skuId: "a", qty: 2 }])
    );

    await user.click(screen.getByRole("button", { name: "add-a-1" }));
    expect(screen.getByTestId("count")).toHaveTextContent("3");

    await user.click(screen.getByRole("button", { name: "add-b-3" }));
    expect(screen.getByTestId("count")).toHaveTextContent("6");
    expect(screen.getByTestId("items")).toHaveTextContent("b");
    expect(screen.getByTestId("items")).toHaveTextContent("a");
  });
});
