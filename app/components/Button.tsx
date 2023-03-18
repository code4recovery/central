import { Link } from "@remix-run/react";

export function Button({
  label,
  onClick,
  url,
}: {
  label: string;
  onClick?: () => void;
  url?: string;
}) {
  const props = {
    className:
      "block rounded-md bg-blue-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
  };

  return onClick && !url ? (
    <button {...props} onClick={onClick}>
      {label}
    </button>
  ) : url ? (
    <Link {...props} to={url}>
      {label}
    </Link>
  ) : null;
}
