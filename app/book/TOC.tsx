"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOC_SYNC_PAUSE_MS = 2500;
const READING_MARKER_PX = 96;

export type TocEntry = {
  id: string;
  label: string;
  children?: TocEntry[];
};

export type ChapterToc = {
  id: string;
  label: string;
  href: string;
  sections: TocEntry[];
};

export const CH1_TOC: TocEntry[] = [
  { id: "intro", label: "Introduction" },
  { id: "sec-1-1", label: "1.1 Learning Objectives" },
  {
    id: "sec-1-2",
    label: "1.2 Setting Up the Development Environment",
    children: [
      { id: "sec-1-2-1", label: "1.2.1 Installing Node.js" },
      {
        id: "sec-1-2-2",
        label: "1.2.2 Installing an Integrated Development Environment (IDE)",
      },
      { id: "sec-1-2-3", label: "1.2.3 Adding Claude to the IDE" },
      { id: "sec-1-2-4", label: "1.2.4 Creating a Next.js Application" },
      {
        id: "sec-1-2-5",
        label: "1.2.5 Creating Pages and Routes with the App Router",
      },
    ],
  },
  {
    id: "sec-1-3",
    label: "1.3 Introduction to HTML",
    children: [
      {
        id: "sec-1-3-1",
        label: "1.3.1 Structuring Web Content with the HTML Heading, Div, and Span Tags",
      },
      {
        id: "sec-1-3-2",
        label: "1.3.2 Formatting Vertical Spacing with the HTML Paragraph Tag",
      },
      {
        id: "sec-1-3-3",
        label: "1.3.3 Listing Content with HTML List Tags",
      },
      {
        id: "sec-1-3-4",
        label: "1.3.4 Tabulating Data with the HTML Table Tags",
      },
      { id: "sec-1-3-5", label: "1.3.5 Image Tag" },
      {
        id: "sec-1-3-6",
        label: "1.3.6 Creating Web Forms",
        children: [
          { id: "sec-1-3-6-1", label: "1.3.6.1 Text Fields" },
          { id: "sec-1-3-6-2", label: "1.3.6.2 Textarea" },
          { id: "sec-1-3-6-3", label: "1.3.6.3 Radio Buttons" },
          { id: "sec-1-3-6-4", label: "1.3.6.4 Checkboxes" },
          { id: "sec-1-3-6-5", label: "1.3.6.5 Dropdowns" },
          { id: "sec-1-3-6-6", label: "1.3.6.6 Other Field Types" },
          { id: "sec-1-3-6-7", label: "1.3.6.7 Buttons" },
        ],
      },
      {
        id: "sec-1-3-7",
        label: "1.3.7 Parameterizing Components with Props",
      },
      {
        id: "sec-1-3-8",
        label: "1.3.8 Wrapping Content with Children",
      },
      {
        id: "sec-1-3-9",
        label: "1.3.9 Implementing Navigation with the Anchor Tag",
      },
      { id: "sec-1-3-10", label: "1.3.10 Implementing Navigation" },
      { id: "sec-1-3-11", label: "1.3.11 Implementing Layouts" },
      { id: "sec-1-3-12", label: "1.3.12 Exercises" },
      { id: "sec-1-3-13", label: "1.3.13 Check Your Understanding" },
    ],
  },
  {
    id: "sec-1-4",
    label: "1.4 Prototyping the React Kambaz User Interface with HTML",
    children: [
      {
        id: "sec-1-4-1",
        label: "1.4.1 Implementing the Kambaz Landing Page",
      },
      {
        id: "sec-1-4-2",
        label: "1.4.2 The Kambaz Account Screens",
        children: [
          { id: "sec-1-4-2-1", label: "1.4.2.1 The Sign In Screen" },
          { id: "sec-1-4-2-2", label: "1.4.2.2 The Sign Up Screen" },
          { id: "sec-1-4-2-3", label: "1.4.2.3 The Profile Screen" },
          { id: "sec-1-4-2-4", label: "1.4.2.4 Account Navigation" },
        ],
      },
      {
        id: "sec-1-4-3",
        label: "1.4.3 Implementing the Dashboard Screen",
        children: [
          { id: "sec-1-4-3-1", label: "1.4.3.1 Kambaz Navigation Sidebar" },
          { id: "sec-1-4-3-2", label: "1.4.3.2 Handling Missing Pages" },
        ],
      },
      {
        id: "sec-1-4-4",
        label: "1.4.4 Implementing the Courses Screen",
        children: [
          { id: "sec-1-4-4-1", label: "1.4.4.1 Course Navigation Sidebar" },
        ],
      },
      {
        id: "sec-1-4-5",
        label: "1.4.5 Implementing the Modules Screen",
      },
      {
        id: "sec-1-4-6",
        label: "1.4.6 Implementing the Course Home Screen",
      },
      {
        id: "sec-1-4-7",
        label: "1.4.7 Assignments Screen (On Your Own)",
      },
      {
        id: "sec-1-4-8",
        label: "1.4.8 Assignment Editor Screen (On Your Own)",
      },
      { id: "sec-1-4-9", label: "1.4.9 Exercises" },
    ],
  },
  { id: "sec-1-5", label: "1.5 Committing Code to Source Control" },
  { id: "sec-1-6", label: "1.6 Deploying Next.js Projects to the Web" },
  { id: "sec-1-7", label: "1.7 Conclusion" },
];

