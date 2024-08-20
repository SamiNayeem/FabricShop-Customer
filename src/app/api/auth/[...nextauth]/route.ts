import NextAuth, { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/*
// Import your database connection
const pool = require('@/config/db');

// Extend the User type to include a message property
interface CustomUser extends User {
  message?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {};

        if (!username || !password) {
          throw new Error("Please enter both username and password");
        }

        // Query to check if user exists
        const [rows] = await pool.execute(
          "SELECT id, userpassword FROM users WHERE username = ?",
          [username]
        );

        if (rows.length === 0) {
          return null; // Return null if the user does not exist
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.userpassword);

        if (!isPasswordValid) {
          return null; // Return null if the password is invalid
        }

        // Return user object along with a success message
        const customUser: CustomUser = { id: user.id, name: username, message: "Signed in successfully" };
        return customUser;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.message = (user as CustomUser).message; // Pass the success message
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.message = token.message; // Pass the success message to the session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Your custom sign-in page
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

*/

export const authOptions = {
  providers: [
    GithubProvider(
      {
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      }
    ),
    GoogleProvider(
      {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      }
    ),
  ],
};

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}
