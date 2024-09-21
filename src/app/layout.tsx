import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

import { cn } from "@/lib/utils";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Octance Typing Speedtest",
  description:
    "Ready to dominate the keyboard? Our fun typing speed test will put your skills to the test.",
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
          "min-h-screen bg-background antialiased",
          epilogue.className
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
