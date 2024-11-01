"use client";
import { useMutation } from "@tanstack/react-query";
import { getFeaturedProductsByPage } from "../_actions/get-featured-products";
import { Button } from "@nextui-org/button";
import { unicom_getToken } from "./_actions/unicom-get-token";
import { getProductsByProvider } from "./_actions/get-products-by-provider";
import ListProductModular from "../components/ListProductModular";

export default function TestingQA() {
  const {
    mutateAsync: server_getFeaturedProducts,
    isPending: isServer_getFeaturedProductsPending,
    isSuccess: isServer_getFeaturedProductsSuccess,
    data: featuredProductsData,
  } = useMutation({
    mutationFn: getFeaturedProductsByPage,
  });

  const {
    mutateAsync: server_getProductsByProvider,
    isPending: isServer_getProductsByProviderPending,
    isSuccess: isServer_getProductsByProviderSuccess,
    data: productsByProviderData,
  } = useMutation({
    mutationFn: ({ provider }: { provider: string }) =>
      getProductsByProvider(provider),
  });

  const {
    mutateAsync: server_getToken,
    isPending: getTokenPending,
    isSuccess: getTokenSuccess,
    isError: getTokenError,
  } = useMutation({
    mutationFn: unicom_getToken,
  });

  const handleGetFeaturedProducts = async () => {
    console.log(await server_getFeaturedProducts({ page: 1 }));
  };

  const handleGetToken = async () => {
    console.log(await server_getToken());
  };

  const handleGetProductsByProvider = async () => {
    console.log(
      await server_getProductsByProvider({ provider: "Solutionbox" })
    );
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

      <Button onClick={handleGetToken}>Get Token</Button>
      {getTokenPending && <p>Loading...</p>}
      {getTokenSuccess && <p>Success</p>}
      {getTokenError && <p>Error</p>}

      <br />
      <Button onClick={handleGetProductsByProvider}>
        Get Products By Provider PC Service
      </Button>

      <ListProductModular productsRows={productsByProviderData} />
    </div>
  );
}
