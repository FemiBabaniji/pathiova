import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth/next"; // Correctly import NextAuth for App Router

// Handle requests using the NextAuth handler directly for GET and POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
