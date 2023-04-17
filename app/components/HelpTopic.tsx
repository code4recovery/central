import { Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { formatClasses as cx } from "~/helpers";

export function HelpTopic({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [showing, setShowing] = useState(false);
  return (
    <div className="relative pl-6">
      <ChevronRightIcon
        className={cx("absolute -left-1 top-.5 h-5 w-5 transition", {
          "rotate-90": showing,
        })}
      />
      <h3
        className={cx(
          "cursor-pointer font-semibold hover:underline transition-opacity ease-linear duration-500 hover:opacity-80",
          {
            "underline opacity-100": showing,
            "opacity-50": !showing,
          }
        )}
        onClick={() => setShowing(!showing)}
      >
        {title}
      </h3>
      <Transition
        show={showing}
        enter="transition-all ease-out duration-600"
        enterFrom="opacity-0 -mt-10"
        enterTo="opacity-100 mt-0"
        leave="transition ease-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <p className="pt-3">{content}</p>
      </Transition>
    </div>
  );
}
