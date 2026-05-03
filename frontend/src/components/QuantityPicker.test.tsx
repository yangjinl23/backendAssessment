import { useState, type ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityPicker from "./QuantityPicker";

function ControlledQty({
  initial,
  max,
}: {
  readonly initial: number;
  readonly max: number;
}): ReactElement {
  const [v, setV] = useState(initial);
  return <QuantityPicker value={v} max={max} onChange={setV} disabled={false} />;
}

describe("QuantityPicker", () => {
  it("clamps quantity between 1 and max when using +/- controls", async () => {
    const user = userEvent.setup();
    render(<ControlledQty initial={3} max={5} />);

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("disables controls when disabled is true", () => {
    render(<QuantityPicker value={2} max={5} onChange={jest.fn()} disabled />);

    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();
    expect(screen.getByDisplayValue("2")).toBeDisabled();
  });
});
