import type { ReactNode, Dispatch, SetStateAction } from "react";

export interface AccordionContextValue {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  headerId: string;
  panelId: string;
}

export interface AccordionProps {
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export interface AccordionTriggerProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}
