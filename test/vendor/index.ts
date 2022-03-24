// vendor should support local modules and network modules
import './another.ts'
import c from 'picocolors'
import isNumber from "https://ga.jspm.io/npm:is-number@7.0.0/index.js";
import { deepAssign } from "https://raw.githubusercontent.com/denoland/deno_std/main/_util/deep_assign.ts";

console.log(c, isNumber, deepAssign)
console.log("Everything works well");
