import path from 'path';
import { expect, test } from "vitest";
import { filenameWithExtension, urlToFilename } from "./file";
import { Extension } from "./types";

const isWindows = process.platform === "win32";

const cases = [
  [
    "https://deno.land/x/foo.ts",
    "https/deno.land/2c0a064891b9e3fbe386f5d4a833bce5076543f5404613656042107213a7bbc8",
  ],
  [
    "https://deno.land:8080/x/foo.ts",
    "https/deno.land_PORT8080/2c0a064891b9e3fbe386f5d4a833bce5076543f5404613656042107213a7bbc8",
  ],
  [
    "https://deno.land/",
    "https/deno.land/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1",
  ],
  [
    "https://deno.land/?asdf=qwer",
    "https/deno.land/e4edd1f433165141015db6a823094e6bd8f24dd16fe33f2abd99d34a0a21a3c0",
  ],
  // should be the same as case above, fragment (#qwer) is ignored
  // when hashing
  [
    "https://deno.land/?asdf=qwer#qwer",
    "https/deno.land/e4edd1f433165141015db6a823094e6bd8f24dd16fe33f2abd99d34a0a21a3c0",
  ],
  [
    "data:application/typescript;base64,ZXhwb3J0IGNvbnN0IGEgPSAiYSI7CgpleHBvcnQgZW51bSBBIHsKICBBLAogIEIsCiAgQywKfQo=",
    "data/c21c7fc382b2b0553dc0864aa81a3acacfb7b3d1285ab5ae76da6abec213fb37",
  ],
  [
    "data:text/plain,Hello%2C%20Deno!",
    "data/967374e3561d6741234131e342bf5c6848b70b13758adfe23ee1a813a8131818",
  ],
];

test("hashing/url-to-file should be compatible with deno", () => {
  for (const [url, expected] of cases) {
    expect(urlToFilename(new URL(url))).toEqual(expected);
  }
});

const exts = [
  [
    "http://deno.land/std/http/file_server.ts",
    ".js",
    "http/deno.land/d8300752800fe3f0beda9505dc1c3b5388beb1ee45afd1f1e2c9fc0866df15cf.js",
  ],
  [
    "http://deno.land/std/http/file_server.ts",
    ".js.map",
    "http/deno.land/d8300752800fe3f0beda9505dc1c3b5388beb1ee45afd1f1e2c9fc0866df15cf.js.map",
  ],
];

test("get file with extension", () => {
  for (const [url, ext, expected] of exts) {
    expect(filenameWithExtension(new URL(url), ext as Extension)).toEqual(expected.split(path.posix.sep).join(path.sep));
  }
});