export const CH2_TOC: TocEntry[] = [
  { id: "intro", label: "Introduction" },
  {
    id: "sec-2-1",
    label: "2.1 Styling React Components with CSS",
    children: [
      { id: "sec-2-1-1", label: "2.1.1 Style Attribute" },
      { id: "sec-2-1-2", label: "2.1.2 Importing CSS Documents" },
      { id: "sec-2-1-3", label: "2.1.3 ID Selectors" },
      { id: "sec-2-1-4", label: "2.1.4 Class Selectors" },
      { id: "sec-2-1-5", label: "2.1.5 Document Structure Selectors" },
      { id: "sec-2-1-6", label: "2.1.6 CSS Selection Rule Mechanism" },
      { id: "sec-2-1-7", label: "2.1.7 Foreground Color" },
      { id: "sec-2-1-8", label: "2.1.8 Background Color" },
      { id: "sec-2-1-9", label: "2.1.9 Borders" },
      { id: "sec-2-1-10", label: "2.1.10 Padding, Margins, and the Box Model" },
      { id: "sec-2-1-11", label: "2.1.11 Corners" },
      { id: "sec-2-1-12", label: "2.1.12 Dimensions and Display" },
      { id: "sec-2-1-13", label: "2.1.13 Relative Position" },
      { id: "sec-2-1-14", label: "2.1.14 Absolute Position" },
      { id: "sec-2-1-15", label: "2.1.15 Fixed Position" },
      { id: "sec-2-1-16", label: "2.1.16 Z-Index" },
      { id: "sec-2-1-17", label: "2.1.17 Float" },
      { id: "sec-2-1-18", label: "2.1.18 Grid Layout with Float" },
      { id: "sec-2-1-19", label: "2.1.19 Flex" },
      { id: "sec-2-1-20", label: "2.1.20 Media Queries" },
      { id: "sec-2-1-21", label: "2.1.21 Check Your Understanding" },
    ],
  },
  { id: "sec-2-2", label: "2.2 Decorating Documents with React Icons" },
  {
    id: "sec-2-3",
    label: "2.3 Styling Webpages with Tailwind CSS",
    children: [
      { id: "sec-2-3-1", label: "2.3.1 Spacing" },
      { id: "sec-2-3-2", label: "2.3.2 Typography" },
      { id: "sec-2-3-3", label: "2.3.3 Background Colors" },
      { id: "sec-2-3-4", label: "2.3.4 Responsive Design" },
      { id: "sec-2-3-5", label: "2.3.5 Filters" },
      { id: "sec-2-3-6", label: "2.3.6 CSS Grid Layout" },
      { id: "sec-2-3-7", label: "2.3.7 Exercises" },
    ],
  },
  {
    id: "sec-2-4",
    label: "2.4 Styling Kambaz with CSS and Tailwind",
    children: [
      { id: "sec-2-4-1", label: "2.4.1 Kambaz Navigation Sidebar" },
      { id: "sec-2-4-2", label: "2.4.2 Dashboard Screen" },
      { id: "sec-2-4-3", label: "2.4.3 Course Navigation Sidebar" },
      { id: "sec-2-4-4", label: "2.4.4 Modules Screen" },
      { id: "sec-2-4-5", label: "2.4.5 Home Screen" },
      { id: "sec-2-4-6", label: "2.4.6 People Screen" },
      { id: "sec-2-4-7", label: "2.4.7 Assignments Screen" },
      { id: "sec-2-4-8", label: "2.4.8 Assignment Editor (On Your Own)" },
      { id: "sec-2-4-9", label: "2.4.9 Account Screens (On Your Own)" },
      { id: "sec-2-4-10", label: "2.4.10 Exercises" },
    ],
  },
  { id: "sec-2-5", label: "2.5 Delivery" },
];

