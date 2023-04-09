import { Fragment } from "react";
import { Link } from "@remix-run/react";

import { Footer, Header } from "~/components";
import { formatClasses as cx } from "~/helpers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useUser } from "~/hooks";

export function Template({
  title,
  description,
  cta,
  children,
  breadcrumbs,
}: {
  title?: string;
  description?: string;
  cta?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: string[][];
}) {
  const {
    theme: { text },
  } = useUser();
  return (
    <>
      <Header />
      <main className="mt-8 px-4 sm:px-6 xl:px-12 flex-grow w-full">
        {title && (
          <div className="sm:flex">
            <div className="sm:flex-auto sm:pt-2">
              <h1 className="font-semibold leading-6 text-2xl">
                <div className="flex gap-2 items-center">
                  {breadcrumbs?.map(([url, label]) => (
                    <Fragment key={url}>
                      <Link to={url} className={cx("underline", text)}>
                        {label}
                      </Link>
                      <ChevronRightIcon className="text-neutral-500 h-6 w-6" />
                    </Fragment>
                  ))}
                  <span>{title}</span>
                </div>
              </h1>
              {description && (
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {description}
                </p>
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
