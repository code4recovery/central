import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { formatClasses as cx } from "~/helpers";
import { Collapse } from "./Collapse";

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
      <Collapse showing={showing}>
        <p className="pt-3">{content}</p>
      </Collapse>
    </div>
  );
}
