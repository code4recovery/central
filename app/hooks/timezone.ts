import { createContext, useContext } from "react";

export const TimezoneContext = createContext<{
  timezone?: string;
  setTimezone: (timezone: string) => void;
}>({ timezone: undefined, setTimezone: () => {} });

export const useTimezone = () => useContext(TimezoneContext);
