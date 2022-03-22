import mkdirp from "mkdirp";
import { promises as fs } from "fs";
import mime from "mime-types";
import path from "path";
import c from "picocolors";
import { fetch } from "undici";
import { createServer } from "vite";
import { ViteNodeServer } from "vite-node/server";
import { ViteNodeRunner } from "vite-node/client";
import {
  filenameWithExtension,
  isValidExtension,
  resolveExtension,
  urlToFilename,
} from "./file";
import { Extension, Meta } from "./types";

(async () => {
  const handledModules = new Map<string, string>();

  const server = await createServer({
    plugins: [
      {
        enforce: "pre",
        name: "venode:pre",
        resolveId(id, importer) {
          if (!id.startsWith(".")) return null;
          const module = [...handledModules.entries()].find(
            (item) => item[1] === importer
          );
          if (!module) {
            return null;
          }
          const { pathname, href } = new URL(module[0]);

          const newId = path.join(path.dirname(pathname), id);
          console.log("newId", newId);

          return href.replace(pathname, newId);
        },
      },
      {
        enforce: "pre",
        name: "venode",
        async resolveId(id, importer) {
          console.log("resolveId", id, importer);
          if (!id.startsWith("http")) {
            return null;
          }
          if (handledModules.has(id)) {
            return { id: handledModules.get(id) as string, external: false };
          }

          const url = new URL(id);
          const meta = path.join(dest, urlToFilename(url) + ".meta");

          let metaContent: Meta | undefined;
          try {
            metaContent = JSON.parse(await fs.readFile(meta, "utf8"));
          } catch {}
          if (metaContent) {
            handledModules.set(id, metaContent.path);
            return { id: metaContent.path, external: false };
          }

          console.log(c.green(`Download ${c.reset(id)}`));
          try {
            debugger;
            const res = await fetch(id);
            const mimeExtension = mime.extension(
              res.headers.get("content-type") || ""
            );
            const ext = resolveExtension(url.href) || "." + mimeExtension;

            if (!isValidExtension(ext)) {
              throw new Error(`Unknown extension for ${id}`);
            }
            const filename = filenameWithExtension(url, ext as Extension);
            const text = await res.text();

            const destFilename = path.join(dest, filename);

            await mkdirp(path.dirname(destFilename));
            await fs.writeFile(destFilename, text);
            await fs.writeFile(
              meta,
              JSON.stringify({
                path: destFilename,
                hash: path.basename(urlToFilename(url)),
              })
            );
            handledModules.set(id, destFilename);
            return { id: destFilename, external: false };
          } catch (e) {
            console.error(c.red("Failed"), id, e);
            process.exit(1);
          }
        },
      },
    ],
  });
  await server.pluginContainer.buildStart({});

  const dest = path.join(server.config.root, "node_modules");

  const node = new ViteNodeServer(server as any);

  const runner = new ViteNodeRunner({
    root: server.config.root,
    base: server.config.base,
    async fetchModule(id) {
      return node.fetchModule(id);
    },
    async resolveId(id, importer) {
      return node.resolveId(id, importer);
    },
  });

  await runner.executeFile("./index.ts");

  await server.close();
})();
