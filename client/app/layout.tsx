import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full touch-manipulation">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-full font-sans`}
      >
        {children}
      </body>
    </html>
  );
}