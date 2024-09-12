"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductOfferList from "../components/ProductOfferList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import ProductFeaturedList from "../components/ProductFeaturedList";
import ProductRelevantList from "../components/ProductRelevantList";

export default function Products() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
    >
      <Tabs defaultValue="relevant">
        <TabsList>
          <TabsTrigger value="offers">Ofertas</TabsTrigger>
          <TabsTrigger value="relevant">Relevantes</TabsTrigger>
          <TabsTrigger value="featured">Destacados</TabsTrigger>
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
