import { ImageResponse } from "next/og";

export const config = {
  runtime: "edge",
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "BSPrep Blogs";
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1f3a5f",
          padding: "70px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#7491a8",
            letterSpacing: 2,
          }}
        >
          <span style={{ display: "flex", color: "#efe9dd", marginRight: 8 }}>&lt;</span>
          <span style={{ display: "flex" }}>BSPREP BLOGS</span>
          <span style={{ display: "flex", color: "#efe9dd", marginLeft: 8 }}>/&gt;</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            color: "#faf8f5",
            lineHeight: 1.25,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 24,
                color: "#1f3a5f",
                background: "#efe9dd",
                padding: "8px 24px",
                borderRadius: 999,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    }
  );
}
