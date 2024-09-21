import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { jwtDecode } from "jwt-decode";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials === null) return null;

        try {
          const res = await fetch(
            `${process.env.API_SERVER_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await res.json();
          console.log(res.ok);
          if (!res.ok) {
            throw new Error(data.message);
            // throw new Error("");
          }

          const parsedResponse = await res.json();

          const token = parsedResponse.Token;
          const email = parsedResponse?.email;

          return { token, email };
        } catch (e) {
          throw new Error(e.message);
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code",
    //     },
    //   },
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code",
    //     },
    //   },
    // }),
  ],
  callbacks: {
    jwt: async ({ token, account, user }: any) => {
      if (!user) {
        throw new Error("Invalid login attempt");
      }
      // user is only available the first time a user signs in authorized
      console.log(`In jwt callback - Token is ${JSON.stringify(token)}`);
      if (token.accessToken) {
        const decodedToken = jwtDecode(token.accessToken as string);
        console.log(decodedToken);
        // token.accessTokenExpires = decodedToken?.exp * 1000;
      }
      if (account && user) {
        console.log(`In jwt callback - User is ${JSON.stringify(user)}`);
        console.log(`In jwt callback - account is ${JSON.stringify(account)}`);
        return {
          ...token,
          accessToken: user.accessToken,
          // refreshToken: user.refreshToken,
          user,
        };
      }
    },
    session: async ({ session, token }: any) => {
      console.log(`In session callback - Token is ${JSON.stringify(token)}`);
      if (token) {
        session.accessToken = token.accessToken;
        session.user = token.user;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
});
