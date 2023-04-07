import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useSearchParams } from "@remix-run/react";

import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultAccountLogo as Logo } from "~/icons";

export function Header() {
  const {
    currentAccountID,
    email,
    emailHash,
    id,
    isAdmin,
    name,
    theme: { text, focusRing, border },
  } = useUser();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const navItems = {
    primary: [
      ["/meetings", strings.meetings.title],
      ["/activity", strings.activity.title],
      ["/reports", strings.reports.title],
    ],
    secondary: [
      isAdmin
        ? [
            [`/accounts/${currentAccountID}`, strings.account.title],
            ["/users", strings.users.title],
          ]
        : [[`/users/${id}`, strings.users.edit_profile]],
      [["/auth/out", strings.auth.out]],
    ],
  };

  const avatarUrl = `https://gravatar.com/avatar/${emailHash}`;

  return (
    <header>
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <Link
                      to={config.home}
                      className={cx(
                        "focus-visible:ring-2 outline-none w-auto",
                        focusRing
                      )}
                    >
                      <Logo className={cx("h-9 w-auto", text)} />
                    </Link>
                  </div>
                  <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                    {navItems.primary.map(([url, label]) => (
                      <NavLink
                        key={url}
                        to={url}
                        reloadDocument={url === "/meetings" && !!search}
                        className={({ isActive }) =>
                          cx(
                            {
                              "text-gray-900": isActive,
                              [border]: isActive,
                              "border-transparent": !isActive,
                            },
                            "border-b-2 focus-visible:ring-2 font-medium inline-flex items-center outline-none pt-1 px-1 text-sm",
                            focusRing
                          )
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center px-2 lg:px-0 lg:ml-6 lg:justify-end">
                  <form
                    action="/meetings"
                    className="w-full max-w-lg lg:max-w-xs"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      if (!formData.get("search")?.toString()) {
                        location.assign("/meetings");
                      } else {
                        form.submit();
                      }
                    }}
                  >
                    <label htmlFor="search" className="sr-only">
                      {strings.meetings.search}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-400"
                        />
                      </div>
                      <input
                        autoComplete="off"
                        className={cx(
                          "block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                          focusRing
                        )}
                        defaultValue={search}
                        id="search"
                        name="search"
                        placeholder={strings.meetings.search}
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="flex items-center lg:hidden">
                  <Disclosure.Button
                    className={cx(
                      "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset",
                      focusRing
                    )}
                  >
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:items-center">
                  <Menu as="div" className="relative flex-shrink-0">
                    <Menu.Button
                      className={cx(
                        "flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
                        focusRing
                      )}
                    >
                      <img
                        className="h-8 w-8 rounded-full"
                        src={avatarUrl}
                        alt={name}
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-gray-200 divide-y">
                        {navItems.secondary.map((group, index) => (
                          <div key={index} className="py-1">
                            {group.map(([url, label]) => (
                              <Menu.Item key={url}>
                                {({ active }) => (
                                  <NavLink
                                    to={url}
                                    className={cx(
                                      {
                                        "bg-gray-100": active,
                                      },
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {label}
                                  </NavLink>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navItems.primary.map(([url, label]) => (
                  <NavLink
                    key={url}
                    to={url}
                    className={({ isActive }) =>
                      cx(
                        {
                          [border]: isActive,
                          "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800":
                            !isActive,
                        },
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                        text
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={avatarUrl}
                      alt={name}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 divide-gray-200 divide-y">
                  {navItems.secondary.map((group, index) => (
                    <div key={index} className="py-1">
                      {group.map(([url, label]) => (
                        <NavLink
                          key={url}
                          to={url}
                          className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </header>
  );
}
