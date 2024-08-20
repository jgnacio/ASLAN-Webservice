import { ProductType } from "@/domain/product/entities/Product";
import addToCart from "@/app/dashboard/cart/_actions/add-product-to-cart";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { ICartProduct } from "@/domain/product/entities/Cart";
import { removeProductOnCart } from "@/app/dashboard/cart/_actions/remove-product-on-cart";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ProductRow({
  product,
  onCart,
}: {
  product: ICartProduct;
  onCart?: boolean;
}) {
  const pathName = usePathname();

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

  const {
    mutate: server_removeProductOnCart,
    isSuccess: isSuccessRemoveProductOnCart,
    isPending: isPendingRemoveProductOnCart,
    data: dataRemoveProductOnCart,
    isError: isErrorRemoveProductOnCart,
  } = useMutation({
    mutationFn: () => removeProductOnCart(product.id),
  });

  const handleRemoveProduct = async () => {
    console.log("handleRemoveProduct", product.id);
    server_removeProductOnCart();
  };

  return (
    <div
      key={product.id}
      className="flex justify-between border-1 border-black"
    >
      <Link href={`/product/${product.sku}`}>
        <div>
          <h3>Producto:{product.title}</h3>
          <p>Precio:{product.price}</p>
          <p>Stock:{product.stock}</p>
          {onCart ? (
            <>
              <p>Cantidad en Carrito:{product.quantity}</p>
              <p>Disponible:{product.available}</p>
            </>
          ) : (
            <>
              <p>Marca:{product.marca}</p>
              <p>{product.category.name}</p>
            </>
          )}
          <p>Codigo:{product.sku}</p>
        </div>
      </Link>

      {onCart ? (
        <div>
          <div>
            <Button
              onClick={() => {
                if (product.quantity) {
                  if (product.quantity > 1) {
                    server_addToCart({ id: product.sku, quantity: -1 });
                    // product.quantity -= 1;
                  }
                }
              }}
            >
              -
            </Button>
            <p>{product.quantity}</p>
            <Button
              onClick={() => {
                if (product.quantity) {
                  if (product.quantity >= 1) {
                    server_addToCart({ id: product.sku, quantity: 1 });
                    // product.quantity += 1;
                  }
                }
              }}
            >
              +
            </Button>
          </div>
          <Button
            color="danger"
            onClick={handleRemoveProduct}
            disabled={isPendingRemoveProductOnCart}
          >
            Eliminar <FaRegTrashAlt />
          </Button>
        </div>
      ) : (
        <div>
          {isIdleAddToCart && <p>isIdleAddToCart</p>}
          {isSuccessAddToCart && <p>isSuccessAddToCart</p>}
          {isErrorAddToCart && <p>isErrorAddToCart</p>}
          <Button
            onClick={() => server_addToCart({ id: product.sku, quantity: 1 })}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
}
