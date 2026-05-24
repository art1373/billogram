import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccordionSection } from "./AccordionSection";

const setup = (
  props?: Partial<React.ComponentProps<typeof AccordionSection>>,
) => render(<AccordionSection {...props} />);

describe("AccordionSection", () => {
  describe("rendering", () => {
    it("renders the section title", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /betala och koppla bankkonto/i }),
      ).toBeInTheDocument();
    });

    it("is open by default", () => {
      setup();

      expect(screen.getByRole("region")).toBeVisible();
    });

    it("can start closed via defaultOpen={false}", () => {
      setup({ defaultOpen: false });

      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });
  });

  describe("content when open", () => {
    it("shows the faster payment benefit", () => {
      setup();

      expect(
        screen.getByText(/snabbare betalning av framtida fakturor/i),
      ).toBeVisible();
    });

    it("shows the secure bank connection benefit", () => {
      setup();

      expect(screen.getByText(/säker koppling till din bank/i)).toBeVisible();
    });

    it('renders the "Läs mer" link with an href', () => {
      setup();

      const link = screen.getByRole("link", { name: /läs mer/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "https://www.billogram.com/sv/blogg/varldens-basta-enkla-betalning",
      );
    });

    it("renders the primary BankID button", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /start mobile bankid/i }),
      ).toBeInTheDocument();
    });

    it("renders the secondary other-device button", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /mobile bankid on other device/i }),
      ).toBeInTheDocument();
    });
  });

  describe("content when closed", () => {
    it("hides the benefit list", () => {
      setup({ defaultOpen: false });

      expect(
        screen.queryByRole("list", { name: /benefits/i }),
      ).not.toBeInTheDocument();
    });

    it("hides the action buttons", () => {
      setup({ defaultOpen: false });

      expect(
        screen.queryByRole("button", { name: /start mobile bankid/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("collapses when the header is clicked while open", async () => {
      setup();

      await userEvent.click(
        screen.getByRole("button", { name: /betala och koppla bankkonto/i }),
      );
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });

    it("expands when the header is clicked while closed", async () => {
      setup({ defaultOpen: false });

      await userEvent.click(
        screen.getByRole("button", { name: /betala och koppla bankkonto/i }),
      );
      expect(screen.getByRole("region")).toBeVisible();
    });
  });

  describe("accessibility", () => {
    it("toggle button references the panel via aria-controls", () => {
      setup();

      const toggle = screen.getByRole("button", {
        name: /betala och koppla bankkonto/i,
      });
      const panelId = toggle.getAttribute("aria-controls")!;
      const panel = document.getElementById(panelId);
      expect(panel).toHaveAttribute("role", "region");
    });

    it("panel is labelled by the toggle button", () => {
      setup();

      const toggle = screen.getByRole("button", {
        name: /betala och koppla bankkonto/i,
      });
      const panel = screen.getByRole("region");
      expect(panel.getAttribute("aria-labelledby")).toBe(toggle.id);
    });

    it("all interactive elements inside the panel are reachable via keyboard", async () => {
      setup();

      await userEvent.tab();
      expect(
        screen.getByRole("button", { name: /betala och koppla bankkonto/i }),
      ).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole("link", { name: /läs mer/i })).toHaveFocus();

      await userEvent.tab();
      expect(
        screen.getByRole("button", { name: /start mobile bankid/i }),
      ).toHaveFocus();

      await userEvent.tab();
      expect(
        screen.getByRole("button", { name: /mobile bankid on other device/i }),
      ).toHaveFocus();
    });

    it("benefits list has an accessible label", () => {
      setup();

      const panel = screen.getByRole("region");
      expect(
        within(panel).getByRole("list", { name: /benefits/i }),
      ).toBeInTheDocument();
    });
  });
});
