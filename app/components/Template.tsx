import { Footer, Header } from "~/components";

export function Template({
  title,
  description,
  cta,
  children,
}: {
  title?: string;
  description?: string;
  cta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow w-full">
        {title && (
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="font-semibold leading-6 text-gray-900 text-2xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-gray-700">{description}</p>
              )}
            </div>
            {cta && (
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">{cta}</div>
            )}
          </div>
        )}
        {children && (
          <div className="-mx-4 my-8 mb-16 sm:-mx-0 space-y-8">{children}</div>
        )}
      </main>
      <Footer />
    </>
  );
}
