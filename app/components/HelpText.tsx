export function HelpText({
  error,
  helpText,
}: {
  error?: string;
  helpText?: string;
}) {
  if (!helpText && !error) return null;
  return (
    <p className="mt-2 text-sm">
      {helpText && <span className="text-gray-500">{helpText}</span>}
      {helpText && error && <span className="mx-2 text-gray-300">•</span>}
      {error && <span className="text-red-500">{error}</span>}
    </p>
  );
}
