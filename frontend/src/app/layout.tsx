"use client"

import "@/styles/globals.css";
import localFont from "next/font/local"
import { ReactNode, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createTheme, ThemeProvider, Box } from "@mui/material";
import { useRouter, usePathname } from "next/navigation"
import { authToken } from "@/utils/authutils";
import { teal } from "@mui/material/colors";

const mainFont = localFont({
  src: "./test.ttf"
})

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: teal
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
  }, [router])

  const isSpecialPage = pathname && (
    pathname.startsWith("/admin") || 
    (pathname.startsWith("/game") && !(pathname.includes("/in-game/") && pathname.endsWith("/result")))
  );

  if (isSpecialPage) {
    return (
      <html lang="ko">
        <body className={mainFont.className}>
          <main>{children}</main>
        </body>
      </html>
    )
  }

  return (
    <html lang="ko">
      <body className={`${mainFont.className} bg-gray-100`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box
              component="main"
              sx={{
                mt: 1
              }}
              className={mainFont.className}
            >
              {children}
            </Box>
            <Box sx={{ mt: 'auto' }}>
              <Footer />
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  )
}
