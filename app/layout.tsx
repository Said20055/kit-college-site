import type { Metadata } from "next";
import { PT_Serif, PT_Sans } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/college";
import { getCollege } from "@/lib/data/college";

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["cyrillic", "latin"],
  variable: "--font-pt-serif",
  display: "swap",
});

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["cyrillic", "latin"],
  variable: "--font-pt-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const college = await getCollege();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${college.shortName} — официальный сайт`,
      template: `%s — ${college.shortName}`,
    },
    description: college.description,
    keywords: [
      "колледж",
      "СПО",
      "Хасавюрт",
      "Дагестан",
      "программирование",
      "информационные технологии",
      "поступить в колледж",
    ],
    openGraph: {
      type: "website",
      locale: "ru_RU",
      title: `${college.fullName}`,
      description: college.description,
      siteName: college.shortName,
    },
    twitter: {
      card: "summary_large_image",
      title: college.fullName,
      description: college.description,
    },
    robots: { index: true, follow: true },
  };
}

// Применение настроек версии для слабовидящих до отрисовки (без мелькания).
const a11yInit = `(function(){try{var s=localStorage.getItem('kit-a11y');if(!s)return;var o=JSON.parse(s);if(!o||!o.enabled)return;var e=document.documentElement;e.setAttribute('data-a11y','on');e.setAttribute('data-a11y-theme',o.theme||'white');e.setAttribute('data-a11y-images',o.images||'on');var f=({normal:'1',large:'1.25',xlarge:'1.5'})[o.font||'large'];e.style.setProperty('--a11y-font-scale',f);e.style.setProperty('--a11y-letter-spacing',o.kerning==='wide'?'0.14em':'normal');}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${ptSerif.variable} ${ptSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: a11yInit }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
