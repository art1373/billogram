import type { ReactNode } from "react";

export interface InfoItemProps {
  icon: ReactNode;
  text: string;
  link?: { href: string; label: string };
}
