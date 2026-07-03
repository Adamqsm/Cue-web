import { ImageResponse } from "next/og";

export const alt = "Cue — book restaurant tables in Amman, Jordan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social card shared across pages.
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
          background: "#14140F",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#26845F",
            }}
          />
          <div
            style={{
              color: "#A09E91",
              fontSize: "26px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Amman · Jordan
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#F4F3EE",
              fontSize: "78px",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            Book tables at Amman&#39;s
          </div>
          <div
            style={{
              color: "#43A57D",
              fontSize: "78px",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            best restaurants, instantly.
          </div>
          <div style={{ color: "#A09E91", fontSize: "30px", marginTop: "28px" }}>
            Reservations · group dining · split payments
          </div>
        </div>

        {/* wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "#F4F3EE",
              fontSize: "56px",
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            CUE
          </div>
          <div style={{ color: "#A09E91", fontSize: "26px" }}>cue-app.net</div>
        </div>
      </div>
    ),
    size
  );
}
