"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { lightTheme } from "@/lib/stitches.config";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      // This mapping is crucial: 
      // It tells next-themes that when the theme is "light", 
      // apply the Stitches lightTheme class to the HTML tag.
      value={{
        light: lightTheme.className, 
        dark: "dark", // Default Stitches theme doesn't need a special class
      }}
    >
      {children}
    </NextThemesProvider>
  );
}