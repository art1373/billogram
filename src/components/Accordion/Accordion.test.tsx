import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

const renderAccordion = (props?: Partial<React.ComponentProps<typeof Accordion>>) =>
  render(
    <Accordion title="Test Title" {...props}>
      <p>Panel content</p>
    </Accordion>
  );

describe('Accordion', () => {
  describe('rendering', () => {
    it('renders the title', () => {
      renderAccordion();
      expect(screen.getByRole('button', { name: /test title/i })).toBeInTheDocument();
    });

    it('wraps the trigger in a heading element', () => {
      renderAccordion();
      const heading = screen.getByRole('heading');
      expect(within(heading).getByRole('button')).toBeInTheDocument();
    });

    it('hides the panel by default', () => {
      renderAccordion();
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('shows the panel when defaultOpen is true', () => {
      renderAccordion({ defaultOpen: true });
      expect(screen.getByRole('region')).toBeVisible();
      expect(screen.getByText('Panel content')).toBeVisible();
    });
  });

  describe('WAI-ARIA attributes', () => {
    it('sets aria-expanded="false" when closed', () => {
      renderAccordion();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded="true" when open', () => {
      renderAccordion({ defaultOpen: true });
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('connects button to panel via aria-controls / id', () => {
      renderAccordion({ defaultOpen: true });
      const button = screen.getByRole('button');
      const panelId = button.getAttribute('aria-controls')!;
      expect(document.getElementById(panelId)).toBe(screen.getByRole('region'));
    });

    it('connects panel to button via aria-labelledby / id', () => {
      renderAccordion({ defaultOpen: true });
      const button = screen.getByRole('button');
      const panel = screen.getByRole('region');
      expect(panel.getAttribute('aria-labelledby')).toBe(button.id);
    });

    it('panel has role="region"', () => {
      renderAccordion({ defaultOpen: true });
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('opens when the header button is clicked', async () => {
      renderAccordion();
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('region')).toBeVisible();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes when the header button is clicked again', async () => {
      renderAccordion({ defaultOpen: true });
      await userEvent.click(screen.getByRole('button'));
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles open/close on repeated clicks', async () => {
      renderAccordion();
      const btn = screen.getByRole('button');
      await userEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('keyboard accessibility', () => {
    it('is focusable via Tab', async () => {
      renderAccordion();
      await userEvent.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('opens on Enter key', async () => {
      renderAccordion();
      screen.getByRole('button').focus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('region')).toBeVisible();
    });

    it('opens on Space key', async () => {
      renderAccordion();
      screen.getByRole('button').focus();
      await userEvent.keyboard(' ');
      expect(screen.getByRole('region')).toBeVisible();
    });
  });

  describe('children', () => {
    it('renders children inside the panel when open', () => {
      renderAccordion({ defaultOpen: true });
      expect(screen.getByText('Panel content')).toBeInTheDocument();
    });

    it('does not render children when closed', () => {
      renderAccordion();
      // queryByRole respects the hidden attribute — returns null when panel is hidden
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });
});
