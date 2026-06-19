import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";
import { TikTokPixel } from "@/components/TikTokPixel";
import { content } from "@/data/content";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const title = `${content.brand} — спортивные штаны со скидкой 50% | ${content.price} руб`;
const description =
  "Спортивные штаны: плотная мягкая ткань, 4 цвета, все размеры. Бесплатная доставка по Беларуси, оплата при получении. Сегодня — 59.99 руб вместо 120.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#3b5bff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <TikTokPixel />
        {children}
      </body>
    </html>
  );
}
