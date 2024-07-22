"use client"

import { SessionProvider } from "next-auth/react";

interface INextAuthProviderProps {
  children?: React.ReactNode;
}

export const NextAuthProvider = ({ children }: INextAuthProviderProps) => {
  return (
  <SessionProvider>
    {children}
  </SessionProvider>
  )
}