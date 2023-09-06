export function Message({
  data,
  heading,
  text,
}: {
  data?: string;
  heading: string;
  text: string;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center grid gap-y-6 p-4 max-w-4xl">
        <h1 className="font-bold text-4xl">{heading}</h1>
        <p>{text}</p>
        {data && (
          <pre className="max-w-full text-left overflow-scroll">{data}</pre>
        )}
      </div>
    </div>
  );
}
