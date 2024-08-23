"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { MdEditDocument } from "react-icons/md";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductBySku } from "../_actions/get-product-by-sku";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { ProductEdit } from "./components/ProductEdit";
import { Spinner } from "@nextui-org/spinner";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { createMarkup } from "@/lib/functions/HtmlInner";
import ProductDetails from "./components/ProductDetails";

export default function ProductPage({ params }: { params: { id: string } }) {
  const {
    isError,
    isLoading,
    isSuccess,
    data: product,
  } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductBySku(params.id),
  });

  return (
    <Card className="flex flex-col items-centers">
      <CardHeader>
        <CardTitle>{isSuccess ? product?.title : <Spinner />}</CardTitle>
      </CardHeader>

      <CardContent>
        {isSuccess && (
          <div>
            <ProductDetails product={product} />
            <div>
              <Link
                href="/dashboard/product/[id]/edit"
                as={`/dashboard/product/${params.id}/edit`}
              >
                <Button color="primary">
                  Publicar
                  <MdEditDocument />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
