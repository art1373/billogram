import { createContext, useContext } from "react";
import type { AccordionContextValue } from "./Accordion.types";

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion subcomponents must be used inside <Accordion>");
  return ctx;
}
