// components/NoNavbarLayout.tsx
import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Cantova",
  description: "Pointing the way!",
};

export default function NoNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, "antialiased min-h-screen pt-16")}>
        <Providers>
          {/* No Navbar here */}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
