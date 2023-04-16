import {
  ArchiveBoxXMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { Spinner } from "~/icons";

type Icon = "archive" | "duplicate" | "external";

export function Button({
  children,
  className,
  disabled,
  icon,
  onClick,
  secondary = false,
  url,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
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
    }
    return null;
  }

  const buttonClass = cx(
    "flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-semibold",
    "gap-2 group items-center justify-center px-4 py-2 rounded-md shadow-sm text-center text-sm",
    "disabled:text-neutral-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-700",
    { "text-white dark:text-black": !secondary },
    { "opacity-80 hover:opacity-100 border": secondary },
    { [background]: !secondary },
    { [text]: secondary },
    { [border]: secondary },
    { [backgroundHover]: !secondary },
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
    <button className={buttonClass} disabled={disabled}>
      <Spinner
        className={cx(
          "hidden group-disabled:block text-neutral-200 dark:text-neutral-800 fill-neutral-500",
          iconClass
        )}
      />
      {children}
    </button>
  );
}
