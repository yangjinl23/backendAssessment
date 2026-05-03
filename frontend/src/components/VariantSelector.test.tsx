import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { testProduct } from "../test/fixtures/product";
import VariantSelector from "./VariantSelector";

describe("VariantSelector", () => {
  it("calls onChangeColor when a color pill is clicked", async () => {
    const user = userEvent.setup();
    const onChangeColor = jest.fn();
    const onChangeSize = jest.fn();

    render(
      <VariantSelector
        options={testProduct.variantOptions}
        skus={testProduct.skus}
        selectedColor="Black"
        selectedSize="Standard"
        onChangeColor={onChangeColor}
        onChangeSize={onChangeSize}
      />
    );

    await user.click(screen.getByRole("radio", { name: /White/i }));
    expect(onChangeColor).toHaveBeenCalledWith("White");
    expect(onChangeSize).not.toHaveBeenCalled();
  });

  it("calls onChangeSize when a size pill is clicked", async () => {
    const user = userEvent.setup();
    const onChangeColor = jest.fn();
    const onChangeSize = jest.fn();

    render(
      <VariantSelector
        options={testProduct.variantOptions}
        skus={testProduct.skus}
        selectedColor="Black"
        selectedSize="Standard"
        onChangeColor={onChangeColor}
        onChangeSize={onChangeSize}
      />
    );

    await user.click(screen.getByRole("radio", { name: /^Pro$/ }));
    expect(onChangeSize).toHaveBeenCalledWith("Pro");
    expect(onChangeColor).not.toHaveBeenCalled();
  });
});
