import type { ReactNode } from "react";
import BookTOC from "./TOC";
import "./book.css";
import { AccountProvider } from "@/app/(kambaz)/account/AccountContext";

export default function BookLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <div className="book-shell flex min-h-screen">
        <BookTOC />
        <main className="min-w-0 w-full flex-1 overflow-x-auto px-4 py-6 md:p-6">
          {children}
        </main>
      </div>
    </AccountProvider>
  );
}
