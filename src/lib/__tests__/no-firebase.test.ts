import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// WEB-5: every route talks to the Cue API; Firebase must not creep back in.
const root = join(__dirname, "../../..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? sourceFiles(join(dir, e.name)) : /\.(ts|tsx|mjs|js)$/.test(e.name) ? [join(dir, e.name)] : []
  );
}

describe("no Firebase", () => {
  it("is not a dependency", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(deps.filter((d) => /firebase/i.test(d))).toEqual([]);
  });

  it("is imported by no source file or script", () => {
    const importers = [...sourceFiles(join(root, "src")), ...sourceFiles(join(root, "scripts"))].filter((f) =>
      /from\s+["'](@?firebase|firebase-admin)[/"']|import\(["'](@?firebase|firebase-admin)[/"']/.test(readFileSync(f, "utf8"))
    );
    expect(importers).toEqual([]);
  });

  it("reads no Firebase env var", () => {
    const readers = [...sourceFiles(join(root, "src")), join(root, "next.config.mjs")].filter((f) =>
      /(FIREBASE|FIRESTORE)_[A-Z_]+/.test(readFileSync(f, "utf8"))
    );
    expect(readers).toEqual([]);
  });
});
