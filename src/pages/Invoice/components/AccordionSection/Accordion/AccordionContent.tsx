import { cn } from "../../../../../lib/cn";
import { useAccordion } from "./AccordionContext";
import type { AccordionContentProps } from "./Accordion.types";

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { isOpen, headerId, panelId } = useAccordion();

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={headerId}
      aria-hidden={!isOpen}
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="overflow-hidden">
        <div className={cn("px-5 pb-5", className)}>{children}</div>
      </div>
    </div>
  );
}
