"use server";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@nextui-org/button";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import { Switch } from "@nextui-org/react";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryList />
        <ProductList />
      </Suspense>
    </div>
  );
}