export const CH3_TOC: TocEntry[] = [
  { id: "intro", label: "Introduction" },
  { id: "sec-3-1", label: "3.1 Learning Objectives" },
  {
    id: "sec-3-2",
    label: "3.2 Introduction to JavaScript",
    children: [
      { id: "sec-3-2-1", label: "3.2.1 Variables and Constants" },
      { id: "sec-3-2-2", label: "3.2.2 Variable Types" },
      { id: "sec-3-2-3", label: "3.2.3 Boolean Variables" },
      { id: "sec-3-2-4", label: "3.2.4 Conditionals" },
      { id: "sec-3-2-5", label: "3.2.5 Ternary Operator" },
      { id: "sec-3-2-6", label: "3.2.6 Generating Conditional Output" },
      { id: "sec-3-2-7", label: "3.2.7 Null vs Undefined" },
    ],
  },
  {
    id: "sec-3-3",
    label: "3.3 JavaScript Functions",
    children: [
      { id: "sec-3-3-1", label: "3.3.1 Arrow Functions" },
      { id: "sec-3-3-2", label: "3.3.2 Implied Return" },
      { id: "sec-3-3-3", label: "3.3.3 Template Literals" },
    ],
  },
  {
    id: "sec-3-4",
    label: "3.4 JavaScript Data Structures",
    children: [
      { id: "sec-3-4-1", label: "3.4.1 Array Index and Length" },
      { id: "sec-3-4-2", label: "3.4.2 Adding and Removing From Arrays" },
      { id: "sec-3-4-3", label: "3.4.3 For Loops" },
      { id: "sec-3-4-4", label: "3.4.4 Map Function" },
      { id: "sec-3-4-5", label: "3.4.5 Find Function" },
      { id: "sec-3-4-6", label: "3.4.6 Find Index" },
      { id: "sec-3-4-7", label: "3.4.7 Filter Function" },
      { id: "sec-3-4-8", label: "3.4.8 Includes, some, and every" },
      { id: "sec-3-4-9", label: "3.4.9 Reduce" },
      { id: "sec-3-4-10", label: "3.4.10 JSON Stringify" },
      { id: "sec-3-4-11", label: "3.4.11 JavaScript Objects" },
      { id: "sec-3-4-12", label: "3.4.12 Writing to the Console" },
      { id: "sec-3-4-13", label: "3.4.13 Spread Operator" },
      { id: "sec-3-4-14", label: "3.4.14 Destructing" },
      { id: "sec-3-4-15", label: "3.4.15 Function Destructing" },
      { id: "sec-3-4-16", label: "3.4.16 Destructing Imports" },
      {
        id: "sec-3-4-17",
        label: "3.4.17 Optional chaining and nullish coalescing",
      },
    ],
  },
  {
    id: "sec-3-5",
    label: "3.5 Dynamic Styling",
    children: [
      { id: "sec-3-5-1", label: "3.5.1 Working with HTML Classes" },
      { id: "sec-3-5-2", label: "3.5.2 Working with the Style Attribute" },
    ],
  },
  {
    id: "sec-3-6",
    label: "3.6 Client and Server Components",
    children: [
      { id: "sec-3-6-1", label: "3.6.1 Client Components" },
      { id: "sec-3-6-2", label: "3.6.2 Server Components" },
    ],
  },
  {
    id: "sec-3-7",
    label: "3.7 Parameterizing Components",
    children: [
      { id: "sec-3-7-1", label: "3.7.1 Child Components" },
      { id: "sec-3-7-2", label: "3.7.2 Working with the Pathname" },
      { id: "sec-3-7-3", label: "3.7.3 Encoding Path Parameters" },
      { id: "sec-3-7-4", label: "3.7.4 Rendering a Data Structure" },
      { id: "sec-3-7-5", label: "3.7.5 Exercises" },
    ],
  },
  { id: "sec-3-8", label: "3.8 Check Your Understanding" },
  {
    id: "sec-3-9",
    label: "3.9 Implementing a Data Driven Kambaz Application",
    children: [
      { id: "sec-3-9-1", label: "3.9.1 Data Driven Kambaz Navigation" },
      { id: "sec-3-9-2", label: "3.9.2 Implementing a Kambaz Database" },
      { id: "sec-3-9-3", label: "3.9.3 Data Driven Dashboard" },
      { id: "sec-3-9-4", label: "3.9.4 Data Driven Courses Screen" },
      {
        id: "sec-3-9-5",
        label: "3.9.5 Data Driven Course Navigation (On Your Own)",
      },
      { id: "sec-3-9-6", label: "3.9.6 Implementing the Breadcrumb" },
      { id: "sec-3-9-7", label: "3.9.7 Data Driven Modules" },
      {
        id: "sec-3-9-8",
        label: "3.9.8 Data Driven Assignments (On Your Own)",
      },
      {
        id: "sec-3-9-8-1",
        label: "3.9.8.1 Assignment Editor (On Your Own)",
      },
      { id: "sec-3-9-9", label: "3.9.9 Data Driven People Screen" },
      { id: "sec-3-9-10", label: "3.9.10 Exercises" },
    ],
  },
  { id: "sec-3-10", label: "3.10 Delivery" },
];

