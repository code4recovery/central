export default function Request() {
  return (
    <form className="p-5 xl:pt-8 max-w-7xl w-full mx-auto h-screen">
      <legend className="font-bold text-xl">
        New Meeting / Change Request Form
      </legend>

      <Fieldset
        title="Hi there 👋"
        description="Please start by idenitifying yourself. These details will be kept confidential."
      >
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-4">
            <Label htmlFor="website">Your Email Address</Label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="you@email.com"
                />
              </div>
              <ExtraInfo>We will send you an email to confirm.</ExtraInfo>
            </div>
          </div>

          {/* ... */}

          <div className="sm:col-span-4">
            <Label htmlFor="name">Your Name</Label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          {/* ... */}

          <div className="col-span-full">
            <Label htmlFor="about">About</Label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={3}
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ExtraInfo>Write a few sentences about yourself.</ExtraInfo>
          </div>

          {/* ... */}
        </div>
      </Fieldset>
    </form>
  );
}

function ExtraInfo({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-6 text-neutral-600">{children}</p>;
}

function Fieldset({
  children,
  title,
  description,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-neutral-300 dark:border-neutral-700 py-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      </div>
      {children}
    </fieldset>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium leading-6">
      {children}
    </label>
  );
}
