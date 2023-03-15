import { Link } from "@remix-run/react";

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
  const headers = Object.keys(columns).slice(0, 4);
  return (
    <table className="min-w-full divide-y divide-gray-400 text-left text-sm">
      <thead>
        <tr>
          {headers.map((column, index) => (
            <th
              key={column}
              scope="col"
              className={cx("p-3 font-semibold text-gray-900", {
                "hidden lg:table-cell": index === 1,
                "hidden sm:table-cell": index === 2,
              })}
            >
              {columns[column].label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300 text-gray-700">
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="w-full max-w-0 p-3 font-medium sm:w-auto sm:max-w-none">
              <Link to={row.id} className="text-indigo-500 underline">
                {row[headers[0]]}
              </Link>
              <dl className="font-normal lg:hidden">
                {!!row[headers[1]] && (
                  <>
                    <dt className="sr-only">{columns[headers[1]].label}</dt>
                    <dd className="mt-1 truncate">{row[headers[1]]}</dd>
                  </>
                )}
                {!!row[headers[2]] && (
                  <>
                    <dt className="sr-only">{columns[headers[2]].label}</dt>
                    <dd className="mt-1 truncate sm:hidden">
                      {row[headers[2]]}
                    </dd>
                  </>
                )}
              </dl>
            </td>
            {!!row[headers[1]] && (
              <td className="hidden p-3 lg:table-cell">{row[headers[1]]}</td>
            )}
            {!!row[headers[2]] && (
              <td className="hidden p-3 sm:table-cell">{row[headers[2]]}</td>
            )}
            {!!row[headers[3]] && <td className="p-3">{row[headers[3]]}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
