import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

/**
 * Apple touch icon — monograma S&O en paleta de la invitación.
 */
export default function AppleIcon() {
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
          color: "#4B443D",
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 28,
            background: "#EDE3D5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          S&O
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
