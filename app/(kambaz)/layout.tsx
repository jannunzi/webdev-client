import { ReactNode } from "react";
import "@/app/labs/lab2/tailwind/utilities.css";
import "./kambaz.css";
import KambazNavigation from "./Navigation";
import { AccountProvider } from "./account/AccountContext";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <div id="wd-kambaz" className="font-sans">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">{children}</div>
      </div>
    </AccountProvider>
  );
}
