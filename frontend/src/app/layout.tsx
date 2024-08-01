import { Inter } from "next/font/google";
import { ReactNode } from "react";
// import { getProfileImage } from "@/utils/profileimage";
// import { authToken } from "@/utils/authutils";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={inter.className}>
      <body>
        <Header />
          <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
