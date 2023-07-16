import { useEffect, useRef, useState } from "react";

export function Collapse({
  children,
  showing,
  timing = 400,
}: {
  children: React.ReactNode;
  showing: boolean;
  timing?: number;
}) {
  const [maxHeight, setMaxHeight] = useState<string>(showing ? "none" : "0");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showing && maxHeight === "none") {
      // console.log("hiding");
      setMaxHeight(`${ref.current?.scrollHeight}px`);
      timer.current = setTimeout(() => setMaxHeight("0"), 20);
    } else if (showing && maxHeight !== "none") {
      // console.log("showing");
      setMaxHeight(`${ref.current?.scrollHeight}px`);
      timer.current = setTimeout(() => setMaxHeight("none"), timing);
    }
  }, [maxHeight, showing, timing]);
  return (
    <div
      ref={ref}
      style={{
        maxHeight,
        overflow: "hidden",
        transition: maxHeight === "none" ? undefined : `max-height ${timing}ms`,
      }}
    >
      {children}
    </div>
  );
}
