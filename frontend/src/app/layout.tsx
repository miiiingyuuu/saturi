"use client"

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authToken } from "@/utils/authutils";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("accessToken")) {
      authToken(router)
    }
  },[])
  return (
    <html lang="en">
    <body className={inter.className}>
      {children}
    </body>
    </html>
  );
}