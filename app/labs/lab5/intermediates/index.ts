export { default as HttpMethods } from "./5-2-1-HttpMethods";
export { default as StatusCodes } from "./5-2-2-StatusCodes";
export { default as GetHandler } from "./5-3-1-GetHandler";
export { default as QueryHandler } from "./5-3-2-QueryHandler";
export { default as PathHandler } from "./5-3-3-PathHandler";
export { default as PostHandler } from "./5-3-4-PostHandler";
export { default as PutDelete } from "./5-3-5-PutDelete";
export { default as ClientGet } from "./5-4-1-ClientGet";
export { default as ClientPost } from "./5-4-2-ClientPost";
export { default as ClientCrud } from "./5-4-3-ClientCrud";
export { default as ServerFetch } from "./5-5-1-ServerFetch";
export { default as ServerActionDemo } from "./5-6-1-ServerAction";

export const LAB5_INTERMEDIATES = [
  { slug: "5-2-1-HttpMethods", title: "5.2.1 HTTP Methods", file: "5-2-1-HttpMethods" },
  { slug: "5-2-2-StatusCodes", title: "5.2.2 Status Codes", file: "5-2-2-StatusCodes" },
  { slug: "5-3-1-GetHandler", title: "5.3.1 GET Handler", file: "5-3-1-GetHandler" },
  { slug: "5-3-2-QueryHandler", title: "5.3.2 Query Parameters", file: "5-3-2-QueryHandler" },
  { slug: "5-3-3-PathHandler", title: "5.3.3 Path Parameters", file: "5-3-3-PathHandler" },
  { slug: "5-3-4-PostHandler", title: "5.3.4 POST Handler", file: "5-3-4-PostHandler" },
  { slug: "5-3-5-PutDelete", title: "5.3.5 PUT and DELETE", file: "5-3-5-PutDelete" },
  { slug: "5-4-1-ClientGet", title: "5.4.1 Client GET", file: "5-4-1-ClientGet" },
  { slug: "5-4-2-ClientPost", title: "5.4.2 Client POST", file: "5-4-2-ClientPost" },
  { slug: "5-4-3-ClientCrud", title: "5.4.3 Client CRUD", file: "5-4-3-ClientCrud" },
  { slug: "5-5-1-ServerFetch", title: "5.5.1 Server Component Fetch", file: "5-5-1-ServerFetch" },
  { slug: "5-6-1-ServerAction", title: "5.6.1 Server Action", file: "5-6-1-ServerAction" },
] as const;
