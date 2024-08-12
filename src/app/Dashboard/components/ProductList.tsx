"use client";
import { ProductType } from "@/domain/product/entities/Product";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { getOffersProductsByPage } from "../_actions/get-offer-products";
import ProductRow from "@/components/ProductRow";

export default function ProductList() {
  const {
    mutate: server_getProductsByPage,
    isSuccess: isSuccessGetProductsByPage,
    isIdle: isIdleGetProductsByPage,
    data: dataGetProductsByPage,
    isError: isErrorGetProductsByPage,
  } = useMutation({
    mutationFn: getOffersProductsByPage,
    async onMutate() {
      console.log("onMutate, get products by page");
    },
    async onError() {
      console.log("onError, get products by page");
    },
    async onSuccess() {
      console.log("onSuccess, get products by page");
    },
    async onSettled() {
      console.log("onSettled,  get products by page");
    },
  });

  useEffect(() => {
    server_getProductsByPage({ page: 1 });
  }, []);

  return (
    <div>
      <h2>ProductList</h2>
      <div>
        {isIdleGetProductsByPage && <p>isIdleGetProductsByPage</p>}
        {isSuccessGetProductsByPage && <p>isSuccessGetProductsByPage</p>}
        {isErrorGetProductsByPage && <p>isErrorGetProductsByPage</p>}
        {dataGetProductsByPage &&
          dataGetProductsByPage.map((product: ProductType) => (
            <ProductRow product={product} key={product.id} />
          ))}
      </div>
    </div>
  );
}
