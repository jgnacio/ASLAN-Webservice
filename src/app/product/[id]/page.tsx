"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { MdEditDocument } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { getProductBySku } from "../_actions/get-product-by-sku";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { ProductEdit } from "./components/ProductEdit";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {
    mutate: server_getProductBySku,
    isError,
    isPending,
    isSuccess,
    data: product,
  } = useMutation({
    mutationFn: getProductBySku,
    async onMutate() {
      console.log("onMutate, get product by sku");
    },
    async onError() {
      console.log("onError, get product by sku");
    },
    async onSuccess() {
      console.log("onSuccess, get product by sku");
    },
    async onSettled() {
      console.log("onSettled, get product by sku");
    },
  });

  const handleDisplayEdit = () => {
    setIsEdit(!isEdit);
  };

  useEffect(() => {
    server_getProductBySku(params.id);
  }, []);

  useEffect(() => {
    console.log("product", product);
  }, [product]);

  return !isEdit ? (
    <div>
      <h1>Product Page</h1>
      {isError && <p>Error</p>}
      {isPending && <p>Loading...</p>}
      {isSuccess && (
        <div>
          <p>Producto: {product?.title}</p>
          <p>Precio: {product?.price}</p>
          <p>SKU: {product?.sku}</p>
        </div>
      )}

      <Button onClick={handleDisplayEdit} color="primary">
        {" "}
        <MdEditDocument />
        Publicar{" "}
      </Button>
    </div>
  ) : (
    <>
      {product && (
        <ProductEdit product={product} handleDisplayEdit={handleDisplayEdit} />
      )}
    </>
  );
}
