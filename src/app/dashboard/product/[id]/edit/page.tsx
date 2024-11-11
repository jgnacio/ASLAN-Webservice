"use client";
import { Card } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getProductBySku } from "../../_actions/get-product-by-sku";
import { ProductEdit } from "../components/ProductEdit";

export default function EditProduct({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const {
    data: product,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () =>
      getProductBySku(params.id, searchParams?.get("provider") || ""),
  });

  useEffect(() => {
    console.log(product);
  }, [product]);

  return (
    <Card className="bg-transparent border-0">
      <CardContent>
        {isPending && <Spinner />}
        {isError && <div>Error</div>}
        {isSuccess && product && <ProductEdit product={product} />}
      </CardContent>
    </Card>
  );
}
