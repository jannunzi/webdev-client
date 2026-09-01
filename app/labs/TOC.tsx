"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/labs", id: "wd-home-link", label: "Home", match: (p: string) => p === "/labs" },
  { href: "/labs/lab1", id: "wd-lab1-link", label: "Lab 1", match: (p: string) => p.endsWith("/lab1") || p.includes("/lab1/") },
  { href: "/labs/lab2", id: "wd-lab2-link", label: "Lab 2", match: (p: string) => p.includes("/lab2") },
  { href: "/labs/lab3", id: "wd-lab3-link", label: "Lab 3", match: (p: string) => p.includes("/lab3") },
  { href: "/labs/lab4", id: "wd-lab4-link", label: "Lab 4", match: (p: string) => p.includes("/lab4") },
  { href: "/labs/lab5", id: "wd-lab5-link", label: "Lab 5", match: (p: string) => p.includes("/lab5") },
  { href: "/", id: "wd-kambaz-link", label: "Kambaz", match: () => false },
] as const;

export default function TOC() {
  const pathname = usePathname() ?? "";
  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            id={link.id}
            className={
              link.match(pathname)
                ? "rounded bg-blue-600 px-2 py-0.5 text-white no-underline"
                : undefined
            }
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/labs/lab1/intermediates" id="wd-lab1-intermediates-link">
          Lab 1 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch1" id="wd-book-ch1-link">
          Book Ch1
        </Link>
      </li>
      <li>
        <Link href="/labs/lab2/intermediates" id="wd-lab2-intermediates-link">
          Lab 2 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch2" id="wd-book-ch2-link">
          Book Ch2
        </Link>
      </li>
      <li>
        <Link href="/labs/lab3/intermediates" id="wd-lab3-intermediates-link">
          Lab 3 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch3" id="wd-book-ch3-link">
          Book Ch3
        </Link>
      </li>
      <li>
        <Link href="/labs/lab4/intermediates" id="wd-lab4-intermediates-link">
          Lab 4 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch4" id="wd-book-ch4-link">
          Book Ch4
        </Link>
      </li>
      <li>
        <Link href="/labs/lab5/intermediates" id="wd-lab5-intermediates-link">
          Lab 5 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch5" id="wd-book-ch5-link">
          Book Ch5
        </Link>
      </li>
    </ul>
  );
}
