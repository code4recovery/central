export type User = {
  accounts: {
    id: string;
    name: string;
    theme: string;
  }[];
  accountUrl: string;
  currentAccountID: string;
  emailHash: string;
  id: string;
  isAdmin: boolean;
  name?: string;
  theme: {
    background: string;
    backgroundHover: string;
    border: string;
    focusOutline: string;
    focusRing: string;
    label: string;
    text: string;
  };
};
