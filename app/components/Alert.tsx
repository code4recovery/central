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
  type: "warning" | "success" | "info" | "danger";
}) {
  const iconProps = { "aria-hidden": true, className: "w-6" };
  return (
    <div
      className={cx(
        "border-l-4 flex gap-3 p-4 rounded-none md:rounded shadow",
        {
          "bg-red-50 border-red-400 text-red-700": type === "danger",
          "bg-blue-50 border-blue-400 text-blue-700": type === "info",
          "bg-green-50 border-green-400 text-green-700": type === "success",
          "bg-yellow-50 border-yellow-400 text-yellow-700": type === "warning",
        }
      )}
    >
      {type === "danger" && <XCircleIcon {...iconProps} />}
      {type === "info" && <InformationCircleIcon {...iconProps} />}
      {type === "success" && <CheckCircleIcon {...iconProps} />}
      {type === "warning" && <ExclamationTriangleIcon {...iconProps} />}
      <p className="flex-grow-0">{message}</p>
    </div>
  );
}
