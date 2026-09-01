export { default as Environment } from "./5-2-1-Environment";
export { default as PathParameters } from "./5-2-2-1-PathParameters";
export { default as QueryParameters } from "./5-2-2-2-QueryParameters";
export { default as WorkingWithObjects } from "./5-2-3-WorkingWithObjects";
export { default as WorkingWithArrays } from "./5-2-4-WorkingWithArrays";
export { default as HttpClient } from "./5-2-5-HttpClient";
export { default as WorkingWithObjectsAsynchronously } from "./5-2-5-WorkingWithObjectsAsync";
export { default as WorkingWithArraysAsynchronously } from "./5-2-6-WorkingWithArraysAsync";
export { default as HelloRoute } from "./5-3-1-HelloRoute";
export { default as CalculatorNextWebApiClient } from "./5-3-1-Calculator";

export const LAB5_INTERMEDIATES = [
  { slug: "5-2-1-Environment", title: "5.2.1 Environment", file: "5-2-1-Environment" },
  { slug: "5-2-2-1-PathParameters", title: "5.2.2.1 Path Parameters", file: "5-2-2-1-PathParameters" },
  { slug: "5-2-2-2-QueryParameters", title: "5.2.2.2 Query Parameters", file: "5-2-2-2-QueryParameters" },
  { slug: "5-2-3-WorkingWithObjects", title: "5.2.3 Working With Objects", file: "5-2-3-WorkingWithObjects" },
  { slug: "5-2-4-WorkingWithArrays", title: "5.2.4 Working With Arrays", file: "5-2-4-WorkingWithArrays" },
  { slug: "5-2-5-HttpClient", title: "5.2.5 HTTP Client", file: "5-2-5-HttpClient" },
  { slug: "5-2-5-WorkingWithObjectsAsync", title: "5.2.5.5 Objects Async", file: "5-2-5-WorkingWithObjectsAsync" },
  { slug: "5-2-6-WorkingWithArraysAsync", title: "5.2.6 Arrays Async", file: "5-2-6-WorkingWithArraysAsync" },
  { slug: "5-3-1-HelloRoute", title: "5.3 Next.js Hello Route", file: "5-3-1-HelloRoute" },
  { slug: "5-3-1-Calculator", title: "5.3.1 Next.js Calculator", file: "5-3-1-Calculator" },
] as const;
