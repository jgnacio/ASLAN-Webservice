"use client";
import { Card } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getProductBySku } from "../../_actions/get-product-by-sku";
import { ProductEdit } from "../components/ProductEdit";
import { getProductCachedBySkuProvider } from "../_actions/get-product-cached-by-sku-provider";

export default function EditProduct({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  // const {
  //   data: product,
  //   isPending,
  //   isError,
  //   isSuccess,
  // } = useQuery({
  //   queryKey: ["product", params.id],
  //   queryFn: () =>
  //     getProductBySku(params.id, searchParams?.get("provider") || ""),
  // });

  const {
    data: productCached,
    isPending: isPendingCached,
    isError: isErrorCached,
    isSuccess: isSuccessCached,
  } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () =>
      getProductCachedBySkuProvider(
        params.id,
        searchParams?.get("provider") || ""
      ),
  });

  return (
    <Card className="bg-transparent border-0">
      <CardContent>
        {isPendingCached && <Spinner />}
        {isErrorCached && <div>Error</div>}
        {isSuccessCached && productCached && (
          <ProductEdit product={productCached} />
        )}
      </CardContent>
    </Card>
  );
}