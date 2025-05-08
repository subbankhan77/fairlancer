import { handler } from "@/lib/auth";
export { handler as GET, handler as POST };

// File: /app/api/auth/[...nextauth]/route.js (or similar location)

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// // Import other providers as needed

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       // Your credentials configuration
//     }),
//     GoogleProvider({
//       // Your Google provider configuration
//     }),
//     // Other providers
//   ],
  
//   // Add a custom pages configuration to override the default behavior
//   pages: {
//     signIn: '/login',
//     error: '/login', // Error code passed in query string as ?error=
//   },
  
//   // Callbacks
//   callbacks: {
//     // Keep existing callbacks...
    
//     // Add a check to allow the reset-password page without authentication
//     async signIn({ user, account, profile, email, credentials }) {
//       // Allow access to reset-password route even if not authenticated
//       if (
//         credentials?.callbackUrl &&
//         credentials.callbackUrl.includes('/reset-password')
//       ) {
//         return true;
//       }
      
//       // Your existing signIn logic here
//       return true;
//     },
    
//     async jwt({ token, user, account }) {
//       // Your existing jwt callback logic
//       return token;
//     },
    
//     async session({ session, token }) {
//       // Your existing session callback logic
//       return session;
//     },
//   },
  
//   // Add public pages that don't require authentication
//   publicPages: ['/reset-password'],
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };