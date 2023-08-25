import { createContext, useContext } from "react";
import type { User } from "~/types";

export const UserContext = createContext<User>({
  emailHash: "",
  id: "",
  canAddUsers: false,
  name: "",
});

export const useUser = () => useContext(UserContext);
