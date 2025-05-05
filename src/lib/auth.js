import { DEFAULT_AVATAR } from "@/config/constant";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });
      
          const result = await response.json();
          
          if (!result.status) throw new Error(result.message);

          // Debug: Log the complete user data from API
          // console.log("User data from API:", result.data);
          // console.log("Roles from API:", result.data.roles);
          
          // Ensure role is properly extracted and assigned
          let userRole;
          if (result.data.roles && Array.isArray(result.data.roles) && result.data.roles.length > 0) {
            userRole = result.data.roles[0];
          } else if (result.data.user && result.data.user.role) {
            userRole = result.data.user.role;
          } else {
            userRole = 'user'; // Default role
          }
          
          // console.log("Role being assigned:", userRole);

          return {
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            image: result.data.user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/${result.data.user.avatar}` : `/images/${DEFAULT_AVATAR}`,
            role: userRole,
            token: result.data.token
          }
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account.provider === "google") {
        return profile.email_verified;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      // When sign in happens, user object is available
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        token.accessToken = user.token || user.accessToken;
        
        // Debug log
        // console.log("JWT callback - user role:", user.role);
        // console.log("JWT token being created:", token);
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        
        // Debug log
        // console.log("Session callback - token role:", token.role);
        // console.log("Session being created:", session);
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/error',
    signOut: '/'
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const handler = NextAuth(authOptions);