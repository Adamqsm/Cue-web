import { ImageResponse } from "next/og";

export const alt = "Cue — book restaurant tables in Amman, Jordan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social card shared across pages — v5.1 neutral-first tokens
// (docs/design-tokens-v5.md): neutral off-white ground, near-black ink,
// queue blue accent, confirm green dot.
export default function OgImage() {
  return new ImageResponse(
    (
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
              background: "#34D399",
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
    ),
    size
  );
}
