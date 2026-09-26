import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinguaLens AI — Phòng học tiếng Anh",
  description: "Đọc hiểu, luyện từ vựng và khám phá cách học phù hợp với bạn.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
