import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CADO Building Products | Premium Tile Adhesives & Construction Chemicals",
  description: "High-performance CADO tile adhesives, construction chemicals, sealants, grouts, and building materials for stronger, lasting spaces.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white text-[#191919]">
        {children}
      </body>
    </html>
  );
}

