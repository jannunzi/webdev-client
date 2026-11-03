"use strict";

/* eslint-disable @typescript-eslint/no-require-imports -- webpack/turbopack loaders are CommonJS. */
require("tsx/cjs");
const { transformForBuild } = require("./transform.ts");

/**
 * Turbopack and webpack loader. Stamps source locators into book prose and
 * lecture decks. Failures leave the original module in place.
 */
module.exports = function inlineEditLoader(source) {
  const file = this && this.resourcePath ? String(this.resourcePath) : "";
  try {
    return transformForBuild(String(source), file);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (this && typeof this.emitWarning === "function") {
      this.emitWarning(new Error(`inline-edit: ${message}`));
    }
    return String(source);
  }
};
