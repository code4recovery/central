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
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showing && maxHeight === "none") {
      setMaxHeight(`${ref.current?.scrollHeight}px`);
      setTimeout(() => setMaxHeight("0"), 20);
    } else if (showing && maxHeight !== "none") {
      setMaxHeight(`${ref.current?.scrollHeight}px`);
      setTimeout(() => setMaxHeight("none"), timing);
    }
  }, [maxHeight, showing, timing]);
  return (
    <div
      ref={ref}
      style={{
        maxHeight,
        opacity: showing ? 1 : 0,
        overflow: "hidden",
        transition: `all ${timing}ms`,
      }}
    >
      {children}
    </div>
  );
}
