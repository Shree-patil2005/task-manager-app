import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; 
import { injectGlobalStyles } from "@/lib/stitches.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Water Hole Task Manager",
  description: "Task Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  injectGlobalStyles();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* Simple wrap, no extra props needed here anymore */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}