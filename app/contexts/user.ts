import { createContext } from "react";
import type { User } from "~/types";

export const UserContext = createContext<User | null>(null);
