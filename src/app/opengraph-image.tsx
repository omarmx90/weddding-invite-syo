import { ImageResponse } from "next/og";
import { wedding } from "@/content/wedding";

export const alt = "Silvia & Omar — Nos casamos — 16 · 10 · 2026";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Social preview editorial para WhatsApp, iMessage y redes.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FCFAF7",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: "1px solid #D6C2A6",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 80px",
          }}
        >
          <div
            style={{
              width: 48,
              height: 1,
              background: "#A99076",
              marginBottom: 40,
              display: "flex",
            }}
          />

          <div
            style={{
              fontSize: 84,
              fontWeight: 500,
              color: "#4B443D",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textAlign: "center",
              display: "flex",
            }}
          >
            {wedding.couple.displayName}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              fontWeight: 500,
              color: "#7A7268",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {wedding.copy.tagline}
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: 30,
              fontWeight: 400,
              color: "#4B443D",
              letterSpacing: "0.18em",
              display: "flex",
            }}
          >
            {wedding.date.display}
          </div>

          <div
            style={{
              width: 48,
              height: 1,
              background: "#A99076",
              marginTop: 44,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
