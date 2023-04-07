import { Fragment } from "react";
import { Link } from "@remix-run/react";

import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";

import { Chiclet } from "./Chiclet";

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
    theme: { text },
  } = useUser();

  if (!rows.length) return null;

  const showValue = (key: keyof Row, row: Row) => {
    const value = row[key] as string;
    if (key === "types" && value) {
      return (
        <div className="flex gap-1 flex-wrap">
          {value.split(",").map((type) => (
            <Chiclet key={type}>
              {strings.types[type as keyof typeof strings.types] ??
                strings.languages[type as keyof typeof strings.languages]}
            </Chiclet>
          ))}
        </div>
      );
    }
    return row[key];
  };

  return (
    <table className="min-w-full divide-y divide-gray-400 text-left text-sm table-fixed">
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
        {rows.map((row) => {
          const stack = (
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
          );
          return (
            <tr
              key={row.id}
              className={cx({
                "hover:bg-gray-100 hover:bg-opacity-50 cursor-pointer":
                  !!row.link,
              })}
            >
              <td className="w-2/5 max-w-0 font-medium sm:w-auto sm:max-w-none">
                {row.link ? (
                  <Link to={row.link} className="block p-3">
                    <div className={cx(text, "underline")}>
                      {showValue(keys[0], row)}
                    </div>
                    {stack}
                  </Link>
                ) : (
                  <div className="p-3">
                    {row[keys[0]]}
                    {stack}
                  </div>
                )}
              </td>
              {keys.slice(1, 4).map((key, index) => (
                <td
                  key={key}
                  className={cx({
                    "hidden lg:table-cell w-1/5": index === 0,
                    "hidden sm:table-cell w-1/4": index === 1,
                    "w-1/5": index === 2,
                    "text-center": columns[key].align === "center",
                    "text-right": columns[key].align === "right",
                  })}
                >
                  {!!row.link ? (
                    <Link to={row.link} className="block p-3">
                      {showValue(key, row)}
                    </Link>
                  ) : (
                    <div className="p-3">{showValue(key, row)}</div>
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
