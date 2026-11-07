import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Response Desk | Portfolio demo",
  description:
    "A portfolio demonstration of AI-assisted lead qualification, routing and follow-up built on n8n, Gemini, Airtable and Gmail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
