"use client";
import addToCart from "@/app/dashboard/cart/_actions/add-product-to-cart";
import { getCart } from "@/app/dashboard/cart/_actions/get-cart";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/button";
import { useMutation } from "@tanstack/react-query";
import { CircleX, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ButtonAddToCart({
  params,
}: {
  params: { id: string };
}) {
  const {
    mutateAsync: server_getCart,
    isSuccess,
    isIdle,
    data: dataCart,
    isError,
    isPending,
  } = useMutation({
    mutationFn: getCart,
    retry: 3,
  });

  const {
    mutate: server_addToCart,
    isSuccess: isSuccessAddToCart,
    isIdle: isIdleAddToCart,
    data: dataAddToCart,
    isError: isErrorAddToCart,
  } = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      addToCart(id, quantity),
  });

  const { toast } = useToast();
  const [onCart, setOnCart] = useState(false);

  const handleAddProductToCart = async () => {
    if (onCart) {
      toast({
        title: "Producto eliminado",
        description: `El producto ${params.id} se ha eliminado del carrito`,
      });
      setOnCart(false);
      return;
    }

    console.log("add to cart", params.id);
    const cart = await server_getCart();
    console.log("cart", cart);
    // Find if the product is on cart
    const product = cart.products.find(
      (product: any) => product.sku === params.id
    );

    setOnCart(true);
    if (product) {
      toast({
        title: "Producto ya agregado",
        description: `El producto ${params.id} ya se encuentra en el carrito`,
      });
      return;
    }
    try {
      await server_addToCart({ id: params.id, quantity: 1 });
    } catch (error) {
      toast({
        title: "Error",
        description: `El producto ${params.id} no se pudo agregar al carrito`,
        variant: "destructive",
      });
    }

    toast({
      title: "Producto agregado",
      description: `El producto ${params.id} se ha agregado al carrito`,
    });
  };

  return (
    <Button
      color={!onCart ? "secondary" : "danger"}
      variant="solid"
      className="rounded-full"
      onClick={handleAddProductToCart}
      size="sm"
    >
      {!onCart ? (
        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
      ) : (
        <CircleX />
      )}
    </Button>
  );
}
