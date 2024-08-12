import { auth } from "@clerk/nextjs/server";
import CartComponet from "./components/CartComponet";
import { redirect } from "next/navigation";

export default function Cart() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Shop</h1>
      <CartComponet />
    </div>
  );
}
