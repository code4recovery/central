import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  CheckIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useSearchParams } from "@remix-run/react";

import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultAccountLogo as Logo } from "~/icons";
import { Avatar } from "./Avatar";

export function Header() {
  const {
    accounts,
    currentAccountID,
    emailHash,
    id,
    isAdmin,
    name,
    theme: { text, focusRing, border },
  } = useUser();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;

  type NavItem = {
    icon?: JSX.Element;
    label: string;
    reload?: boolean;
    url: string;
  };

  const navItems: { primary: NavItem[]; secondary: NavItem[][] } = {
    primary: [
      {
        url: "/groups",
        label: strings.group.title,
      },
      {
        url: "/activity",
        label: strings.activity.title,
      },
      { url: "/reports", label: strings.reports.title },
    ],
    secondary: [
      isAdmin
        ? [
            {
              url: `/accounts/${currentAccountID}`,
              label: strings.account.title,
              icon: <Cog6ToothIcon />,
            },
            {
              url: "/users",
              label: strings.users.title,
              icon: <UserGroupIcon />,
            },
          ]
        : [
            {
              url: `/users/${id}`,
              label: strings.users.edit_profile,
              icon: <UserIcon />,
            },
          ],
      accounts.length > 1
        ? accounts.map(({ id, name }) => ({
            url: `/accounts/switch/${id}`,
            label: name,
            icon: currentAccountID === id ? <CheckIcon /> : undefined,
            reload: true,
          }))
        : [],
      [
        {
          url: "/auth/out",
          label: strings.auth.out,
          icon: <ArrowLeftOnRectangleIcon />,
        },
      ],
    ],
  };

  return (
    <header>
      <Disclosure as="nav" className="bg-white dark:bg-neutral-950 shadow">
        {({ open }) => (
          <>
            <div className="px-2 sm:px-6 xl:px-12">
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
                    {navItems.primary.map(({ url, label }) => (
                      <NavLink
                        key={url}
                        to={url}
                        className={({ isActive }) =>
                          cx(
                            {
                              "text-black dark:text-white": isActive,
                              [border]: isActive,
                              "border-transparent hover:border-neutral-300 dark:hover:border-neutral-800":
                                !isActive,
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
                    action="/search"
                    className="w-full max-w-lg lg:max-w-xs"
                  >
                    <label htmlFor="search" className="sr-only">
                      {strings.search.placeholder}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-neutral-400 dark:text-neutral-600"
                        />
                      </div>
                      <input
                        autoComplete="off"
                        className={cx(
                          "block w-full rounded-md border-0 py-1.5 pl-10 pr-3 ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6",
                          "bg-transparent ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 dark:hover:bg-black",
                          focusRing
                        )}
                        defaultValue={search}
                        name="search"
                        placeholder={strings.search.placeholder}
                        required
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="flex items-center lg:hidden">
                  <Disclosure.Button
                    className={cx(
                      "inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset",
                      "text-neutral-400 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-500",
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
                        "flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
                        focusRing
                      )}
                    >
                      <Avatar emailHash={emailHash} name={name} size="md" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white dark:bg-black py-1 shadow-lg focus:outline-none divide-neutral-200 dark:divide-neutral-800 divide-y">
                        {navItems.secondary
                          .filter((e) => e.length)
                          .map((group, index) => (
                            <div key={index} className="py-1">
                              {group.map(({ url, label, icon, reload }) => (
                                <Menu.Item key={url}>
                                  {({ active }) => (
                                    <NavLink
                                      className={cx(
                                        {
                                          "bg-neutral-100 dark:bg-neutral-900":
                                            active,
                                        },
                                        "px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 flex gap-2 items-center"
                                      )}
                                      reloadDocument={reload}
                                      to={url}
                                    >
                                      <div className="w-4">{icon}</div>
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
                {navItems.primary.map(({ url, label }) => (
                  <NavLink
                    key={url}
                    to={url}
                    className={({ isActive }) =>
                      cx(
                        {
                          [border]: isActive,
                          "border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-200":
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
              <div className="border-t border-neutral-200 dark:border-neutral-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Avatar emailHash={emailHash} name={name} size="lg" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                      {name}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 divide-neutral-200 dark:divide-neutral-800 divide-y">
                  {navItems.secondary
                    .filter((e) => e.length)
                    .map((group, index) => (
                      <div key={index} className="py-1">
                        {group.map(({ url, label, icon, reload }) => (
                          <NavLink
                            className="flex gap-2 items-center px-4 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-800 dark:hover:text-neutral-200"
                            key={url}
                            reloadDocument={reload}
                            to={url}
                          >
                            <div className="w-4">{icon}</div>
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
