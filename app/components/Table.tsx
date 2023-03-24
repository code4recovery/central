import { Fragment } from "react";
import { Link } from "@remix-run/react";

import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";

type Row = {
  id: string;
  link?: string;
  [index: string]: string | number | string[] | undefined | null;
};

export function Table({
  columns,
  rows,
}: {
  columns: {
    [index: string]: {
      label: string;
      align?: "left" | "center" | "right";
    };
  };
  rows: Row[];
}) {
  const keys = Object.keys(columns);
  const {
    theme: { text, background, border },
  } = useUser();

  const showValue = (key: keyof Row, row: Row) => {
    const value = row[key] as string;
    if (key === "types" && value) {
      return (
        <div className="flex gap-1">
          {value.split(",").map((type) => (
            <span
              className={cx(
                "px-1 rounded text-xs bg-opacity-10 border border-opacity-20",
                background,
                border
              )}
              key={type}
            >
              {strings.types[type as keyof typeof strings.types] ??
                strings.language_types[
                  type as keyof typeof strings.language_types
                ]}
            </span>
          ))}
        </div>
      );
    }
    return row[key];
  };

  return (
    <table className="min-w-full divide-y divide-gray-400 text-left text-sm">
      <thead>
        <tr>
          {keys.slice(0, 4).map((key, index) => (
            <th
              key={key}
              scope="col"
              className={cx("p-3 font-semibold text-gray-900", {
                "hidden lg:table-cell": index === 1,
                "hidden sm:table-cell": index === 2,
                "text-center": columns[key].align === "center",
                "text-right": columns[key].align === "right",
              })}
            >
              {columns[key].label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300 text-gray-700">
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="w-full max-w-0 p-3 font-medium sm:w-auto sm:max-w-none">
              {row.link ? (
                <Link to={row.link} className={cx(text, "underline")}>
                  {showValue(keys[0], row)}
                </Link>
              ) : (
                row[keys[0]]
              )}
              <dl className="font-normal lg:hidden">
                {keys.slice(1, 3).map(
                  (key, index) =>
                    !!row[key] && (
                      <Fragment key={key}>
                        <dt className="sr-only">{columns[key].label}</dt>
                        <dd
                          className={cx("mt-1 truncate", {
                            "sm:hidden": index === 1,
                          })}
                        >
                          {showValue(key, row)}
                        </dd>
                      </Fragment>
                    )
                )}
              </dl>
            </td>
            {keys.slice(1, 4).map((key, index) => (
              <td
                key={key}
                className={cx("p-3", {
                  "hidden lg:table-cell": index === 0,
                  "hidden sm:table-cell": index === 1,
                  "text-center": columns[key].align === "center",
                  "text-right": columns[key].align === "right",
                })}
              >
                {showValue(key, row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
