# Patches

Applied automatically on `npm install` / `npm ci` via the `postinstall` script
(`patch-package`).

## `next+14.2.35.patch`

Fixes asset resolution in Next's bundled copy of `@vercel/og` 0.6.3
(`dist/compiled/@vercel/og/index.node.js`).

Upstream loads its font and wasm assets with:

```js
fs.readFileSync(fileURLToPath(join(import.meta.url, "../yoga.wasm")))
```

`path.join` is being applied to a `file://` **URL**, not a path. On Windows
that normalises the URL into a Windows path — collapsing the `//` and flipping
to backslashes — and the result is no longer a valid URL:

| Node | `join(...)` result | `fileURLToPath` |
| ---- | ------------------ | --------------- |
| 20   | `file:\C:\...\yoga.wasm`   | tolerated       |
| 24   | `.\file:\C:\...\yoga.wasm` | `ERR_INVALID_URL` |

Node 24 changed `path.win32.normalize` to prefix `.\`, which is what tips this
from "accidentally works" into a hard failure. The symptom is
`TypeError: Invalid URL` while prerendering `opengraph-image`, which fails the
whole build — previously worked around by building under Node 20, or by moving
`src/app/[locale]/opengraph-image.tsx` aside.

The patch swaps in the correct idiom, which is both platform- and
Node-version-independent:

```js
fs.readFileSync(fileURLToPath(new URL("./yoga.wasm", import.meta.url)))
```

Note the `./`, not `../`: `path.join` treated the URL as a directory and let
`..` pop the filename, whereas `new URL` already resolves relative to the
containing directory.

Verified: `npm run build` succeeds on both Node 20.18.1 and Node 24.18.0 with
the `opengraph-image` route in place, and the generated EN/AR cards are
byte-identical to the pre-patch Node 20 output.
