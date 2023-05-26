import {
  ArchiveBoxXMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { Spinner } from "~/icons";

type Icon = "archive" | "duplicate" | "external" | "spinner";

export function Button({
  children,
  className,
  icon,
  onClick,
  secondary = false,
  url,
}: {
  children: React.ReactNode;
  className?: string;
  icon?: Icon;
  onClick?: () => void;
  secondary?: boolean;
  url?: string;
}) {
  const {
    theme: { background, backgroundHover, border, focusOutline, text },
  } = useUser();

  function renderIcon(icon?: Icon) {
    switch (icon) {
      case "archive":
        return <ArchiveBoxXMarkIcon className={iconClass} />;
      case "duplicate":
        return <DocumentDuplicateIcon className={iconClass} />;
      case "external":
        return <ArrowTopRightOnSquareIcon className={iconClass} />;
      case "spinner":
        return (
          <Spinner
            className={cx(
              secondary
                ? "fill-neutral-200 dark:fill-neutral-900"
                : "fill-neutral-300 dark:fill-neutral-700",
              iconClass
            )}
          />
        );
    }
    return null;
  }

  const buttonClass = cx(
    "border flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-semibold",
    "gap-2 group items-center justify-center px-4 py-2 rounded-md shadow-sm text-center text-sm",
    {
      "text-white dark:text-black disabled:text-neutral-500 disabled:bg-neutral-300 disabled:border-neutral-300 dark:disabled:bg-neutral-700 dark:disabled:border-neutral-700":
        !secondary,
    },
    {
      "opacity-80 hover:opacity-100 disabled:opacity-50 disabled:hover:opacity-50 border":
        secondary,
    },
    { [background]: !secondary },
    { [backgroundHover]: !secondary },
    { [text]: secondary },
    border,
    focusOutline,
    className
  );

  const iconClass = "w-5 h-5";

  const external = url?.startsWith("https://");

  return onClick ? (
    <button className={buttonClass} onClick={onClick}>
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
