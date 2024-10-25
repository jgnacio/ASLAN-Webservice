"use client";
import { useMutation } from "@tanstack/react-query";
import { getFeaturedProductsByPage } from "../_actions/get-featured-products";
import { Button } from "@nextui-org/button";

export default function TestingQA() {
  const {
    mutateAsync: server_getFeaturedProducts,
    isPending: isServer_getFeaturedProductsPending,
    isSuccess: isServer_getFeaturedProductsSuccess,
    data: featuredProductsData,
  } = useMutation({
    mutationFn: getFeaturedProductsByPage,
  });

  const handleGetFeaturedProducts = async () => {
    console.log(await server_getFeaturedProducts({ page: 1 }));
  };

  return (
    <div>
      <h1>Testing QA</h1>
      <p>
        This is a page for testing the QA process. It is a simple page that
        displays a list of products.
      </p>
      <Button onClick={handleGetFeaturedProducts}>Get Featured Products</Button>
      {isServer_getFeaturedProductsPending && <p>Loading...</p>}
      {isServer_getFeaturedProductsSuccess && <p>Success</p>}
    </div>
  );
}
