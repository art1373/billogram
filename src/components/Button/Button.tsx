import { cn } from "../../lib/cn";
import type { ButtonProps, ButtonVariant } from "./Button.types";

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
};

export function Button({
  variant = "primary",
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("btn", variantClass[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
