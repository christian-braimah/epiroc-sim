import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Epiroc Sim",
  description: "Epiroc Sim",
};

const gabarito = Gabarito({
  variable: "--font-gabarito",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gabarito.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
