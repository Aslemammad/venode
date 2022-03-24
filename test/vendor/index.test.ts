import { posix as path } from "path";
import { promises as fs } from "fs";
import { execa } from "execa";
import { test, expect, describe } from "vitest";

describe("", async () => {
  let vendorStdout: string;

  let runStdout: string;
  try {
    try {
      await fs.rm(path.join(".", "node_modules", "https"), { recursive: true });
      await fs.rm(path.join(".", "vendor"), { recursive: true });
    } catch (e) {
      console.log(e);
    }
    vendorStdout = (
      await execa("pnpm", ["venode", "vendor", "index.ts"], { stdout: "pipe" })
    ).stdout;
    try {
      await fs.rm(path.join(".", "node_modules", "https"), { recursive: true });
    } catch (e) {
      console.log(e);
    }
    runStdout = (
      await execa(
        "pnpm",
        ["venode", "index.ts", "--import-map=vendor/import_map.json"],
        { stdout: "pipe" }
      )
    ).stdout;
  } catch (e) {
    console.log("error", e);
  }

  test("vendor works", () => {
    expect(vendorStdout).toContain("Download");
    expect(vendorStdout).toContain("To use vendored modules");
  });
  test("app should not download anything anymore", () => {
    expect(runStdout).not.toContain("Download");
  });
  test("app should work", () => {
    expect(runStdout).toContain("Everything works well");
  });
  test("imports should work", async () => {
    const importMap = JSON.parse(
      await fs.readFile(path.join("vendor", "import_map.json"), "utf8")
    );
    expect(importMap).toEqual({
      imports: {
        picocolors: "picocolors/picocolors.browser.js",
        "https://ga.jspm.io/npm:is-number@7.0.0/index.js":
          "ga.jspm.io/npm_is-number@7.0.0/index.js",
        "https://raw.githubusercontent.com/denoland/deno_std/main/_util/deep_assign.ts":
          "raw.githubusercontent.com/denoland/deno_std/main/_util/deep_assign.ts",
        "https://raw.githubusercontent.com/denoland/deno_std/main/_util/assert.ts":
          "raw.githubusercontent.com/denoland/deno_std/main/_util/assert.ts",
      },
    });
  });
});
