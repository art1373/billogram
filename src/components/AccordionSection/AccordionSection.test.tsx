import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccordionSection } from './AccordionSection';

const renderSection = (props?: Partial<React.ComponentProps<typeof AccordionSection>>) =>
  render(<AccordionSection {...props} />);

describe('AccordionSection', () => {
  describe('rendering', () => {
    it('renders the section title', () => {
      renderSection();
      expect(
        screen.getByRole('button', { name: /betala och koppla bankkonto/i })
      ).toBeInTheDocument();
    });

    it('is open by default', () => {
      renderSection();
      expect(screen.getByRole('region')).toBeVisible();
    });

    it('can start closed via defaultOpen={false}', () => {
      renderSection({ defaultOpen: false });
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });

  describe('content when open', () => {
    it('shows the faster payment benefit', () => {
      renderSection();
      expect(
        screen.getByText(/snabbare betalning av framtida fakturor/i)
      ).toBeVisible();
    });

    it('shows the secure bank connection benefit', () => {
      renderSection();
      expect(screen.getByText(/säker koppling till din bank/i)).toBeVisible();
    });

    it('renders the "Läs mer" link with an href', () => {
      renderSection();
      const link = screen.getByRole('link', { name: /läs mer/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });

    it('renders the primary BankID button', () => {
      renderSection();
      expect(
        screen.getByRole('button', { name: /start mobile bankid/i })
      ).toBeInTheDocument();
    });

    it('renders the secondary other-device button', () => {
      renderSection();
      expect(
        screen.getByRole('button', { name: /mobile bankid on other device/i })
      ).toBeInTheDocument();
    });
  });

  describe('content when closed', () => {
    it('hides the benefit list', () => {
      renderSection({ defaultOpen: false });
      // queryByRole respects hidden — the list is unreachable when panel is hidden
      expect(screen.queryByRole('list', { name: /benefits/i })).not.toBeInTheDocument();
    });

    it('hides the action buttons', () => {
      renderSection({ defaultOpen: false });
      expect(
        screen.queryByRole('button', { name: /start mobile bankid/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('collapses when the header is clicked while open', async () => {
      renderSection();
      const toggle = screen.getByRole('button', {
        name: /betala och koppla bankkonto/i,
      });
      await userEvent.click(toggle);
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('expands when the header is clicked while closed', async () => {
      renderSection({ defaultOpen: false });
      const toggle = screen.getByRole('button', {
        name: /betala och koppla bankkonto/i,
      });
      await userEvent.click(toggle);
      expect(screen.getByRole('region')).toBeVisible();
    });

    it('fires onStartMobileBankId callback when primary button is clicked', async () => {
      const handleStart = jest.fn();
      renderSection({ onStartMobileBankId: handleStart });
      await userEvent.click(screen.getByRole('button', { name: /start mobile bankid/i }));
      expect(handleStart).toHaveBeenCalledTimes(1);
    });

    it('fires onOtherDevice callback when secondary button is clicked', async () => {
      const handleOther = jest.fn();
      renderSection({ onOtherDevice: handleOther });
      await userEvent.click(
        screen.getByRole('button', { name: /mobile bankid on other device/i })
      );
      expect(handleOther).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('toggle button references the panel via aria-controls', () => {
      renderSection();
      const toggle = screen.getByRole('button', {
        name: /betala och koppla bankkonto/i,
      });
      const panelId = toggle.getAttribute('aria-controls')!;
      const panel = document.getElementById(panelId);
      expect(panel).toHaveAttribute('role', 'region');
    });

    it('panel is labelled by the toggle button', () => {
      renderSection();
      const toggle = screen.getByRole('button', {
        name: /betala och koppla bankkonto/i,
      });
      const panel = screen.getByRole('region');
      expect(panel.getAttribute('aria-labelledby')).toBe(toggle.id);
    });

    it('all interactive elements inside the panel are reachable via keyboard', async () => {
      renderSection();
      // 1 — accordion header toggle
      await userEvent.tab();
      expect(
        screen.getByRole('button', { name: /betala och koppla bankkonto/i })
      ).toHaveFocus();
      // 2 — "Läs mer" link comes before the CTA buttons in DOM order
      await userEvent.tab();
      expect(screen.getByRole('link', { name: /läs mer/i })).toHaveFocus();
      // 3 — primary CTA button
      await userEvent.tab();
      expect(
        screen.getByRole('button', { name: /start mobile bankid/i })
      ).toHaveFocus();
      // 4 — secondary CTA button
      await userEvent.tab();
      expect(
        screen.getByRole('button', { name: /mobile bankid on other device/i })
      ).toHaveFocus();
    });

    it('benefits list has an accessible label', () => {
      renderSection();
      const panel = screen.getByRole('region');
      expect(within(panel).getByRole('list', { name: /benefits/i })).toBeInTheDocument();
    });
  });
});
