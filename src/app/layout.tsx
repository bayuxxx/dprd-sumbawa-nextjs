import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DPRD Kabupaten Sumbawa Barat",
  description: "Website Resmi DPRD Kabupaten Sumbawa Barat - Dewan Perwakilan Rakyat Daerah",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
