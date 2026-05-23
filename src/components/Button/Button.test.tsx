import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it('has type="button" by default to prevent accidental form submission', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("accepts a custom type", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard accessible via Enter key", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard accessible via Space key", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("passes through arbitrary HTML button attributes", () => {
    render(<Button aria-label="custom label">Icon</Button>);
    expect(
      screen.getByRole("button", { name: "custom label" }),
    ).toBeInTheDocument();
  });
});
