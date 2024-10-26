import GoogleProvider from "next-auth/providers/google";
import sql from "@/lib/db";  // Import the database connection

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,  // Add the secret for secure JWT and session handling
  session: {
    strategy: "jwt",  // Use JWT to manage sessions
  },
  callbacks: {
    async signIn({ user }) {
      // Check if the user already exists in the database
      const existingUser = await sql`SELECT * FROM users WHERE email = ${user.email}`;
      
      if (existingUser.length === 0) {
        // If the user is new, create a new entry in the "users" table
        await sql`
          INSERT INTO users (email, user_name)
          VALUES (${user.email}, ${user.name})
        `;
      }

      return true;  // Allow sign-in
    },

    async jwt({ token, user }) {
      // Store user information in the JWT token for future requests
      if (user) {
        token.email = user.email;  // Store user email in the token
        token.name = user.name;    // Store user name in the token
      }
      return token;
    },

    async session({ session, token }) {
      // Pass user information from JWT token to the session
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};
