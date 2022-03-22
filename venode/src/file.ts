// functions/tests are from deno/cli/http_cache.rs
import { posix as path } from "path";
import { createHash } from "crypto";
import assert from "assert";
import { Extension } from "./types";

function baseUrlToFilename({ protocol, host, hostname, port }: URL) {
  switch (protocol) {
    case "blob:":
    case "data:":
      return protocol.replace(":", "/");
    case "http:":
    case "https:":
      return (
        protocol.replace(":", "/") + (port ? `${hostname}_PORT${port}` : host)
      );
    default:
      assert(false, `unexpected protocol ${protocol}`);
  }
}

const cache = new Map<string, string>();

export function urlToFilename(url: URL): string {
  if (cache.has(url.href)) {
    return cache.get(url.href) as string;
  }

  const filename = baseUrlToFilename(url);

  const hash = createHash("sha256")
    .update(url.pathname + url.search)
    .digest("hex");

  const value = path.join(filename, hash);

  cache.set(url.href, value);

  return value;
}

export function filenameWithExtension(url: URL, ext: Extension) {
  return urlToFilename(url) + ext;
}

const extensions = [".js", ".js.map", ".ts", ".ts.map"];

export function isValidExtension(ext: string) {
  return extensions.includes(ext);
}

export function resolveExtension(id: string): Extension | undefined {
  if (id.endsWith(".js.map")) {
    return ".js.map";
  } else if (id.endsWith(".js")) {
    return ".js";
  } else if (id.endsWith(".ts.map")) {
    return ".ts.map";
  } else if (id.endsWith(".ts")) {
    return ".ts";
  }
}
