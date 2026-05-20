import type { Metadata, Viewport } from "next";
import "../client/app/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "StudyPulse - Smart Study Tracker",
  description:
    "Track your study sessions, manage your timetable, and analyze your academic performance with AI-powered insights.",
  keywords: ["study tracker", "timetable", "student planner", "analytics", "pomodoro"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
