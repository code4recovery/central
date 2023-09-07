import { useState } from "react";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import { config, formatClasses as cx, formatDate } from "~/helpers";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Form } from "./Form";
import { Collapse } from "./Collapse";
import { Link } from "@remix-run/react";

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
    <div className={config.classes.panel}>
      <h3
        className={cx(
          "bg-neutral-100 dark:bg-neutral-800 flex items-center m-0 px-4 py-3",
          {
            "mb-0.5": !add,
          }
        )}
      >
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
            form={form}
            setForm={setForm}
            key={i}
          />
        ))
      )}
    </div>
  );
}

function PanelRow({
  active,
  cancel,
  date,
  edit,
  form,
  link,
  remove,
  setForm,
  text,
  user,
}: {
  active?: boolean;
  cancel: () => void;
  date?: string | null;
  edit?: React.ComponentProps<typeof Form>;
  form?: string | boolean;
  link?: string;
  onClick?: () => void;
  remove?: { subaction: string; targetID: string };
  setForm?: (form: string | boolean) => void;
  text?: string | null;
  user?: { emailHash: string; name: string };
}) {
  const Tag = link ? Link : "div";
  const row = (
    <Tag
      className={cx(
        "flex justify-between gap-3 w-full px-4 py-3 items-center",
        {
          "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800":
            !!edit || !!link,
          "bg-neutral-50 dark:bg-neutral-800": !!active,
        }
      )}
      onClick={
        setForm && edit?.values?.id
          ? () => setForm(edit.values?.id as string)
          : undefined
      }
      to={link as string}
    >
      {user && <Avatar emailHash={user.emailHash} name={user.name} />}
      <span className="grow">{text}</span>
      {date && <span className="whitespace-nowrap">{formatDate(date)}</span>}
      {remove && <RemoveButton {...remove} />}
    </Tag>
  );
  return !edit ? (
    row
  ) : (
    <>
      <Collapse showing={edit.values?.id === form}>
        <Form {...edit} cancel={cancel} />
      </Collapse>
      <Collapse showing={edit.values?.id !== form}>{row}</Collapse>
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
