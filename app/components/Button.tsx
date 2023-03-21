import { Link } from "@remix-run/react";
import { formatClasses as cx } from "~/helpers";
import { getAccount } from "~/data";

export function Button({
  className,
  label,
  onClick,
  url,
}: {
  className?: string;
  label: string;
  onClick?: () => void;
  url?: string;
}) {
  const {
    theme: { background, focusOutline, backgroundHover },
  } = getAccount();

  const buttonClass = cx(
    "block rounded-md py-2 px-3 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    background,
    backgroundHover,
    className,
    focusOutline
  );

  return onClick ? (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  ) : url ? (
    <Link className={buttonClass} to={url}>
      {label}
    </Link>
  ) : (
    <button className={buttonClass} type="submit">
      {label}
    </button>
  );
}