export const CH4_TOC: TocEntry[] = [
  { id: "intro", label: "Introduction" },
  { id: "sec-4-1", label: "4.1 Learning Objectives" },
  {
    id: "sec-4-2",
    label: "4.2 Managing State and User Input",
    children: [
      { id: "sec-4-2-1", label: "4.2.1 Handling User Events" },
      { id: "sec-4-2-2", label: "4.2.2 Passing Data on Events" },
      { id: "sec-4-2-3", label: "4.2.3 Passing Functions" },
      { id: "sec-4-2-4", label: "4.2.4 useState and the Counter" },
      { id: "sec-4-2-5", label: "4.2.5 Boolean State Variables" },
      { id: "sec-4-2-6", label: "4.2.6 String State Variables" },
      { id: "sec-4-2-7", label: "4.2.7 Date State Variables" },
      { id: "sec-4-2-8", label: "4.2.8 Object State Variables" },
      { id: "sec-4-2-9", label: "4.2.9 Array State Variables" },
    ],
  },
  {
    id: "sec-4-3",
    label: "4.3 Sharing State, Prop Drilling, and URLs",
    children: [
      { id: "sec-4-3-1", label: "4.3.1 Sharing State Between Parent and Child" },
      { id: "sec-4-3-2", label: "4.3.2 Prop Drilling" },
      { id: "sec-4-3-3", label: "4.3.3 Encoding State in the URL" },
    ],
  },
  { id: "sec-4-4", label: "4.4 React Context" },
  {
    id: "sec-4-5",
    label: "4.5 Zustand",
    children: [
      { id: "sec-4-5-1", label: "4.5.1 Zustand Counter" },
      { id: "sec-4-5-2", label: "4.5.2 Zustand Todo List" },
    ],
  },
  { id: "sec-4-6", label: "4.6 Redux Toolkit" },
  { id: "sec-4-7", label: "4.7 Side Effects with useEffect" },
  { id: "sec-4-8", label: "4.8 Exercises" },
  { id: "sec-4-9", label: "4.9 Check Your Understanding" },
  {
    id: "sec-4-10",
    label: "4.10 Adding State to the Kambaz User Interface",
    children: [
      { id: "sec-4-10-1", label: "4.10.1 A Courses Store" },
      { id: "sec-4-10-2", label: "4.10.2 Dashboard Create, Edit, and Delete" },
      { id: "sec-4-10-3", label: "4.10.3 Course Navigation Toggle" },
      {
        id: "sec-4-10-4",
        label: "4.10.4 Adding State to the Modules Screen",
        children: [
          { id: "sec-4-10-4-1", label: "4.10.4.1 Creating a Module" },
          { id: "sec-4-10-4-2", label: "4.10.4.2 Deleting a Module" },
          { id: "sec-4-10-4-3", label: "4.10.4.3 Editing a Module" },
          { id: "sec-4-10-4-4", label: "4.10.4.4 A Modules Store" },
        ],
      },
      {
        id: "sec-4-10-5",
        label: "4.10.5 Account Screens",
        children: [
          { id: "sec-4-10-5-1", label: "4.10.5.1 Account Context" },
          { id: "sec-4-10-5-2", label: "4.10.5.2 Sign in" },
          { id: "sec-4-10-5-3", label: "4.10.5.3 Dashboard by Enrollment" },
          { id: "sec-4-10-5-4", label: "4.10.5.4 Account Navigation" },
          { id: "sec-4-10-5-5", label: "4.10.5.5 Profile" },
        ],
      },
      {
        id: "sec-4-10-6",
        label: "4.10.6 Assignments (On Your Own)",
        children: [
          { id: "sec-4-10-6-1", label: "4.10.6.1 Assignments Store" },
          { id: "sec-4-10-6-2", label: "4.10.6.2 Creating an Assignment" },
          { id: "sec-4-10-6-3", label: "4.10.6.3 Editing an Assignment" },
          { id: "sec-4-10-6-4", label: "4.10.6.4 Deleting an Assignment" },
        ],
      },
      { id: "sec-4-10-7", label: "4.10.7 Enrollments (On Your Own)" },
      { id: "sec-4-11", label: "4.11 Exercises" },
    ],
  },
  { id: "sec-4-12", label: "4.12 Delivery" },
];

