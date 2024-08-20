import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import CartComponent from "./components/CartComponent";

export default function Cart() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Shop</h1>
      <CartComponent />
      <Link href="/dashboard/purchase_order">
        <Button color="primary">Realizar Orden de Compra</Button>
      </Link>
    </div>
  );
}
