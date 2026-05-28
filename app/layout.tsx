import type { Metadata } from "next";
import { Mochiy_Pop_One, Fredoka } from "next/font/google";
import "./globals.css";

const mochiy = Mochiy_Pop_One({
  weight: "400",
  variable: "--font-mochiy",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cada día una foto de ti ♡",
  description: "Una foto distinta cada día, para acordarme de ti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${mochiy.variable} ${fredoka.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
