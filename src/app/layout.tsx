import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./Providers/Providers";
import { RiShoppingCartFill } from "react-icons/ri";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASLAN - Administrador",
  description: "Gestion de contedido de los productos de ASLAN.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <html lang="en" className={`${inter.className}`}>
        <body>
          <NextTopLoader />

          <main>
            <Providers>{children}</Providers>
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
