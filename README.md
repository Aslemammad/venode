
<p align="center">
<img src="https://user-images.githubusercontent.com/37929992/160231026-e3e79440-fc20-4f5d-a3b2-21ccc2674148.png" width="200px" height="100px">
</p>
  
<h1 align="center">
Venode
</h1>
<p align="center">
The missing child of Node.js and Deno.
<p>
<p align="center">
  <a href="https://www.npmjs.com/package/venode"><img src="https://img.shields.io/npm/v/venode?color=a1b858&label="></a>
<p>
<br>
Venode is a node runner that supports deno features like vendoring and http imports!

## Features

- Javascript/Typescript http imports
- Vendor dependencies
- Out-of-box TypeScript / JSX support
- Built on top of Vite
- Node >= 14

### Http imports
You can easily import javascript/typescript code from the web!
```ts
// index.ts
import { assert } from "https://raw.githubusercontent.com/denoland/deno_std/main/_util/assert.ts";

console.log("here is deno assert function in node:", assert);
```
In your terminal:
```bash
> venode index.ts
ℹ Download https://raw.githubusercontent.com/denoland/deno_std/main/_util/assert.ts
here is deno assert function in node: [Function: assert]
```
### Vendor
Vendoring packages is possible, so your app would be able to rely on the same code all the time! 
```bash
> venode vendor index.ts
ℹ Download https://raw.githubusercontent.com/denoland/deno_std/main/_util/assert.ts
✔ To use vendored modules, specify the --import-map flag: venode --import-map=vendor/import_map.json
```
> The `vendor` directory should be checked into the version control, so you (your team) use the same dependencies all the time!
 
Now you can specify the `vendor/import_map.json` as the import map in venode:
```bash
> venode index.ts --import-map=vendor/import_map.json
✔ Reading modules from vendor/import_map.json
here is deno assert function in node: [Function: assert]
```
Read more about vendoring in deno's [release notes](https://deno.com/blog/v1.19#deno-vendor). 

# Contributing
Feel free to create issues for the bugs or features you want. 

# Credits
[vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node)
  
[deno](https://deno.land/)
  
[mlly](https://github.com/unjs/mlly/)
  
[consola](https://github.com/unjs/consola)
  
[undici](https://undici.nodejs.org/)
