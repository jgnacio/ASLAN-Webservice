import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
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
