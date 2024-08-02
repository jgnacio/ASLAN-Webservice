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

import { Providers } from "./Providers/Providers";

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
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
