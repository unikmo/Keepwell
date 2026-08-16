import { ImageResponse } from "next/og";

export const alt = "Trusted Locksmith — vetted local locksmiths with upfront prices";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B2341",
          color: "#F5F8FC",
          padding: "72px 82px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 999,
            right: -120,
            top: -210,
            background: "rgba(141,183,227,.16)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, fontWeight: 700 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              border: "1px solid rgba(141,183,227,.38)",
              background: "#173E6B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D6AD57",
              fontSize: 29,
            }}
          >
            ●
          </div>
          <span>Trusted Locksmith</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 930 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.02, letterSpacing: "-2.2px", fontWeight: 650 }}>
            <span>Find a trusted locksmith</span>
            <span style={{ color: "#D6AD57" }}>near you.</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.4, color: "#B8C7DA" }}>
            <span>Vetted local locksmiths. Upfront prices.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, fontSize: 20, color: "#B8C7DA" }}>
          <span>Lockouts</span><span>·</span><span>Rekeys</span><span>·</span><span>Lock changes</span><span>·</span><span>Smart locks</span>
        </div>
      </div>
    ),
    size,
  );
}
