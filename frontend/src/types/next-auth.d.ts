import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

// https://gonggongnote.tistory.com/76
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["User"];
    expires: string;
    accessToken: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    refreshTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }

  interface User {
    id?: string;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    refreshTokenExpires?: number;
    exp: number;
    error?: "RefreshAccessTokenError";
  }
}