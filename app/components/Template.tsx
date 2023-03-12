import MainNav from "./MainNav";

export default function Template({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNav />
      <div className="mt-7 px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-gray-700">{description}</p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add user
              </button>
            </div>
          </div>
        )}
        <div className="-mx-4 mt-8 sm:-mx-0">{children}</div>
      </div>
    </>
  );
}
