import { useMemo } from "react";
import * as diff from "diff";
import { formatClasses as cx } from "~/helpers";

export function Diff({
  newValue,
  oldValue,
}: {
  newValue: string | null;
  oldValue: string | null;
}) {
  const newString = newValue === null ? "" : newValue;
  const oldString = oldValue === null ? "" : oldValue;
  const result = useMemo(
    () =>
      diff.diffChars(oldString, newString).map((part, index) => (
        <span
          key={index}
          className={cx("p-1", {
            "bg-green-400 dark:bg-green-800": !!part.added,
            "bg-red-800 dark:bg-red-800 line-through": !!part.removed,
          })}
        >
          {part.value}
        </span>
      )),
    [newString, oldString]
  );
  return <>{result}</>;
}
