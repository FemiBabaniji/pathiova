"use client";  // Mark this as a client-side component

import { SessionProvider } from "next-auth/react";  // Import SessionProvider from next-auth
import { ScoreProvider } from "@/app/context/ScoreContext";  // Import ScoreProvider

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>  {/* Wrap children with SessionProvider to provide session data */}
      <ScoreProvider>  {/* Wrap children with ScoreProvider to provide score context */}
        {children}
      </ScoreProvider>
    </SessionProvider>
  );
}
