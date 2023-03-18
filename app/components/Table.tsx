import { Fragment } from "react";
import { Link } from "@remix-run/react";

import { getAccount } from "~/data";
import { formatClasses as cx } from "~/helpers";

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
  rows: {
    id: string;
    [index: string]: string | number | string[] | undefined;
  }[];
}) {
  const keys = Object.keys(columns);
  const {
    theme: { text },
  } = getAccount();
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
              <Link to={row.id} className={cx(text, "underline")}>
                {row[keys[0]]}
              </Link>
              <dl className="font-normal lg:hidden">
                {keys.slice(1, 3).map(
                  (key, index) =>
                    !!row[key] && (
                      <Fragment key={key}>
                        <dt className="sr-only">{columns[key].label}</dt>
                        <dd
                          className={cx("mt-1 truncate", {
                            "sm:hidden": index === 2,
                          })}
                        >
                          {row[key]}
                        </dd>
                      </Fragment>
                    )
                )}
              </dl>
            </td>
            {keys.slice(1, 4).map(
              (key, index) =>
                !!row[key] && (
                  <td
                    key={key}
                    className={cx("p-3", {
                      "hidden lg:table-cell": index === 0,
                      "hidden sm:table-cell": index === 1,
                      "text-center": columns[key].align === "center",
                      "text-right": columns[key].align === "right",
                    })}
                  >
                    {row[key]}
                  </td>
                )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
