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
import ProductSearchEngine from "../components/ProductSearchEngine";
import { ChartLine, Search } from "lucide-react";
import { ImplementProviders } from "@/Resources/API/config";
import { logoUnicom } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";

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
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
    >
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">
            <span className="space-x-2 flex gap-1 items-center">
              Productos <Search size={15} />
            </span>
          </TabsTrigger>

          <TabsTrigger value="offers">
            <span className="space-x-2 flex gap-1 items-center">
              Ofertas
              <img
                src={logoUnicom.logoUrl}
                alt="Ofertas"
                width="20"
                height="20"
                className="rounded-full"
              ></img>
            </span>
          </TabsTrigger>
          <TabsTrigger value="modified" disabled={true}>
            <span className="space-x-2 flex gap-1 items-center">
              Modificados <ChartLine size={15} />
            </span>
          </TabsTrigger>
        </TabsList>
        <Card>
          <TabsContent value="products">
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription className="flex flex-col space-y-2">
                <span>
                  Listado de productos de la base de datos en Aslan. Los
                  proveedores vinculados son:{" "}
                  {ImplementProviders.map((provider) => provider.name).join(
                    ", "
                  )}
                  .
                </span>
                <span className=" text-xs ">
                  En el cuadro de búsqueda puedes buscar productos por:{" "}
                  <span className="font-bold">
                    Nombre, SKU, PartNumber o Proveedor.
                  </span>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSearchEngine />
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
          <TabsContent value="modified">
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
