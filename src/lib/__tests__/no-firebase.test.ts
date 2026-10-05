import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// WEB-5: every route talks to the Cue API; Firebase must not creep back in.
const root = join(__dirname, "../../..");
const CODE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;

function codeFiles(dir: string, recurse = true): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? recurse && e.name !== "node_modules" && !e.name.startsWith(".")
        ? codeFiles(join(dir, e.name))
        : []
      : CODE.test(e.name)
        ? [join(dir, e.name)]
        : []
  );
}

// Root config files (next.config.mjs, vitest.config.ts...) plus src/ and scripts/.
const files = [...codeFiles(root, false), ...codeFiles(join(root, "src")), ...codeFiles(join(root, "scripts"))];
const offenders = (re: RegExp) => files.filter((f) => re.test(readFileSync(f, "utf8")));

describe("no Firebase", () => {
  it("is not a dependency", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(deps.filter((d) => /firebase/i.test(d))).toEqual([]);
  });

  it("is imported or required by no source file, script or config", () => {
    // Static, side-effect and dynamic imports and require() of firebase, firebase-admin or @firebase/*.
    expect(
      offenders(/(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["'](?:@firebase\/|firebase(?:-admin)?(?:\/|["']))/)
    ).toEqual([]);
  });

  it("reads none of the retired env vars", () => {
    expect(
      offenders(
        /process\.env\.(?:(?:NEXT_PUBLIC_)?FIREBASE_|FIRESTORE_|GOOGLE_APPLICATION_CREDENTIALS|CUE_BACKEND|CUE_INSIDER_IP_HASH_SALT|LEAD_WEBHOOK_URL|TURNSTILE_SECRET_KEY)/
      )
    ).toEqual([]);
  });
});
