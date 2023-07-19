import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { checkHash } from "@/lib/bcrypt";
export const authOption: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "email/password",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // 인증 로직
        const user = await prisma.user.findUnique({
          where: {
            email: credentials!.email,
          },
        });

        if (user && (await checkHash(credentials!.password, user.password!))) {
          // jwt로 설정되어 있는경우 여기서 넘겨지는 user의 정보가 토큰에 설정 된다.
          return user;
        } else {
          // 로그인 실패시 로직
          return null;
        }
      },
    }),
  ],
};
const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
