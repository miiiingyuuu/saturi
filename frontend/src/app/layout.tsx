import "@/styles/globals.css";
import localFont from "next/font/local"
import { Metadata } from 'next'
import ClientLayout from '@/components/layout/ClientLayout'

const mainFont = localFont({
  src: "./PretendardVariable.woff2"
})

export const metadata: Metadata = {
  title: '사투리가 서툴러유',
  description: '사투리 학습 플랫폼',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${mainFont.className} bg-gray-100 min-h-svh`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}