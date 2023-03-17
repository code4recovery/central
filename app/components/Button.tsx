import { Link } from "@remix-run/react";

export function Button({ label, url }: { label: string; url: string }) {
  return (
    <Link
      type="button"
      to={url}
      className="block rounded-md bg-blue-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {label}
    </Link>
  );
}
