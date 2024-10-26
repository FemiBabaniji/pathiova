'use client'

import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import ClientProviders from "@/components/ClientProviders";
import { QueryClient, QueryClientProvider } from "react-query";

// Note: Metadata cannot be used in Client Components
// You may need to move this to a separate file or handle it differently
// export const metadata: Metadata = {
//   title: "Bandscape",
//   description: "Pointing the way!",
// };

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Bandscape</title>
        <meta name="description" content="Pointing the way!" />
        <link rel="stylesheet" href="https://use.typekit.net/gcd4kuc.css" />
      </head>
      <body className={cn("antialiased min-h-screen font-sans rounded")}>
        <QueryClientProvider client={queryClient}>
          <ClientProviders>
            {children}
            <Toaster />
          </ClientProviders>
        </QueryClientProvider>
      </body>
    </html>
  );
}