"use client";
import addToCart from "../cart/_actions/add-product-to-cart";
import { getCart } from "../cart/_actions/get-cart";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/button";
import { useMutation } from "@tanstack/react-query";
import { CircleX, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { removeProductOnCart } from "../cart/_actions/remove-product-on-cart";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function ButtonAddToCart({
  params,
}: {
  params: { id: string; cart: any };
}) {
  const { toast } = useToast();
  const [onCart, setOnCart] = useState(false);
  const router = useRouter();
  const {
    mutateAsync: server_getCart,
    isSuccess,
    isIdle,
    data: dataCart,
    isError,
    isPending: isPendingGetCart,
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
    isPending: isPendingAddToCart,
  } = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      addToCart(id, quantity),
  });

  const {
    mutateAsync: server_removeProductOnCart,
    isPending: isPendingRemoveProductOnCart,
    isSuccess: isSuccessRemoveProductOnCart,
  } = useMutation({
    mutationFn: ({ id }: { id: string }) => removeProductOnCart(id),
    onError: (error) => {
      toast({
        title: "Error",
        description: `Hubo un error al eliminar el producto del carrito: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const findProduct = (id: string) => {
    if (!params.cart) return false;
    return params.cart.products.find((product: any) => product.sku === id);
  };

  useEffect(() => {
    const product = findProduct(params.id);
    setOnCart(!!product);
  }, []);

  const handleAddProductToCart = async () => {
    if (onCart) {
      await removeProductOnCart(params.id);
      toast({
        title: "Producto Eliminado",
        description: "El producto ha sido eliminado del carrito exitosamente.",
      });
      setOnCart(false);
      return;
    }

    const cart = await server_getCart();
    const product = findProduct(params.id);
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
      action: (
        <ToastAction
          onClick={() => {
            router.push("/dashboard/cart");
          }}
          altText="Ir al carrito"
        >
          Ir al carrito
        </ToastAction>
      ),
    });
  };

  return (
    <Button
      color={!onCart ? "secondary" : "danger"}
      variant="solid"
      disabled={
        isPendingRemoveProductOnCart || isPendingAddToCart || isPendingGetCart
      }
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
