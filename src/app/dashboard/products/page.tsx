"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { getCart } from "../cart/_actions/get-cart";
import { ProductFeaturedList } from "../components/ProductFeaturedList";
import ProductOfferList from "../components/ProductOfferList";
import ProductRelevantList from "../components/ProductRelevantList";

export default function Products() {
  const {
    mutateAsync: server_getCart,
    isSuccess,
    isPending,
    data: dataCart,
    isError,
  } = useMutation({
    mutationFn: getCart,
  });

  useEffect(() => {
    server_getCart();
    console.log("dataCart update");
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
    >
      <Tabs defaultValue="featured">
        <TabsList>
          <TabsTrigger value="featured">Destacados</TabsTrigger>
          <TabsTrigger value="relevant">Relevantes</TabsTrigger>
          <TabsTrigger value="offers">Ofertas</TabsTrigger>
        </TabsList>
        <Card>
          <TabsContent value="relevant">
            <CardHeader>
              <CardTitle>Productos relevantes</CardTitle>
              <CardDescription>Listado de productos relevantes</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductRelevantList />
            </CardContent>
          </TabsContent>
          <TabsContent value="offers">
            <CardHeader>
              <CardTitle>Productos en Oferta</CardTitle>
              <CardDescription>Listado de productos en oferta</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductOfferList />
            </CardContent>
          </TabsContent>
          <TabsContent value="featured">
            <CardHeader>
              <CardTitle>Productos Destacados</CardTitle>
              <CardDescription>Listado de productos destacados</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductFeaturedList />
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </motion.div>
  );
}
