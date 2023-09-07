import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { formatClasses as cx } from "~/helpers";

export function Alert({
  message,
  type = "warning",
}: {
  message: string;
  type: "warning" | "success" | "info" | "error";
}) {
  const iconProps = { "aria-hidden": true, className: "w-6 h-6 flex-shrink-0" };
  return (
    <div
      className={cx(
        "border-l-4 flex gap-3 p-4 rounded-none md:rounded shadow text-left",
        {
          "bg-red-50 dark:bg-red-950 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300":
            type === "error",
          "bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300":
            type === "info",
          "bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300":
            type === "success",
          "bg-yellow-50 dark:bg-yellow-950 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300":
            type === "warning",
        }
      )}
    >
      {type === "error" && <XCircleIcon {...iconProps} />}
      {type === "info" && <InformationCircleIcon {...iconProps} />}
      {type === "success" && <CheckCircleIcon {...iconProps} />}
      {type === "warning" && <ExclamationTriangleIcon {...iconProps} />}
      <p>{message}</p>
    </div>
  );
}
