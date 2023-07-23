import { useState } from "react";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import { formatClasses as cx, formatDate } from "~/helpers";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Form } from "./Form";
import { Collapse } from "./Collapse";

export function Panel({
  add,
  emptyText,
  title,
  rows,
}: {
  add?: {
    subaction: string;
  };
  emptyText: string;
  title: string;
  rows: Array<
    {
      id: string;
    } & React.ComponentProps<typeof PanelRow>
  >;
}) {
  const [form, setForm] = useState<string | boolean>(false);
  return (
    <div className="bg-white dark:bg-black rounded-md shadow overflow-hidden divide-y divide-neutral-300 dark:divide-neutral-800">
      <h3 className="bg-neutral-50 dark:bg-neutral-800 flex items-center margin-0 px-4 py-3">
        <span className="flex-grow">{title}</span>
        {add && (
          <Button
            onClick={() => setForm(!form)}
            icon={form === true ? "plus-circle-solid" : "plus-circle"}
          />
        )}
      </h3>
      {add && (
        <Collapse showing={form === true}>
          <Form
            {...add}
            cancel={() => setForm(false)}
            form={add.subaction}
            onSubmit={() => setForm(false)}
            resetAfterSubmit={true}
          />
        </Collapse>
      )}
      {!rows.length ? (
        <div className="py-16 text-center px-4">{emptyText}</div>
      ) : (
        rows.map((row, i) => (
          <PanelRow
            {...row}
            cancel={() => setForm(false)}
            formShowing={row.id === form}
            key={i}
            onClick={row.edit ? () => setForm(row.id) : undefined}
          />
        ))
      )}
    </div>
  );
}

function PanelRow({
  cancel,
  date,
  edit,
  formShowing,
  onClick,
  remove,
  text,
  user,
}: {
  cancel: () => void;
  date?: string | null;
  edit?: React.ComponentProps<typeof Form>;
  formShowing: boolean;
  remove?: { subaction: string; targetID: string };
  onClick?: () => void;
  text?: string | null;
  user?: { emailHash: string; name: string };
}) {
  const row = (
    <div
      className={cx(
        "flex justify-between gap-3 w-full px-4 py-3 items-center",
        {
          "cursor-pointer": !!onClick,
        }
      )}
      onClick={onClick}
    >
      {user && <Avatar emailHash={user.emailHash} name={user.name} />}
      <span className="grow">{text}</span>
      {date && <span>{formatDate(date)}</span>}
      {remove && <RemoveButton {...remove} />}
    </div>
  );
  return !edit ? (
    row
  ) : (
    <>
      <Collapse showing={formShowing}>
        <Form {...edit} cancel={cancel} />
      </Collapse>
      <Collapse showing={!formShowing}>{row}</Collapse>
    </>
  );
}

function RemoveButton({
  subaction,
  targetID,
}: {
  subaction: string;
  targetID: string;
}) {
  return (
    <ValidatedForm
      method="post"
      validator={withZod(z.object({}))}
      subaction={subaction}
      className="flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <input type="hidden" name="targetID" value={targetID} />
      <Submit />
    </ValidatedForm>
  );
}

function Submit() {
  return useIsSubmitting() ? (
    <Button icon="spinner" />
  ) : (
    <Button icon="delete" className="opacity-50 hover:opacity-100" />
  );
}
