import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'fusionauth',
      name: 'FusionAuth',
      type: 'oauth',
      clientId: process.env.FUSIONAUTH_CLIENT_ID!,
      clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET!,
      authorization: {
        url: `${process.env.FUSIONAUTH_URL}/oauth2/authorize`,
        params: {
          scope: 'openid email profile',
        },
      },
      token: `${process.env.FUSIONAUTH_URL}/oauth2/token`,
      userinfo: `${process.env.FUSIONAUTH_URL}/oauth2/userinfo`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };