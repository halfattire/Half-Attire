  import type { Metadata } from "next";
  import { Geist, Geist_Mono } from "next/font/google";
  import "./globals.css";
  import { Providers } from "../app/providers";

  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });

  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });

  export const metadata: Metadata = {
    title: "Half Attire - Multi-vendor E-commerce Platform",
    description: "Your one-stop destination for fashion and lifestyle products from multiple vendors",
    icons: {
      icon: [
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: "/favicon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.png",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "https://www.halfattire.com"),
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <head>
          {/* Favicon links for better cross-browser and deployment compatibility */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
          <link rel="shortcut icon" href="/favicon.png" />
          <meta name="msapplication-TileImage" content="/favicon.png" />
          
          {/* Web App Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#3321c8" />
          
          {/* Font imports */}
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    );
  }