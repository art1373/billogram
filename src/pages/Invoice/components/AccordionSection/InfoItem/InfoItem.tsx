import type { InfoItemProps } from "./InfoItem.types";

export function InfoItem({ icon, text, link }: InfoItemProps) {
  return (
    <li className="flex items-start gap-3 py-1">
      <span aria-hidden="true" className="mt-0.5 shrink-0">
        {icon}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {text}
        {link && (
          <>
            {" "}
            <a
              href={link.href}
              className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {link.label}
            </a>
          </>
        )}
      </span>
    </li>
  );
}
