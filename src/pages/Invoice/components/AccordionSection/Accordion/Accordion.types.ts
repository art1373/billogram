import type { ReactNode } from "react";

export interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}
