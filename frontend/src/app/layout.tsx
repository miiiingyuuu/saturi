"use client"

import { Inter } from "next/font/google";
import { ReactNode , useEffect } from "react";
import "@/styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useRouter, usePathname } from "next/navigation"
import { authToken } from "@/utils/authutils";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("accessToken")) {
      authToken()
    }
  },[router])

  
  if (pathname && ( pathname.startsWith("/admin") || (pathname.startsWith("/game") && !(pathname.includes("/in-game/") && pathname.endsWith("/result"))))) {
    return (
      <html lang="ko" className={inter.className}>
        <body>
          <main>
            {children}
          </main>
        </body>
      </html>
    )
  }

  return (
    <html lang="ko" className={inter.className}>
      <body
        className="bg-gray-100"
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
            <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )}
