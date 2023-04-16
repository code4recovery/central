import { Alert } from "./Alert";
import type { Alert as AlertType } from "~/types";

export function Alerts({ data }: { data: AlertType }) {
  const alertTypes: Array<keyof typeof data> = [
    "warning",
    "error",
    "info",
    "success",
  ];
  return (
    <>
      {alertTypes.map(
        (type) =>
          data[type] && (
            <Alert key={type} type={type} message={data[type] as string} />
          )
      )}
    </>
  );
}
