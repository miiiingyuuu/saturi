import axios from "axios";
import api from "@/lib/axios";
import { JWT } from "next-auth/jwt";
import NextAuth, { Session } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    // 페이지도 이후 따로 지정
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    CredentialsProvider({

      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },

      // eslint-disable-next-line consistent-return
      async authorize(credentials, req) {
        try {
          const res = await api.post("/user/auth/login", {
            email: credentials?.username,
            password: credentials?.password
          });
          return res.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message = Object.values(error.response?.data)[0] as string;
            throw new Error(message);
          }
        }
      }
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_ID!,
      clientSecret: process.env.KAKAO_SECRET!
    }),
    NaverProvider({
      clientId: process.env.NAV_ID!,
      clientSecret: process.env.NAV_SECRET!
    }),
  ],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async jwt({ token, trigger, user, account, profile }) {
      if (account && user) {
        return {
          ...token,
          ...user,
        };
      }
      const nowTime = Math.round(Date.now() / 1000);
      const refreshTime = (token.accessTokenExpires as number) - nowTime;

      if (refreshTime > 0) {
        return token;
      }

      try {
        // 토큰 재발급
        const res = await api.post("user/auth/token-refresh", {
          refresh: token.refreshToken
        });
        return {
          ...token,
          accessToken: res.data.accessToken,
          accessTokenExpires: res.data.accessTokenExpires,
        }
      } catch (error) {
        return {
          ...token,
          error: "RefreshAccessTokenError"
        }
      }
    },
    // async session( { session, token }: ISessionProps ) {
    //   if (token.error) {
    //     session.error = token.error;
    //
    //   }
    // }

    async session({ session, token }: ISessionProps) {
      // eslint-disable-next-line no-param-reassign

      if (token.error) {
        session.error = token.error;
        return session;
      }
      // 세션에서 들고올 것 정하기
      session.user.id = token.id;
      session.user.name = token.name;
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.refreshToken = token.refreshToken;
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60 * 30  // 30일
  },
  events: {
    async signOut(message) {
      try {
      await api.post("/user/logout", {
        refresh: message.token.refreshToken,
      });
    } catch (error) {
        console.error("sign out", error);
      }
    },
  }
});

export { handler as GET, handler as POST };

interface ISessionProps {
  session: Session
  token: JWT
}