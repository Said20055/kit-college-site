import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const bold = await readFile(
    join(process.cwd(), "assets/fonts/PTSans-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage: "linear-gradient(135deg, #0f172a, #0369a1)",
          color: "#ffffff",
          fontFamily: "PT Sans",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        КИТ
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "PT Sans", data: bold, weight: 700, style: "normal" }],
    },
  );
}
