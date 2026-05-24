import { AccordionRoot } from "./AccordionRoot";
import { AccordionTrigger } from "./AccordionTrigger";
import { AccordionContent } from "./AccordionContent";

export const Accordion = Object.assign(AccordionRoot, {
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
