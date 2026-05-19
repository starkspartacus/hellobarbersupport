import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "./axiosInstance";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "Code OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        try {
          const res = await axiosInstance.post('/auth/admin/verify-otp', {
            email: credentials.email,
            otp: credentials.otp,
          });

          // Suppose backend returns { accessToken: "...", user: {...} }
          const { accessToken, user } = res.data;

          if (accessToken) {
            return {
              id: user?._id || user?.id || "1",
              email: credentials.email,
              name: user?.firstName ? `${user.firstName} ${user.lastName}` : "Support Admin",
              accessToken: accessToken,
              role: user?.role || "support",
            };
          }
          return null;
        } catch (error) {
          console.error("Erreur de vérification OTP:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  }
};
