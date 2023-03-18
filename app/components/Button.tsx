import { Link } from "@remix-run/react";
import { formatClasses as cx } from "~/helpers";
import { getAccount } from "~/data";

export function Button({
  label,
  onClick,
  url,
}: {
  label: string;
  onClick?: () => void;
  url?: string;
}) {
  const {
    theme: { background, focusOutline, backgroundHover },
  } = getAccount();
  const className = cx(
    "block rounded-md py-2 px-3 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    background,
    focusOutline,
    backgroundHover
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
