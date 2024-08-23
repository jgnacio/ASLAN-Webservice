"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { ProductEdit } from "../components/ProductEdit";
import { getProductBySku } from "../../_actions/get-product-by-sku";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";

export default function EditProduct({ params }: { params: { id: string } }) {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductBySku(params.id),
  });
  return (
    <Card className="bg-transparent border-0">
      <CardContent>
        {product ? <ProductEdit product={product} /> : <Spinner />}
      </CardContent>
    </Card>
  );
}
