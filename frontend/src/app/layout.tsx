import "@/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@nextui-org/react"
import Image from "next/image"
import Providers from "./providers"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "사투리가 서툴러유",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="header">
            <Link href="/main">
              <Image src="/SSLogo.png" width={120} height={120} alt="SSLogo" />
            </Link>
            <div className="buttons">
              <Link href="/login">
                <Button className="loginButton">로그인</Button>
              </Link>
            </div>
          </header>
          <hr className="separator"/>
            {children}
          <footer className="footer">
            <div className="footer-content">
              <Image src="/SSLogo.png" width={100} height={100} alt="SSLogo"/>
              <div className="footer-links">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
              </div>
              <p>&copy; 2024 My Next.js App. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
