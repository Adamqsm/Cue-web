import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { ImageResponse } from "next/og";
import { locales, isLocale } from "@/i18n/config";

export const alt = "Cue — book restaurant tables in Amman, Jordan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Bake both cards at build time. This matters beyond speed: the Arabic
// card reads its font files from assets/fonts/, and Next's bundled
// output defeats @vercel/nft's static analysis of that read (verified:
// the .nft.json for this route omits the .ttf files), so an on-demand
// render on Vercel would 500 with ENOENT. Prerendering keeps the file
// read at build time, where the repo files are guaranteed to exist.
export const dynamic = "force-static";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Branded social card shared across pages — v5.4 neutral-first tokens
// (docs/design-tokens-v5.md): neutral off-white ground, near-black ink,
// queue blue accent, terracotta dot (#C86B4A, the spark base — 3.56:1 on
// the #FAFAFA card, so no darker deviation is needed the way olive's pale
// fill needed one).
//
// Two locale variants. The English card keeps next/og's bundled default
// font and must stay exactly as it was; the Arabic card registers Cairo
// (the renderer's default font is Latin-only, so without this the /ar
// preview showed the English card) and mirrors the layout RTL by hand.

// Cairo static instances (assets/fonts/, OFL). satori — next/og's layout
// engine — cannot read the variable TTF that next/font serves the pages
// with, so the card uses Google's static 400/700 cuts of the same family.
// Loaded lazily and cached so the /en card never touches the filesystem.
type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
};
let cairoFonts: Promise<OgFont[]> | null = null;
function loadCairoFonts() {
  cairoFonts ??= Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Cairo-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Cairo-Bold.ttf")),
  ]).then(([regular, bold]) => [
    { name: "Cairo", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Cairo", data: bold, weight: 700 as const, style: "normal" as const },
  ]);
  return cairoFonts;
}

// satori cannot lay out a multi-word RTL text run: words come out
// misordered or with broken gaps (pixel-verified — its engine shapes
// single Arabic words correctly but not run reordering/spacing). So each
// word renders as its own flex box, hand-reversed into visual order, in a
// plain `row` with a fixed gap. Every word box needs display:flex — bare
// children silently merge back into one text run and hit the broken path.
function ArLine({
  words,
  gap,
  style,
}: {
  /** Words in logical (reading) order; rendered right-to-left. */
  words: string[];
  /** Inter-word gap in px (≈0.25em of the font size). */
  gap: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", gap: `${gap}px`, ...style }}
    >
      {[...words].reverse().map((w, i) => (
        <div key={i} style={{ display: "flex" }}>
          {w}
        </div>
      ))}
    </div>
  );
}

// Arabic copy — headline mirrors src/i18n/content/ar.ts home.hero
// (titleTop/titleAccent); keep in sync if the hero copy changes. The
// services line composes the card's three offers from the dictionary's
// own vocabulary (meta.description / hero.subtitle). ".Cue" is the
// sentence-final period pre-mirrored: the token is pure Latin so satori
// draws it LTR, and the period of "انضم إلى Cue." must land at the
// visual far left. Arabic is never letter-spaced, headings are 700 with
// a taller line box (globals.css RTL rules).
function arCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#FAFAFA",
        padding: "72px",
        fontFamily: "Cairo",
      }}
    >
      {/* top row — mirrored: ticket dot hugs the right edge */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <ArLine
          words={["عمّان", "·", "الأردن"]}
          gap={7}
          style={{ color: "#555D6B", fontSize: "26px" }}
        />
        <div
          style={{
            display: "flex",
            width: "18px",
            height: "18px",
            borderRadius: "9999px",
            background: "#C86B4A",
          }}
        />
      </div>

      {/* headline — the queue tagline, right-aligned */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <ArLine
          words={["لا", "تنتظر", "في", "الطابور."]}
          gap={19}
          style={{
            color: "#161A23",
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.28,
          }}
        />
        <ArLine
          words={["انضم", "إلى", ".Cue"]}
          gap={19}
          style={{
            color: "#1465EB",
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.28,
          }}
        />
        <ArLine
          words={["حجوزات", "المطاعم", "·", "خطط", "جماعية", "·", "تقسيم", "الدفعات"]}
          gap={8}
          style={{ color: "#555D6B", fontSize: "30px", marginTop: "20px" }}
        />
      </div>

      {/* wordmark row — mirrored: CUE right, domain left. The Latin
          wordmark keeps its tracking (only Arabic script is never
          letter-spaced). */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", color: "#555D6B", fontSize: "26px" }}>
          cue-app.net
        </div>
        <div
          style={{
            display: "flex",
            color: "#161A23",
            fontSize: "56px",
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          CUE
        </div>
      </div>
    </div>
  );
}

function enCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#FAFAFA",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      {/* top row — ticket dot + place */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            width: "18px",
            height: "18px",
            borderRadius: "9999px",
            background: "#C86B4A",
          }}
        />
        <div
          style={{
            color: "#555D6B",
            fontSize: "26px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Amman · Jordan
        </div>
      </div>

      {/* headline — the queue tagline */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#161A23",
            fontSize: "82px",
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
          }}
        >
          Don&#39;t wait in the queue.
        </div>
        <div
          style={{
            color: "#1465EB",
            fontSize: "82px",
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
          }}
        >
          Join the Cue.
        </div>
        <div style={{ color: "#555D6B", fontSize: "30px", marginTop: "28px" }}>
          Restaurant reservations · group dining · split payments
        </div>
      </div>

      {/* wordmark row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#161A23",
            fontSize: "56px",
            fontWeight: 800,
            letterSpacing: "0.12em",
          }}
        >
          CUE
        </div>
        <div style={{ color: "#555D6B", fontSize: "26px" }}>cue-app.net</div>
      </div>
    </div>
  );
}

export default async function OgImage({
  params,
}: {
  params: { locale: string };
}) {
  if (isLocale(params.locale) && params.locale === "ar") {
    return new ImageResponse(arCard(), {
      ...size,
      fonts: await loadCairoFonts(),
    });
  }
  // English (and any unknown locale) — unchanged: no fonts option, so the
  // renderer keeps its bundled default face exactly as before.
  return new ImageResponse(enCard(), size);
}