export const CH5_TOC: TocEntry[] = [
  { id: "intro", label: "Introduction" },
  { id: "sec-5-1", label: "5.1 Learning Objectives" },
  {
    id: "sec-5-2",
    label: "5.2 HTTP Fundamentals",
    children: [
      { id: "sec-5-2-1", label: "5.2.1 Requests, Responses, and URLs" },
      { id: "sec-5-2-2", label: "5.2.2 HTTP Methods" },
      { id: "sec-5-2-3", label: "5.2.3 Status Codes" },
      { id: "sec-5-2-4", label: "5.2.4 REST Resources and JSON" },
    ],
  },
  {
    id: "sec-5-3",
    label: "5.3 Route Handlers",
    children: [
      { id: "sec-5-3-1", label: "5.3.1 A GET Handler" },
      { id: "sec-5-3-2", label: "5.3.2 Query Parameters" },
      { id: "sec-5-3-3", label: "5.3.3 Path Parameters" },
      { id: "sec-5-3-4", label: "5.3.4 POST and a JSON Body" },
      { id: "sec-5-3-5", label: "5.3.5 PUT and DELETE" },
    ],
  },
  {
    id: "sec-5-4",
    label: "5.4 Fetching from Client Components",
    children: [
      { id: "sec-5-4-1", label: "5.4.1 Fetching on Mount" },
      { id: "sec-5-4-2", label: "5.4.2 POST from a Form" },
      { id: "sec-5-4-3", label: "5.4.3 Updating and Deleting" },
    ],
  },
  { id: "sec-5-5", label: "5.5 Fetching from Server Components" },
  { id: "sec-5-6", label: "5.6 Server Actions versus Route Handlers" },
  {
    id: "sec-5-7",
    label: "5.7 A Separate Node Server",
    children: [
      { id: "sec-5-7-1", label: "5.7.1 Two Server Models" },
      { id: "sec-5-7-2", label: "5.7.2 An Express Application" },
      { id: "sec-5-7-3", label: "5.7.3 CORS" },
      { id: "sec-5-7-4", label: "5.7.4 Calling the Remote API" },
    ],
  },
  {
    id: "sec-5-8",
    label: "5.8 Deploying the API to Render.com",
    children: [
      { id: "sec-5-8-1", label: "5.8.1 A Render Web Service" },
      { id: "sec-5-8-2", label: "5.8.2 Root Directory and Start Command" },
      { id: "sec-5-8-3", label: "5.8.3 Environment Variables" },
      { id: "sec-5-8-4", label: "5.8.4 Pointing Next.js at Render" },
    ],
  },
  { id: "sec-5-9", label: "5.9 Exercises" },
  { id: "sec-5-10", label: "5.10 Check Your Understanding" },
  {
    id: "sec-5-11",
    label: "5.11 Implementing Kambaz HTTP APIs",
    children: [
      { id: "sec-5-11-1", label: "5.11.1 An In-Memory Kambaz Store" },
      { id: "sec-5-11-2", label: "5.11.2 Courses API" },
      { id: "sec-5-11-3", label: "5.11.3 Dashboard through fetch" },
      { id: "sec-5-11-4", label: "5.11.4 Modules API" },
      { id: "sec-5-11-5", label: "5.11.5 Modules Screen through fetch" },
      { id: "sec-5-11-6", label: "5.11.6 The Same Routes on Express" },
      { id: "sec-5-11-7", label: "5.11.7 Pointing Kambaz at Render" },
      { id: "sec-5-11-8", label: "5.11.8 Assignments (On Your Own)" },
      { id: "sec-5-11-9", label: "5.11.9 Exercises" },
    ],
  },
  { id: "sec-5-12", label: "5.12 Delivery" },
];

