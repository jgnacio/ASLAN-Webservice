"use server";
import { auth } from "@clerk/nextjs/server";
import ProductList from "./ProductList";
import { Button } from "@nextui-org/button";
import { Suspense } from "react";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}
