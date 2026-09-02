import type { CourseGoal } from "./types";

export const courseGoals: CourseGoal = {
  heading: "Course goals",
  paragraphs: [
    "This course is about building full-stack Web applications that are dynamic, data-driven, and interactive. The emphasis is on the software-engineering problems of combining several languages and runtimes — markup, style, client JavaScript, an HTTP API, and a database — into one product you can deploy and explain.",
    "We work from the interactive book Developing Full Stack Next.js Web Applications (Chapters 1–6). You will implement Kambaz, a learning-management interface inspired by Canvas, in layers that match the book: structure first, then style, then data and events, then a REST API, then persistence.",
    "By the end of the term you should be able to design a user interface in HTML, style it with CSS and Tailwind, make it interactive with React and Next.js, hold client state in Zustand, expose a Node.js / Express REST API, and store documents in MongoDB — then ship the result to the public Web.",
  ],
  topics: [
    {
      name: "HTML",
      detail: "Document structure, forms, navigation, and layouts (Chapter 1).",
      href: "/book/ch1",
    },
    {
      name: "CSS and Tailwind",
      detail:
        "Selectors, the box model, flex/grid, and utility-first styling. Tailwind is the primary framework in this book — not Bootstrap.",
      href: "/book/ch2",
    },
    {
      name: "JavaScript and Next.js / React",
      detail:
        "Language fundamentals, data-driven rendering, and the App Router (Chapter 3).",
      href: "/book/ch3",
    },
    {
      name: "Client state with Zustand",
      detail:
        "Events, useState, Context, and Zustand stores for shared application data. Redux Toolkit appears in the labs as optional literacy so you can read a reducer when you meet one; Kambaz uses Zustand.",
      href: "/book/ch4",
    },
    {
      name: "Node.js and Express REST APIs",
      detail:
        "HTTP servers, routes, JSON, and a sibling Express project that serves Kambaz (Chapter 5).",
      href: "/book/ch5",
    },
    {
      name: "MongoDB",
      detail:
        "Local MongoDB, Mongoose models, Atlas, and wiring the API to collections (Chapter 6).",
      href: "/book/ch6",
    },
  ],
};
