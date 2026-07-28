import { ImageResponse } from "next/og";

export const alt = "Cue — book restaurant tables in Amman, Jordan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social card — v4 "The White City at Night":
// limestone ground, night ink, one bougainvillea mark.
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
          background: "#E7E1D4",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        {/* running head row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "3px solid #1F242C",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              color: "#1F242C",
              fontSize: "26px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            Restaurant reservations · Amman
          </div>
          {/* Latin-only here on purpose: the bundled OG renderer ships no
              Arabic font, and a request-time Google Fonts fetch can tofu.
              Localized AR cards need an embedded font first. */}
          <div style={{ color: "#545A63", fontSize: "26px" }}>Amman · Jordan</div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#1F242C",
              fontSize: "92px",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
            }}
          >
            Where Amman eats tonight.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "14px",
                height: "14px",
                borderRadius: "9999px",
                background: "#C2385F",
              }}
            />
            <div
              style={{
                color: "#545A63",
                fontSize: "30px",
                fontFamily: "sans-serif",
              }}
            >
              The guide · instant confirmations · group nights
            </div>
          </div>
        </div>

        {/* wordmark row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid #1F242C",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              color: "#1F242C",
              fontSize: "56px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              fontFamily: "sans-serif",
            }}
          >
            CUE
          </div>
          <div style={{ color: "#545A63", fontSize: "26px", fontFamily: "sans-serif" }}>
            cue-app.net
          </div>
        </div>
      </div>
    ),
    size
  );
}
