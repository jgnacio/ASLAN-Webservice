import { auth } from "@clerk/nextjs/server";
import CartComponet from "./components/CartComponet";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Cart() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Shop</h1>
      <CartComponet />
      <Link href="/purchase_order">
        <Button color="primary">Realizar Orden de Compra</Button>
      </Link>
    </div>
  );
}
