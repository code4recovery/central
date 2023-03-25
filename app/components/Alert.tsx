import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { formatClasses as cx } from "~/helpers";

export function Alert({
  type = "warning",
  alertText,
}: {
  type: "warning" | "success" | "info" | "danger";
  alertText: string;
}) {
  return (
    <div
      className={cx("border-l-4 p-4 shadow rounded-sm", {
        "bg-red-50 border-red-400 text-red-600": type === "danger",
        "bg-blue-50 border-blue-400 text-blue-600": type === "info",
        "bg-green-50 border-green-400 text-green-600": type === "success",
        "bg-yellow-50 border-yellow-400 text-yellow-600": type === "warning",
      })}
    >
      <div className="flex">
        <div className="flex-shrink-0 w-6">
          {type === "danger" && (
            <XCircleIcon aria-hidden="true" className="text-red-400" />
          )}
          {type === "info" && (
            <InformationCircleIcon
              aria-hidden="true"
              className="text-blue-400"
            />
          )}
          {type === "success" && (
            <CheckCircleIcon aria-hidden="true" className="text-green-400" />
          )}
          {type === "warning" && (
            <ExclamationTriangleIcon
              aria-hidden="true"
              className="text-yellow-400"
            />
          )}
        </div>
        <div className="ml-3">
          <p>{alertText}</p>
        </div>
      </div>
    </div>
  );
}
