export function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className="block text-sm font-medium leading-6 mb-1.5 text-gray-900"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
