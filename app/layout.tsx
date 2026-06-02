import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

/* ============================================
   Google Fonts Setup
   - Playfair Display: serif, editorial, poetic headings
   - Inter: clean sans-serif for body/UI text
   ============================================ */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

/* ============================================
   SEO Metadata
   ============================================ */
export const metadata: Metadata = {
  title: "A Letter For You — Digital Love Letter",
  description:
    "A cinematic, emotionally intimate digital letter. Some words are easier to feel than to say.",
  openGraph: {
    title: "A Letter For You — Digital Love Letter",
    description:
      "A cinematic, emotionally intimate digital letter. Some words are easier to feel than to say.",
    type: "website",
  },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
