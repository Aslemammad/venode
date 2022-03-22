import { promises as fs } from "fs";
import { execa } from "execa";
import { test, expect, describe, beforeAll } from "vitest";
import { Meta } from "../../venode/src/types";

describe("", async () => {
  let stdout: string;
  beforeAll(async () => {
    try {
      await fs.rm("node_modules/https", { recursive: true });
      ({ stdout } = await execa("pnpm", ["venode", "index.ts"]));
    } catch {}
  });

  test("download imports", () => {
    expect(stdout).toContain("Download");
    expect(stdout).toContain("https://ga.jspm.io/npm:is-number@7.0.0/index.js");
  });
  test("download relative imports", () => {
    expect(stdout).toContain(
      "https://raw.githubusercontent.com/denoland/deno_std/main/_util/assert.ts"
    );
  });
  test("imports should work", () => {
    expect(stdout).toContain("Everything works well");
  });

  test("proper meta", async () => {
    const deepAssignMeta: Meta = JSON.parse(
      await fs.readFile(
        "./node_modules/https/raw.githubusercontent.com/814a483215a52bace789ce63efd72e42bff24720f62532913a7a59956276ffcc.meta",
        "utf-8"
      )
    );
    const assertMeta: Meta = JSON.parse(
      await fs.readFile(
        "./node_modules/https/raw.githubusercontent.com/433f39e91f7b51a3eb99934e40a709879e0b0be687d5144b83e7f1151514ed82.meta",
        "utf-8"
      )
    );
    const isNumberMeta: Meta = JSON.parse(
      await fs.readFile(
        "./node_modules/https/ga.jspm.io/fb5e61f675b6d1eeb66fb0e30b012e254c26d7478eeb3b3f79106a2d6ed094e2.meta",
        "utf-8"
      )
    );
    expect(deepAssignMeta.hash).toBe(
      "814a483215a52bace789ce63efd72e42bff24720f62532913a7a59956276ffcc"
    );
    expect(assertMeta.hash).toBe(
      "433f39e91f7b51a3eb99934e40a709879e0b0be687d5144b83e7f1151514ed82"
    );
    expect(isNumberMeta.hash).toBe(
      "fb5e61f675b6d1eeb66fb0e30b012e254c26d7478eeb3b3f79106a2d6ed094e2"
    );
  });

  test("cache should work", async () => {
    ({ stdout } = await execa("pnpm", ["venode", "index.ts"]));

    expect(stdout).not.toContain(
      "https://ga.jspm.io/npm:is-number@7.0.0/index.js"
    );
    expect(stdout).toContain("Everything works well");
  });
});
