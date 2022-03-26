import { posix as path } from "path";
import log from "consola";
import { existsSync } from "fs";

const argv = process.argv;

type Args = {
  script: string;
  importMap: string;
  isVendor: boolean;
};
const args: Args = { script: "", isVendor: false, importMap: "" };

export const validateArgs = () => {
  const vendor = argv.findIndex((arg) => arg === "vendor");
  // vendor
  if (vendor > -1) {
    args.isVendor = true;
    args.script = process.argv[vendor + 1];
  }
  // run
  if (!args.script) {
    args.isVendor = false;
    const importMap = argv.findIndex((arg) => arg.includes("--import-map="));
    log.log(importMap);
    if (importMap > -1) {
      args.script = argv[importMap - 1];
      args.importMap = argv[importMap].split("=")[1];
    }
    args.script ||= argv[argv.length - 1];
  }
  if (args.importMap) {
    !existsSync(args.importMap) && log.error("--import-map value not found ");
  }
  !existsSync(args.script) && log.error("script not found");

  args.script = path.resolve(args.script);

  return args;
};
