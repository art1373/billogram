import type { ReactNode, Dispatch, SetStateAction } from "react";

export interface AccordionContextValue {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  headerId: string;
  panelId: string;
  isLoading: boolean;
}

export interface AccordionProps {
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  /** When true the trigger shows a spinner and cannot be toggled. */
  isLoading?: boolean;
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
