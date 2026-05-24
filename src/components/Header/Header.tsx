import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../lib/store/useTheme";
import { cn } from "../../lib/cn";

export function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b px-5",
        "bg-(--color-header-bg) border-(--color-header-border) backdrop-blur-[12px]",
      )}
    >
      <span className="text-base font-bold tracking-tight text-(--color-billogram) transition-colors duration-250">
        Billogram
      </span>

      <button
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "transition-colors duration-300 motion-reduce:transition-none",
          isDark
            ? "border-white/10 bg-slate-700 focus-visible:ring-slate-400 focus-visible:ring-offset-[#0f0f11]"
            : "border-black/10 bg-gray-200 focus-visible:ring-gray-500 focus-visible:ring-offset-white",
        )}
      >
        {/* sliding thumb */}
        <span
          className={cn(
            "absolute h-5.5 w-5.5 rounded-full bg-white shadow-md",
            "transition-transform duration-300 motion-reduce:transition-none",
            isDark ? "translate-x-6.5" : "translate-x-0.5",
          )}
        />

        {/* sun — visible in light mode */}
        <Sun
          size={11}
          strokeWidth={2.5}
          aria-hidden="true"
          className={cn(
            "absolute left-1.25 text-amber-500",
            "transition-opacity duration-200 motion-reduce:transition-none",
            isDark ? "opacity-0" : "opacity-100",
          )}
        />

        {/* moon — visible in dark mode */}
        <Moon
          size={11}
          strokeWidth={2.5}
          aria-hidden="true"
          className={cn(
            "absolute right-1.25 text-sky-300",
            "transition-opacity duration-200 motion-reduce:transition-none",
            isDark ? "opacity-100" : "opacity-0",
          )}
        />
      </button>
    </header>
  );
}
