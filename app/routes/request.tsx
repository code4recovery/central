const classes = {
  input:
    "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-600 rounded w-full sm:text-sm sm:leading-6",
  help: "text-sm text-neutral-500",
  label: "block text-sm font-medium leading-6",
};

export default function Request() {
  return (
    <form className="p-5 xl:pt-8 max-w-5xl w-full mx-auto">
      <legend className="font-bold text-xl">
        New Meeting / Change Request Form
      </legend>

      <Fieldset
        title="Hi there 👋"
        description="Please start by idenitifying yourself. These details will be kept confidential."
      >
        <Field
          label="Your Email Address"
          name="email"
          help="We will send you an email to confirm."
        >
          <input
            type="email"
            name="email"
            id="email"
            className={classes.input}
            placeholder="you@email.com"
            autoFocus
          />
        </Field>
        <Field
          label="Your Name"
          name="your_name"
          help="It's ok to use a last initial. Should be recognizable to other members of the group. They will be notified of updates."
        >
          <input
            type="text"
            name="your_name"
            id="your_name"
            className={classes.input}
          />
        </Field>
      </Fieldset>

      <Fieldset
        title="Group info 🤝"
        description="Now tell us about your group. This information will be included in each meeting listing."
      >
        <Field label="Group name" name="group">
          <input
            type="text"
            name="group"
            id="group"
            className={classes.input}
          />
        </Field>
        <Field
          label="Group website"
          name="website"
          help="Optional link to your group website. If your group does not have a website, please leave this section blank."
        >
          <input
            type="url"
            placeholder="https://"
            name="website"
            id="website"
            className={classes.input}
          />
        </Field>
        <Field
          label="Group notes"
          name="group_notes"
          help="This should be general information about the group and not make reference to individual meetings (that will come next)."
        >
          <textarea
            name="group_notes"
            id="group_notes"
            rows={5}
            className={classes.input}
          />
        </Field>
      </Fieldset>

      <Fieldset
        title="Meetings 🪑"
        description="Now tell us about your meetings."
      >
        <Field label="Meeting name" name="group">
          <input type="text" name="name" id="name" className={classes.input} />
        </Field>
        <Field name="time" help="Leave these blank if the meeting is ongoing">
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <label className={classes.label}>Start Time</label>
              <input
                type="time"
                name="time"
                id="time"
                className={classes.input}
              />
            </div>
            <div className="grid gap-2">
              <label className={classes.label}>End Time</label>
              <input
                type="time"
                name="end_time"
                id="end_time"
                className={classes.input}
              />
            </div>
            <div className="grid gap-2">
              <label className={classes.label}>Timezone</label>
              <select name="timezone" id="timezone" className={classes.input}>
                <option>Time</option>
              </select>
            </div>
          </div>
        </Field>
        <Field label="Day(s) of the week" name="group">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="checkbox" className="rounded" />
                <span>{day}</span>
              </div>
            ))}
          </div>
        </Field>
        <Field
          label="Meeting notes"
          name="notes"
          help="No need to mention the meeting time here."
        >
          <textarea
            name="notes"
            id="notes"
            rows={5}
            className={classes.input}
          />
        </Field>
      </Fieldset>

      <div className="flex justify-center p-8">
        <input
          type="submit"
          value="Submit"
          className="bg-indigo-500 rounded-md px-5 py-2 text-neutral-900 text-lg"
          disabled
        />
      </div>
    </form>
  );
}

function Field({
  children,
  label,
  name,
  help,
}: {
  children: React.ReactNode;
  label?: string;
  name: string;
  help?: string;
}) {
  return (
    <div className="grid gap-y-2">
      {label && (
        <label htmlFor={name} className={classes.label}>
          {label}
        </label>
      )}
      {children}
      {help && <p className={classes.help}>{help}</p>}
    </div>
  );
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
    <fieldset className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-neutral-200 dark:border-neutral-800 py-12 md:grid-cols-5">
      <div className=" md:col-span-2">
        <h2 className="text-base font-semibold mb-2">{title}</h2>
        <p className={classes.help}>{description}</p>
      </div>
      <div className="grid gap-x-6 gap-y-8 md:col-span-3">{children}</div>
    </fieldset>
  );
}
