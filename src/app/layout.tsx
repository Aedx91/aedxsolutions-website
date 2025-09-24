import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AedxSolutions — Tecnología y Soluciones Modernas",
    template: "%s | AedxSolutions",
  },
  description:
    "Portafolio y tarjeta de presentación de AedxSolutions: desarrollo web moderno, soluciones cloud y consultoría.",
  metadataBase: new URL("https://aedxsolutions.com"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "AedxSolutions — Tecnología y Soluciones Modernas",
    description:
      "Desarrollo web, cloud y consultoría. Resultados rápidos, seguros y modernos.",
    url: "https://aedxsolutions.com",
    siteName: "AedxSolutions",
    images: [
      {
        url: "/logo.avif",
        width: 512,
        height: 512,
        alt: "AedxSolutions Logo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AedxSolutions — Tecnología y Soluciones Modernas",
    description:
      "Desarrollo web, cloud y consultoría. Resultados rápidos, seguros y modernos.",
    images: ["/logo.avif"],
    site: "@aedxsolutions",
  },
  alternates: {
    canonical: "https://aedxsolutions.com/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
