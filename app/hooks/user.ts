import { createContext, useContext } from "react";
import { config } from "~/helpers";
import type { User } from "~/types";

export const UserContext = createContext<User>({
  currentAccountID: "",
  email: "",
  emailHash: "",
  id: "",
  isAdmin: false,
  meetingCount: 0,
  name: "",
  theme: config.themes[config.defaultTheme as keyof typeof config.themes],
});

export const useUser = () => useContext(UserContext);
