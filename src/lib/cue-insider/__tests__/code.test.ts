import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import {
  CODE_ALPHABET,
  checksumChar,
  formatCode,
  generateCode,
  normalizeCodeInput,
  validateCode,
} from "../code";

// Deterministic byte stream (SHA-256 counter DRBG) so the collision and
// tamper-rejection suites are reproducible — no birthday-paradox flake.
function makeDrbg(seed: string): (n: number) => Uint8Array {
  let counter = 0;
  let pool = Buffer.alloc(0);
  return (n) => {
    while (pool.length < n) {
      pool = Buffer.concat([pool, createHash("sha256").update(`${seed}:${counter++}`).digest()]);
    }
    const out = pool.subarray(0, n);
    pool = pool.subarray(n);
    return out;
  };
}

const BANNED = /[O0I1L5S]/;
const CODE_RE = new RegExp(`^CUE-[${CODE_ALPHABET}]{4}-[${CODE_ALPHABET}]{4}$`);

describe("alphabet", () => {
  it("has exactly 29 distinct characters", () => {
    expect(CODE_ALPHABET).toHaveLength(29);
    expect(new Set(CODE_ALPHABET).size).toBe(29);
  });

  it("excludes the misread glyphs O/0/I/1/L/S/5", () => {
    expect(BANNED.test(CODE_ALPHABET)).toBe(false);
  });
});

describe("generateCode", () => {
  const drbg = makeDrbg("cue-insider-test-vectors-v1");
  const codes: { code: string; body: string }[] = [];
  for (let i = 0; i < 10_000; i++) codes.push(generateCode(drbg));

  it("produces 10,000 codes with zero collisions", () => {
    expect(new Set(codes.map((c) => c.body)).size).toBe(10_000);
  });

  it("never emits a banned glyph", () => {
    for (const { code } of codes) expect(BANNED.test(code)).toBe(false);
  });

  it("always matches CUE-XXXX-XXXX with alphabet characters only", () => {
    for (const { code, body } of codes) {
      expect(code).toMatch(CODE_RE);
      expect(formatCode(body)).toBe(code);
    }
  });

  it("every generated checksum validates", () => {
    for (const { code, body } of codes) {
      const v = validateCode(code);
      expect(v).toEqual({ ok: true, code, body });
    }
  });
});

describe("checksum error detection", () => {
  const drbg = makeDrbg("cue-insider-tamper-suite-v1");
  const sample = Array.from({ length: 200 }, () => generateCode(drbg).body);

  it("rejects every single-character substitution (exhaustive over 200 codes)", () => {
    for (const body of sample) {
      for (let pos = 0; pos < body.length; pos++) {
        for (const wrong of CODE_ALPHABET) {
          if (wrong === body[pos]) continue;
          const mutated = body.slice(0, pos) + wrong + body.slice(pos + 1);
          expect(validateCode(mutated).ok).toBe(false);
        }
      }
    }
  });

  it("rejects every adjacent transposition", () => {
    for (const body of sample) {
      for (let i = 0; i < body.length - 1; i++) {
        if (body[i] === body[i + 1]) continue;
        const swapped =
          body.slice(0, i) + body[i + 1] + body[i] + body.slice(i + 2);
        expect(validateCode(swapped).ok).toBe(false);
      }
    }
  });
});

describe("normalizeCodeInput", () => {
  it("uppercases and strips spaces and hyphens", () => {
    expect(normalizeCodeInput("ab cd-ef gh")).toBe("ABCDEFGH");
  });

  it("drops the CUE prefix in any case", () => {
    expect(normalizeCodeInput("CUE-ABCD-EFGH")).toBe("ABCDEFGH");
    expect(normalizeCodeInput("cueabcdefgh")).toBe("ABCDEFGH");
  });

  it("leaves bare bodies untouched", () => {
    expect(normalizeCodeInput("ABCDEFGH")).toBe("ABCDEFGH");
  });
});

describe("validateCode reasons", () => {
  it("invalid-length", () => {
    expect(validateCode("CUE-AAAA-AAG")).toEqual({ ok: false, reason: "invalid-length" });
    expect(validateCode("AAAAAAAAA")).toEqual({ ok: false, reason: "invalid-length" });
    expect(validateCode("")).toEqual({ ok: false, reason: "invalid-length" });
  });

  it("invalid-characters", () => {
    expect(validateCode("CUE-AAA0-AAAG")).toEqual({ ok: false, reason: "invalid-characters" });
    expect(validateCode("SAAAAAAA")).toEqual({ ok: false, reason: "invalid-characters" });
  });

  it("invalid-checksum", () => {
    expect(validateCode("CUE-AAAA-AAAG")).toEqual({ ok: false, reason: "invalid-checksum" });
  });
});

describe("contract doc §6 vectors", () => {
  // Kept in lockstep with docs/cue-insider-code-contract.md — the doc's original
  // vectors were wrong and were regenerated from this implementation.
  it("checksum characters behind the valid vectors", () => {
    expect(checksumChar("AAAAAAA")).toBe("A");
    expect(checksumChar("BBBBBBB")).toBe("3");
    expect(checksumChar("2346789")).toBe("3");
  });

  it("accepts the valid vectors in any input form", () => {
    expect(validateCode("CUE-AAAA-AAAA")).toEqual({
      ok: true,
      code: "CUE-AAAA-AAAA",
      body: "AAAAAAAA",
    });
    expect(validateCode("cue bbbb bbb3")).toEqual({
      ok: true,
      code: "CUE-BBBB-BBB3",
      body: "BBBBBBB3",
    });
    expect(validateCode("23467893")).toEqual({
      ok: true,
      code: "CUE-2346-7893",
      body: "23467893",
    });
  });

  it("rejects the invalid vectors for the documented reasons", () => {
    expect(validateCode("CUE-AAAA-AAAG")).toEqual({ ok: false, reason: "invalid-checksum" });
    expect(validateCode("CUE-AAAA-AAG")).toEqual({ ok: false, reason: "invalid-length" });
    expect(validateCode("CUE-AAA0-AAAG")).toEqual({ ok: false, reason: "invalid-characters" });
    expect(validateCode("CUE-ABCD-EFGH")).toEqual({ ok: false, reason: "invalid-checksum" });
  });
});
