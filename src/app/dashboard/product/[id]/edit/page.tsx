"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { ProductEdit } from "../components/ProductEdit";
import { getProductBySku } from "../../_actions/get-product-by-sku";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function EditProduct({ params }: { params: { id: string } }) {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductBySku(params.id),
  });
  useEffect(() => {
    if (product) {
      console.log(product);
    }
  }, [product]);
  return (
    <Card className="bg-transparent border-0">
      <CardContent>
        {product ? <ProductEdit product={product} /> : <Spinner />}
      </CardContent>
    </Card>
  );
}
