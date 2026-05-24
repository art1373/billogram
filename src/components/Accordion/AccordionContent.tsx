import { cn } from "../../lib/cn";
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
      className="[transition:grid-template-rows_250ms_cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
      }}
    >
      <div className="overflow-hidden">
        <div className={cn("px-5 pb-5", className)}>{children}</div>
      </div>
    </div>
  );
}
