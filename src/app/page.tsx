import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full h-40">
        <img
          src="https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/07/Logo-ASLAN-b.png"
          alt="Aslan Logo"
          width={200}
        />
      </div>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>Next.js / Clerk / Chadcn / NextUI </h1>
        <Link href="/sign-in">
          <Button>Iniciar Session</Button>
        </Link>
      </div>
    </main>
  );
}
