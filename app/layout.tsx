import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const monserat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neo SIAKAD",
  description: "Neo Siakad UNINUS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={monserat.className}>{children}</body>
    </html>
  );
}
