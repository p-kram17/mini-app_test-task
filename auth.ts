import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        // Simple validation - in production you'd verify against a database
        if (!credentials?.email) {
          return null;
        }

        const role =
          (credentials.role as string) === "Admin" ? "Admin" : "Individual";

        // Return user object
        return {
          id: credentials.email as string,
          email: credentials.email as string,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true, // Required for production
});
