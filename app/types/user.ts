export type User = {
  accountName: string;
  accountUrl: string;
  currentAccountID: string;
  email: string;
  emailHash: string;
  meetingCount: number;
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
  themeName: string;
};
