import { render, screen } from "@testing-library/react";
import Description from "./Description";

describe("Description", () => {
  it("renders variant label, body, and highlights", () => {
    render(
      <Description
        variantLabel="Black · Pro"
        description="Variant-specific body."
        highlights={["One", "Two"]}
      />
    );

    expect(screen.getByText(/Selected:/)).toHaveTextContent("Black · Pro");
    expect(screen.getByText("Variant-specific body.")).toBeInTheDocument();
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("omits variant line when variantLabel is empty", () => {
    render(
      <Description variantLabel="" description="Only body." highlights={[]} />
    );

    expect(screen.queryByText(/Selected:/)).not.toBeInTheDocument();
    expect(screen.getByText("Only body.")).toBeInTheDocument();
  });
});
