"use client";
// import { addProduct, removeProduct } from "@/lib/features/cart/addProduct";
import ProductRow from "@/components/ProductRow";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCart } from "../_actions/get-cart";
import { Button } from "@nextui-org/button";
import { eraseCart } from "../_actions/eraseCart";
import { useToast } from "@/components/ui/use-toast";
import { title } from "process";
import { colorVariants } from "@nextui-org/theme";

export default function CartComponet() {
  const { toast } = useToast();

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
    async onMutate() {
      console.log("onMutate");
    },
    async onError(error) {
      console.log("onError", error);
    },
    async onSuccess(data) {
      console.log("onSuccess", data);
    },
    async onSettled() {
      console.log("onSettled");
    },
  });

  const {
    mutateAsync: server_eraseCart,
    isPending: isPendingEraseCart,
    isSuccess: isSuccessEraseCart,
  } = useMutation({
    mutationFn: () => eraseCart(),
  });

  useEffect(() => {
    server_getCart();
  }, []);

  const handleAddProduct = async () => {};

  const handleEraseCart = async () => {
    await server_eraseCart();
    toast({
      title: "Carrito Vacio",
      description: "Carrito Vacio",
      color: colorVariants.light.success,
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Cart</h1>

      {dataCart && dataCart.products.length > 0 ? (
        // dataCart.products.map((product) => (
        //   <div key={product.id}>
        //     <h2>{product.title}</h2>
        //     <p>{product.price}</p>
        //     <p>{product.tax}</p>
        //     <p>{product.quantity}</p>
        //     <p>{product.available}</p>
        //     {/* <Button onClick={handleAddProduct}>Add</Button> */}
        //     <Button color="danger" onClick={handleRemoveProduct}>
        //       Eliminar <FaRegTrashAlt />
        //     </Button>
        //   </div>
        <div>
          <div>
            {dataCart.products.map((product) => (
              <ProductRow product={product} onCart={true} key={product.id} />
            ))}
          </div>
          <div>
            <h2>Total incluyendo IVA: {dataCart.total_including_tax} U$D</h2>
          </div>
          <Button color="danger" onClick={handleEraseCart}>
            Vaciar Carrito
          </Button>
        </div>
      ) : isPending ? (
        <div>Cargando...</div>
      ) : (
        dataCart && dataCart.products.length <= 0 && <div>Carrito Vacio</div>
      )}
    </div>
  );
}
