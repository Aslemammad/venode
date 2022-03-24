export type Extension = ".ts" | ".js" | ".ts.map" | ".js.map" 

export type Meta = { hash: string; path: string };

export type Vendor = {
  imports: Record<string, string>;
}
