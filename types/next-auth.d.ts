import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
    message?: string;
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    message?: string;
  }
}
