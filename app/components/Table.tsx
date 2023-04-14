import { Fragment } from "react";
import { Link } from "@remix-run/react";

import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";

import { Chiclet } from "./Chiclet";

type Value = React.ReactNode | string[] | undefined | null;

type Row = {
  id: string;
  link?: string;
  [index: string]: Value;
};

export function Table({
  className,
  columns,
  rows,
}: {
  className?: string;
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

  const showValue = (value: Value) =>
    Array.isArray(value) ? (
      <div className="flex gap-1 flex-wrap">
        {value.map((type) => (
          <Chiclet key={type}>
            {strings.types[type as keyof typeof strings.types] ??
              strings.languages[type as keyof typeof strings.languages]}
          </Chiclet>
        ))}
      </div>
    ) : (
      value
    );

  return (
    <table
      className={cx(
        "min-w-full divide-y divide-neutral-500 text-left text-sm table-fixed",
        className
      )}
    >
      <thead>
        <tr>
          {keys.slice(0, 4).map((key, index) => (
            <th
              key={key}
              scope="col"
              className={cx("p-3 font-semibold", {
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
      <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700 text-neutral-700 dark:text-neutral-300">
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
                        {showValue(row[key])}
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
                "hover:bg-neutral-100 dark:hover:bg-neutral-950 hover:bg-opacity-50 cursor-pointer":
                  !!row.link,
              })}
            >
              <td className="w-2/5 max-w-0 font-medium sm:w-auto sm:max-w-none">
                {row.link ? (
                  <Link to={row.link} className="block p-3">
                    <div className={cx(text, "underline")}>
                      {showValue(row[keys[0]])}
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
                  {row.link ? (
                    <Link to={row.link} className="block p-3">
                      {showValue(row[key])}
                    </Link>
                  ) : (
                    <div className="p-3">{showValue(row[key])}</div>
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
