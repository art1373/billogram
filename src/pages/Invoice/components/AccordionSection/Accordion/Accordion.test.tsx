import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

const setup = (props?: { defaultOpen?: boolean; isLoading?: boolean }) => {
  render(
    <Accordion {...props}>
      <Accordion.Trigger>Test Title</Accordion.Trigger>
      <Accordion.Content>
        <p>Panel content</p>
      </Accordion.Content>
    </Accordion>,
  );
};

describe("Accordion", () => {
  describe("rendering", () => {
    it("renders the title", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /test title/i }),
      ).toBeInTheDocument();
    });

    it("wraps the trigger in a heading element", () => {
      setup();

      const heading = screen.getByRole("heading");
      expect(within(heading).getByRole("button")).toBeInTheDocument();
    });

    it("hides the panel by default", () => {
      setup();

      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });

    it("shows the panel when defaultOpen is true", () => {
      setup({ defaultOpen: true });

      expect(screen.getByRole("region")).toBeVisible();
      expect(screen.getByText("Panel content")).toBeVisible();
    });
  });

  describe("WAI-ARIA attributes", () => {
    it('sets aria-expanded="false" when closed', () => {
      setup();

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it('sets aria-expanded="true" when open', () => {
      setup({ defaultOpen: true });

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("connects button to panel via aria-controls / id", () => {
      setup({ defaultOpen: true });

      const button = screen.getByRole("button");
      const panelId = button.getAttribute("aria-controls")!;
      expect(document.getElementById(panelId)).toBe(screen.getByRole("region"));
    });

    it("connects panel to button via aria-labelledby / id", () => {
      setup({ defaultOpen: true });

      const button = screen.getByRole("button");
      const panel = screen.getByRole("region");
      expect(panel.getAttribute("aria-labelledby")).toBe(button.id);
    });

    it('panel has role="region"', () => {
      setup({ defaultOpen: true });

      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("opens when the header button is clicked", async () => {
      setup();

      await userEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("region")).toBeVisible();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("closes when the header button is clicked again", async () => {
      setup({ defaultOpen: true });

      await userEvent.click(screen.getByRole("button"));
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("toggles open/close on repeated clicks", async () => {
      setup();

      const btn = screen.getByRole("button");
      await userEvent.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "true");
      await userEvent.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "false");
      await userEvent.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("loading state", () => {
    it('sets aria-busy="true" on the trigger button', () => {
      setup({ isLoading: true });

      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it('sets aria-busy="false" when not loading', () => {
      setup();

      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "false");
    });

    it("does not open the panel when clicked while loading", async () => {
      setup({ isLoading: true }); // defaultOpen=false

      await userEvent.click(screen.getByRole("button"));

      expect(screen.queryByRole("region")).not.toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("does not close the panel when clicked while loading", async () => {
      setup({ defaultOpen: true, isLoading: true });

      await userEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("region")).toBeVisible();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
  });

  describe("keyboard accessibility", () => {
    it("is focusable via Tab", async () => {
      setup();

      await userEvent.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    it("opens on Enter key", async () => {
      setup();

      screen.getByRole("button").focus();
      await userEvent.keyboard("{Enter}");
      expect(screen.getByRole("region")).toBeVisible();
    });

    it("opens on Space key", async () => {
      setup();

      screen.getByRole("button").focus();
      await userEvent.keyboard(" ");
      expect(screen.getByRole("region")).toBeVisible();
    });
  });

  describe("children", () => {
    it("renders children inside the panel when open", () => {
      setup({ defaultOpen: true });

      expect(screen.getByText("Panel content")).toBeInTheDocument();
    });

    it("does not render children when closed", () => {
      setup();

      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });
  });
});