export const CHAPTERS: ChapterToc[] = [
  {
    id: "ch1",
    label: "Chapter 1 — HTML",
    href: "/book/ch1",
    sections: CH1_TOC,
  },
  {
    id: "ch2",
    label: "Chapter 2 — CSS & Tailwind",
    href: "/book/ch2",
    sections: CH2_TOC,
  },
  {
    id: "ch3",
    label: "Chapter 3 — JavaScript",
    href: "/book/ch3",
    sections: CH3_TOC,
  },
  {
    id: "ch4",
    label: "Chapter 4 — Client State",
    href: "/book/ch4",
    sections: CH4_TOC,
  },
  {
    id: "ch5",
    label: "Chapter 5 — HTTP APIs",
    href: "/book/ch5",
    sections: CH5_TOC,
  },
];

function entryMatches(entry: TocEntry, query: string): boolean {
  if (entry.label.toLowerCase().includes(query)) return true;
  return entry.children?.some((child) => entryMatches(child, query)) ?? false;
}

function filterEntries(entries: TocEntry[], query: string): TocEntry[] {
  if (!query) return entries;
  return entries
    .map((entry) => {
      if (!entryMatches(entry, query)) return null;
      if (!entry.children) return entry;
      const children = filterEntries(entry.children, query);
      // Keep children that match; if only the parent label matches, keep all children
      return {
        ...entry,
        children: children.length > 0 ? children : entry.children,
      };
    })
    .filter(Boolean) as TocEntry[];
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className="inline-block w-3 text-center text-xs text-neutral-500"
      aria-hidden
    >
      {open ? "▼" : "▶"}
    </span>
  );
}

