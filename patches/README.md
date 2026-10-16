# Patches

Applied automatically on `npm install` / `npm ci` via the `postinstall` script
(`patch-package`).

There are currently no patches. With none here `patch-package` reports "No
patch files found" and exits cleanly, so the hook stays in place for the next
dependency that needs one.

## Retired: `next+14.2.35.patch`

Removed with the upgrade to Next.js 15.5.28, which no longer needs it.

It fixed asset resolution in Next 14's bundled copy of `@vercel/og` 0.6.3
(`dist/compiled/@vercel/og/index.node.js`), which loaded its font and wasm
assets with:

```js
fs.readFileSync(fileURLToPath(join(import.meta.url, "../yoga.wasm")))
```

`path.join` was being applied to a `file://` **URL**, not a path. On Windows
that normalises the URL into a Windows path (collapsing the `//` and flipping
to backslashes), and the result is no longer a valid URL:

| Node | `join(...)` result | `fileURLToPath` |
| ---- | ------------------ | --------------- |
| 20   | `file:\C:\...\yoga.wasm`   | tolerated       |
| 24   | `.\file:\C:\...\yoga.wasm` | `ERR_INVALID_URL` |

Node 24 changed `path.win32.normalize` to prefix `.\`, which tipped this from
"accidentally works" into a hard failure: `TypeError: Invalid URL` while
prerendering `opengraph-image`, failing the whole build.

The patch swapped in the correct, platform- and Node-version-independent
idiom:

```js
fs.readFileSync(fileURLToPath(new URL("./yoga.wasm", import.meta.url)))
```

Next 15.5.28 bundles `@vercel/og` 0.7.2, which ships exactly that idiom
upstream for all three assets (`noto-sans-v27-latin-regular.ttf`, `yoga.wasm`,
`resvg.wasm`); no `join(import.meta.url, ...)` call is left in its
`index.node.js` or `index.edge.js`. Verified: `npm run build` on Node 26.12.0
prerenders `/en/opengraph-image` and `/ar/opengraph-image` with no patch
applied.

If Next is ever pinned back to 14.x, restore the patch from git history
(`git log --diff-filter=D -- 'patches/next+14.2.35.patch'`).
