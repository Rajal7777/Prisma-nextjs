import NextAuth from "next-auth"; 
//allows users to authenticate with github
import Github from "next-auth/providers/github"; 

//adapter connects nextAuth to database // without it NextAuth won't save anything on db
//it automatically connects NextAuth to database 
//it automatically handles creating users , sessions, accounts linking to github account
import { PrismaAdapter } from "@auth/prisma-adapter";

//prisma is the instance of Prisma client used to the adapter to communicate with PostgresSQL
import { prisma } from "./lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [Github],
  adapter: PrismaAdapter(prisma), //connects NextAuth with Prisma //save user info in db after login 

  //callbacks allows you to customize what get stored
  callbacks: {
    async jwt({ token, user }) {
      if (user) {    //add id and name to token obj
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
