export function DescriptionList({
  terms,
}: {
  terms: Array<{ term: string; definition: string }>;
}) {
  return (
    <dl className="divide-y divide-white/10">
      {terms.map(({ term, definition }, i) => (
        <div key={i} className="p-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium leading-6">{term}</dt>
          <dd className="mt-1 leading-6 sm:col-span-3 sm:mt-0">{definition}</dd>
        </div>
      ))}
    </dl>
  );
}
