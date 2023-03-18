import { Link } from "@remix-run/react";
import { config, formatClasses as cx } from "~/helpers";

export function Button({
  label,
  onClick,
  url,
}: {
  label: string;
  onClick?: () => void;
  url?: string;
}) {
  const className = cx(
    "block rounded-md py-2 px-3 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    config.colors[config.color as keyof typeof config.colors].background,
    config.colors[config.color as keyof typeof config.colors].focusOutline,
    config.colors[config.color as keyof typeof config.colors].backgroundHover
  );

  return onClick ? (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  ) : url ? (
    <Link className={className} to={url}>
      {label}
    </Link>
  ) : (
    <button className={className} type="submit">
      {label}
    </button>
  );
}
