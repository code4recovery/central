import { config } from "~/helpers";

export function getAccount() {
  const theme = "emerald";
  return {
    theme: config.colors[theme],
    name: "Online Intergroup of A.A.",
    url: "https://aa-intergroup.org/meetings",
  };
}
