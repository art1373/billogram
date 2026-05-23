import { useState, useId } from "react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../../../../lib/cn";
import type { AccordionProps } from "./Accordion.types";

export function Accordion({
  title,
  defaultOpen = false,
  children,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uid = useId();
  const headerId = `${uid}-header`;
  const panelId = `${uid}-panel`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
    >
      <h3 className="m-0">
        <button
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between px-5 py-4",
            "rounded-2xl text-left font-semibold text-gray-900 text-base",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900",
          )}
        >
          {title}
          <span
            aria-hidden="true"
            className={cn(
              "ml-3 flex h-8 w-8 shrink-0 items-center justify-center",
              "rounded-full border border-gray-200",
              "transition-transform duration-200 cursor-pointer",
              isOpen ? "rotate-0" : "rotate-180",
            )}
          >
            <ChevronUp size={16} strokeWidth={2} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
