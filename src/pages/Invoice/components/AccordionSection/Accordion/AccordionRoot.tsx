import { useState, useId } from "react";
import { cn } from "../../../../../lib/cn";
import { AccordionContext } from "./AccordionContext";
import type { AccordionProps } from "./Accordion.types";

export function AccordionRoot({ defaultOpen = false, children, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uid = useId();
  const headerId = `${uid}-header`;
  const panelId = `${uid}-panel`;

  return (
    <AccordionContext.Provider value={{ isOpen, setIsOpen, headerId, panelId }}>
      <div className={cn("rounded-2xl border border-gray-100 bg-white shadow-sm", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
