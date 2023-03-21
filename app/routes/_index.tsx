import { redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { config } from "~/helpers";
import { strings } from "~/i18n";

export async function action() {
  return redirect(config.home);
}

export const meta: MetaFunction = () => ({
  title: strings.sign_in_title,
});

export default function Index() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {strings.sign_in_title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form className="space-y-6" method="post">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {strings.settings_user_email}
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  // required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {strings.sign_in_submit}
            </button>
          </Form>
        </div>
        <p className="mt-8 text-center text-sm">
          <a
            href={config.aboutUrl}
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 underline"
          >
            {strings.about}
          </a>
        </p>
      </div>
    </div>
  );
}
