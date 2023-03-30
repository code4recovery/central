import { Alert } from "./Alert";

export function Alerts({
  data,
}: {
  data: {
    warning?: string;
    error?: string;
    info?: string;
    success?: string;
  };
}) {
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
