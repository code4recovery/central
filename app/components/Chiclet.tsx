import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";

export function Chiclet({ children }: { children: React.ReactNode }) {
  const {
    theme: { background, border },
  } = useUser();
  return (
    <span
      className={cx(
        "px-2 rounded text-sm bg-opacity-20 dark:bg-opacity-20 border border-opacity-20",
        background,
        border
      )}
    >
      {children}
    </span>
  );
}
