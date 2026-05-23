import { cn } from "../../../../../lib/cn";
import { useAccordion } from "./AccordionContext";
import type { AccordionTriggerProps } from "./Accordion.types";

export function AccordionTrigger({
  children,
  className,
  icon,
}: AccordionTriggerProps) {
  const { isOpen, setIsOpen, headerId, panelId } = useAccordion();

  return (
    <h3 className="m-0">
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between px-5 py-4",
          "rounded-2xl text-left font-semibold text-gray-900 text-base",
          "transition-colors duration-150 motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900",
          className,
        )}
      >
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "ml-3 flex h-8 w-8 shrink-0 items-center justify-center",
            "rounded-full border border-gray-200",
            "transition-transform duration-200 motion-reduce:transition-none cursor-pointer",
            isOpen ? "rotate-0" : "rotate-180",
          )}
        >
          {icon}
        </span>
      </button>
    </h3>
  );
}
