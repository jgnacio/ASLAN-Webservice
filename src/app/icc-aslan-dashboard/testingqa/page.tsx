"use client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getIntcomexProducts } from "./_actions/get-intcomex-products-test";

export default function TestingQA() {
  const {
    mutateAsync: server_getProductsIntcomex,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: getIntcomexProducts,
    onSuccess: (data) => {
      console.log("Data:", data);
    },
  });

  const HandleGetProducts = () => {
    server_getProductsIntcomex();
  };
  return (
    <div>
      <h1>Testing QA</h1>
      <p>This is a page for testing the QA process.</p>
      <Button onClick={HandleGetProducts}>Get Products Intcomex</Button>
    </div>
  );
}
