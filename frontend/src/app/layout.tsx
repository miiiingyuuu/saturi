"use client"

import "@/styles/globals.css";
import localFont from "next/font/local"
import { ReactNode , useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useRouter, usePathname } from "next/navigation"
import { authToken } from "@/utils/authutils";



const mainFont = localFont({
  src: "./test.ttf"
})

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Pretendard, sans-serif'
  }
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
      <html lang="ko">
        <body
          className={mainFont.className}
        >
          <main>
            {children}
          </main>
        </body>
      </html>
    )
  }

  return (
    <html lang="ko">
      <body
        className={`${mainFont.className} bg-gray-100`}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
            <main
              className={mainFont.className}
            >{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )}
