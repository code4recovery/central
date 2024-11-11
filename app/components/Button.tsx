import {
  ArchiveBoxXMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlusCircleIcon as PlusCircleIconSolid } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";

import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { Spinner } from "~/icons";

export type Icon =
  | "archive"
  | "delete"
  | "duplicate"
  | "external"
  | "plus-circle"
  | "plus-circle-solid"
  | "spinner";

export function Button({
  children,
  className,
  icon,
  onClick,
  theme,
  url,
}: {
  children?: React.ReactNode;
  className?: string;
  icon?: Icon;
  onClick?: () => void;
  theme?: "primary" | "secondary";
  url?: string;
}) {
  const {
    theme: { background, backgroundHover, border, focusOutline, text },
  } = useUser();

  function renderIcon(icon?: Icon) {
    switch (icon) {
      case "archive":
        return <ArchiveBoxXMarkIcon className={iconClass} />;
      case "delete":
        return <XMarkIcon className={iconClass} />;
      case "duplicate":
        return <DocumentDuplicateIcon className={iconClass} />;
      case "external":
        return <ArrowTopRightOnSquareIcon className={iconClass} />;
      case "plus-circle":
        return <PlusCircleIcon className={iconClass} />;
      case "plus-circle-solid":
        return <PlusCircleIconSolid className={iconClass} />;
      case "spinner":
        return (
          <Spinner
            className={cx(
              {
                "fill-neutral-200 dark:fill-neutral-900": theme === "secondary",
                "fill-neutral-300 dark:fill-neutral-700": theme === "primary",
              },
              iconClass
            )}
          />
        );
    }
    return null;
  }

  const buttonClass = cx(
    {
      "border flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-semibold gap-2 items-center justify-center px-4 py-2 rounded-md shadow-sm text-center text-sm":
        !!theme,
      "text-white dark:text-black disabled:text-neutral-500 disabled:bg-neutral-300 disabled:border-neutral-300 dark:disabled:bg-neutral-700 dark:disabled:border-neutral-700":
        theme === "primary",
      "opacity-80 hover:opacity-100 disabled:opacity-50 disabled:hover:opacity-50 border":
        theme === "secondary",
      [background]: theme === "primary",
      [backgroundHover]: theme === "primary",
      [text]: theme === "secondary",
      [border]: !!theme,
      [focusOutline]: !!theme,
    },
    className
  );

  const iconClass = "w-5 h-5";

  const external = url?.startsWith("https://");

  return onClick ? (
    <button className={buttonClass} onClick={onClick} type="button">
      {renderIcon(icon)}
      {children}
    </button>
  ) : url ? (
    <Link
      className={buttonClass}
      target={external ? "_blank" : undefined}
      to={url}
    >
      {renderIcon(icon)}
      {children}
    </Link>
  ) : (
    <button className={buttonClass} disabled={icon === "spinner"}>
      {renderIcon(icon)}
      {children}
    </button>
  );
}
