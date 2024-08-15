"use client"

import { ReactNode, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createTheme, ThemeProvider } from "@mui/material";
import { useRouter, usePathname } from "next/navigation"
import { authToken } from "@/utils/authutils";
import { teal } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: teal
  },
  typography: {
    fontFamily: 'Pretendard, sans-serif',
  }
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("accessToken")) {
      authToken()
    }
  }, [router])

  const isStartPage = pathname === '/' || pathname === '/start';
  
  if (pathname && (pathname.startsWith("/admin") || (pathname.startsWith("/game") && !(pathname.includes("/in-game/") && pathname.endsWith("/result"))))) {
    return (
      <ThemeProvider theme={theme}>
        <main>{children}</main>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header isTransparent={isStartPage} />
      <main style={{ minHeight: 'calc(100vh - 350px)' }}>
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  )
}