"use client";

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {SessionProvider} from "next-auth/react";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    <NextUIProvider>
      {/*<NextThemesProvider attribute="class" defaultTheme="light">*/}
        {children}
      {/*</NextThemesProvider>*/}
    </NextUIProvider>
    </SessionProvider>
  )
}