function TocList({
  entries,
  basePath,
  openIds,
  toggle,
  activeId,
  setLinkRef,
  onNavigate,
  depth = 0,
}: {
  entries: TocEntry[];
  basePath: string;
  openIds: Set<string>;
  toggle: (id: string) => void;
  activeId: string | null;
  setLinkRef: (id: string, node: HTMLAnchorElement | null) => void;
  onNavigate: () => void;
  depth?: number;
}) {
  return (
    <ul className="m-0 list-none space-y-0.5 p-0 text-sm">
      {entries.map((entry) => {
        const hasChildren = Boolean(entry.children?.length);
        const open = openIds.has(entry.id);
        const active = activeId === entry.id;
        return (
          <li key={entry.id}>
            <div className="flex items-start gap-0.5">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggle(entry.id)}
                  className="mt-0.5 shrink-0 rounded border-0 bg-transparent px-1 py-1 hover:bg-neutral-200"
                  aria-expanded={open}
                  aria-label={open ? `Collapse ${entry.label}` : `Expand ${entry.label}`}
                >
                  <Chevron open={open} />
                </button>
              ) : (
                <span className="inline-block w-5 shrink-0" />
              )}
              <Link
                ref={(node) => setLinkRef(entry.id, node)}
                href={`${basePath}#${entry.id}`}
                onClick={onNavigate}
                aria-current={active ? "true" : undefined}
                className={
                  active
                    ? "min-w-0 flex-1 rounded bg-neutral-200 px-1 py-1 font-medium text-neutral-900 no-underline"
                    : "min-w-0 flex-1 rounded px-1 py-1 text-neutral-800 no-underline hover:bg-neutral-200"
                }
              >
                {entry.label}
              </Link>
            </div>
            {hasChildren && open ? (
              <div
                className="ml-3 border-l border-neutral-300 pl-1"
                style={{ marginLeft: `${0.5 + depth * 0.25}rem` }}
              >
                <TocList
                  entries={entry.children!}
                  basePath={basePath}
                  openIds={openIds}
                  toggle={toggle}
                  activeId={activeId}
                  setLinkRef={setLinkRef}
                  onNavigate={onNavigate}
                  depth={depth + 1}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function collectExpandableIds(entries: TocEntry[]): string[] {
  const ids: string[] = [];
  for (const entry of entries) {
    if (entry.children?.length) {
      ids.push(entry.id);
      ids.push(...collectExpandableIds(entry.children));
    }
  }
  return ids;
}

function collectSectionIds(entries: TocEntry[]): string[] {
  const ids: string[] = [];
  for (const entry of entries) {
    ids.push(entry.id);
    if (entry.children?.length) {
      ids.push(...collectSectionIds(entry.children));
    }
  }
  return ids;
}

/** Ancestor section ids that must stay expanded so `targetId` is visible in the TOC. */
function findAncestorIds(
  entries: TocEntry[],
  targetId: string,
  trail: string[] = [],
): string[] | null {
  for (const entry of entries) {
    if (entry.id === targetId) return trail;
    if (entry.children?.length) {
      const found = findAncestorIds(entry.children, targetId, [
        ...trail,
        entry.id,
      ]);
      if (found) return found;
    }
  }
  return null;
}

function isFullyVisibleIn(el: HTMLElement, container: HTMLElement): boolean {
  const er = el.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  return er.top >= cr.top && er.bottom <= cr.bottom;
}

export default function BookTOC() {
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set(CHAPTERS.map((c) => c.id)),
  );
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const chapter of CHAPTERS) {
      for (const id of collectExpandableIds(chapter.sections)) {
        initial.add(id);
      }
    }
    return initial;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const hoveringTocRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const suppressScrollPauseRef = useRef(false);

  const currentChapter = useMemo(
    () => CHAPTERS.find((c) => pathname === c.href || pathname.startsWith(`${c.href}/`)),
    [pathname],
  );

  const sectionIds = useMemo(
    () => (currentChapter ? collectSectionIds(currentChapter.sections) : []),
    [currentChapter],
  );

  const pauseSync = useCallback(() => {
    pauseUntilRef.current = Date.now() + TOC_SYNC_PAUSE_MS;
  }, []);

  const setLinkRef = useCallback(
    (id: string, node: HTMLAnchorElement | null) => {
      if (node) linkRefs.current.set(id, node);
      else linkRefs.current.delete(id);
    },
    [],
  );

  // Track the section currently being read from window scroll position.
  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(null);
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= READING_MARKER_PX) {
          current = id;
        }
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sectionIds]);

  // Keep the active branch expanded so the highlight stays visible.
  useEffect(() => {
    if (!activeId || !currentChapter) return;
    const ancestors = findAncestorIds(currentChapter.sections, activeId) ?? [];
    setOpenChapters((prev) => {
      if (prev.has(currentChapter.id)) return prev;
      const next = new Set(prev);
      next.add(currentChapter.id);
      return next;
    });
    if (ancestors.length === 0) return;
    setOpenSections((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const id of ancestors) {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [activeId, currentChapter]);

  const syncActiveLinkIntoView = useCallback(() => {
    if (!activeId || !panelOpen || query.trim()) return;
    if (hoveringTocRef.current) return;
    if (Date.now() < pauseUntilRef.current) return;

    const link = linkRefs.current.get(activeId);
    const container = scrollContainerRef.current;
    if (!link || !container) return;
    if (isFullyVisibleIn(link, container)) return;

    suppressScrollPauseRef.current = true;
    link.scrollIntoView({ block: "nearest", behavior: "smooth" });
    window.setTimeout(() => {
      suppressScrollPauseRef.current = false;
    }, 500);
  }, [activeId, panelOpen, query]);

  // Polite TOC auto-scroll: only when out of view, and not while the user is using the TOC.
  useEffect(() => {
    syncActiveLinkIntoView();
  }, [syncActiveLinkIntoView]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredChapters = useMemo(() => {
    return CHAPTERS.map((chapter) => {
      const chapterMatches = chapter.label.toLowerCase().includes(normalizedQuery);
      const sections = filterEntries(chapter.sections, normalizedQuery);
      if (!normalizedQuery) return chapter;
      if (!chapterMatches && sections.length === 0) return null;
      return { ...chapter, sections: chapterMatches && sections.length === 0 ? chapter.sections : sections };
    }).filter(Boolean) as ChapterToc[];
  }, [normalizedQuery]);

  // While searching, auto-expand matching branches
  const effectiveOpenSections = useMemo(() => {
    if (!normalizedQuery) return openSections;
    const next = new Set(openSections);
    for (const chapter of filteredChapters) {
      for (const id of collectExpandableIds(chapter.sections)) {
        next.add(id);
      }
    }
    return next;
  }, [normalizedQuery, openSections, filteredChapters]);

  const effectiveOpenChapters = useMemo(() => {
    if (!normalizedQuery) return openChapters;
    return new Set(filteredChapters.map((c) => c.id));
  }, [normalizedQuery, openChapters, filteredChapters]);

  function toggleChapter(id: string) {
    pauseSync();
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSection(id: string) {
    pauseSync();
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!panelOpen) {
    return (
      <aside
        id="wd-book-toc"
        className="sticky top-0 flex h-screen w-10 shrink-0 flex-col border-r border-neutral-300 bg-neutral-50 font-sans"
      >
        <div className="min-h-0 flex-1" />
        <div className="flex items-center justify-center border-t border-neutral-300 bg-neutral-100 p-2">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm hover:bg-neutral-50"
            aria-expanded={false}
            title="Expand table of contents"
          >
            »»
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      id="wd-book-toc"
      className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-neutral-300 bg-neutral-50 font-sans text-neutral-900"
    >
      <div className="border-b border-neutral-300 px-3 py-2">
        <label htmlFor="wd-book-toc-search" className="sr-only">
          Search
        </label>
        <input
          id="wd-book-toc-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={pauseSync}
          placeholder="Search"
          className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-2 py-3"
        onPointerEnter={() => {
          hoveringTocRef.current = true;
        }}
        onPointerLeave={() => {
          hoveringTocRef.current = false;
          // Resume sync after the user stops browsing the TOC.
          window.setTimeout(syncActiveLinkIntoView, 0);
        }}
        onScroll={() => {
          if (suppressScrollPauseRef.current) return;
          pauseSync();
        }}
        onWheel={pauseSync}
        onPointerDown={pauseSync}
      >
        <ul className="m-0 mb-3 list-none space-y-0.5 p-0 text-sm">
          <li>
            <Link
              href="/book"
              className="block rounded px-2 py-1 no-underline hover:bg-neutral-200"
            >
              Book Home
            </Link>
          </li>
          <li>
            <Link
              href="/labs"
              className="block rounded px-2 py-1 no-underline hover:bg-neutral-200"
            >
              Labs
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="block rounded px-2 py-1 no-underline hover:bg-neutral-200"
            >
              Kambaz
            </Link>
          </li>
        </ul>

        <h3 className="mb-2 mt-2 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Chapters
        </h3>

        {filteredChapters.length === 0 ? (
          <p className="px-2 text-sm text-neutral-500">No matching sections.</p>
        ) : (
          <ul className="m-0 list-none space-y-1 p-0">
            {filteredChapters.map((chapter) => {
              const open = effectiveOpenChapters.has(chapter.id);
              return (
                <li key={chapter.id} className="rounded">
                  <div className="flex items-start gap-0.5">
                    <button
                      type="button"
                      onClick={() => toggleChapter(chapter.id)}
                      className="mt-0.5 shrink-0 rounded border-0 bg-transparent px-1 py-1 hover:bg-neutral-200"
                      aria-expanded={open}
                      aria-label={
                        open ? `Collapse ${chapter.label}` : `Expand ${chapter.label}`
                      }
                    >
                      <Chevron open={open} />
                    </button>
                    <Link
                      href={chapter.href}
                      onClick={pauseSync}
                      className="min-w-0 flex-1 rounded px-1 py-1 text-sm font-medium no-underline hover:bg-neutral-200"
                    >
                      {chapter.label}
                    </Link>
                  </div>
                  {open ? (
                    <div className="ml-2 mt-1 border-l border-neutral-300 pl-1">
                      <TocList
                        entries={chapter.sections}
                        basePath={chapter.href}
                        openIds={effectiveOpenSections}
                        toggle={toggleSection}
                        activeId={activeId}
                        setLinkRef={setLinkRef}
                        onNavigate={pauseSync}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-center border-t border-neutral-300 bg-neutral-100 p-2">
        <button
          type="button"
          onClick={() => setPanelOpen(false)}
          className="rounded border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-50"
          aria-expanded={true}
          title="Collapse table of contents"
        >
          ««
        </button>
      </div>
    </aside>
  );
}
