import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Octance Typing Speedtest",
  description:
    "Test your typing speed with our free online type speed test. Measure your words per minute (WPM) and improve your typing accuracy with our fun and easy-to-use tool. Challenge yourself and see how fast you can type today",
  openGraph: {
    title: "Octance Typing Speedtest",
    description:
      "Test your typing speed with our free online type speed test. Measure your words per minute (WPM) and improve your typing accuracy with our fun and easy-to-use tool. Challenge yourself and see how fast you can type today",
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
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
