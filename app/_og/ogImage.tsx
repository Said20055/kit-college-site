import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { college } from "@/lib/college";

/**
 * Общий рендер карточки для соцсетей (Open Graph и Twitter).
 * Кириллица требует собственного шрифта — встроенный в Satori её не покрывает,
 * поэтому подключаем локально завендоренный PT Sans (assets/fonts).
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = college.fullName;

export async function renderOgImage() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/PTSans-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PTSans-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #0c2a4d 58%, #075985 100%)",
          padding: "72px 80px",
          fontFamily: "PT Sans",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              marginRight: 22,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              backgroundColor: "#0369a1",
              backgroundImage: "linear-gradient(135deg, #0f172a, #0369a1)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            КИТ
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>
              {college.abbr}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              Официальный сайт
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: -1,
            }}
          >
            {college.shortName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 31,
              marginTop: 22,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {college.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 23,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <div style={{ display: "flex" }}>Хасавюрт · Республика Дагестан</div>
          <div style={{ display: "flex" }}>kit-college.ru</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "PT Sans", data: regular, weight: 400, style: "normal" },
        { name: "PT Sans", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
