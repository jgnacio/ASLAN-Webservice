"use client";
import { useAuth } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs/server";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  const { userId } = useAuth();

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <img
          src="https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/07/Logo-ASLAN-b.png"
          alt="Aslan Logo"
          width={200}
        />
        <h1>Next.js / Clerk / Chadcn / NextUI </h1>
        <div className="space-x-4">
          {userId ? (
            <Link href="/icc-aslan-dashboard">
              <Button color="primary">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button color="secondary">Iniciar Session</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="w-full h-40"></div>
    </main>
  );
}
