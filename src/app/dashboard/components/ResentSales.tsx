"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductsUpdatedDashboard } from "@/Resources/API/entitites/ProductsUpdated";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Layers, Package, Package2, SquareArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductAslanBySku } from "../_actions/get-aslan-product-by-sku";
import { getOffersProductsByPage } from "../_actions/get-offer-products";
import { productBackToTheCatalog } from "../_actions/product-back-to-the-catalog";
import { removeFromTheCalalog } from "../_actions/remove-product-from-catalog";
import { getProductsAdministrated } from "../identify/_actions/get-product-administrated";
import { getProductBySku } from "../product/_actions/get-product-by-sku";
import ListProductUpdatedDashboard from "./ListProductUpdatedDashboard";
import { getOrdersWoocomerce } from "../_actions/get-orders-woocomerce";
import ListOrders from "./ListOrders";

export default function ResentSales() {
  const router = useRouter();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [productsUpdated, setProductsUpdated] = useState<
    ProductsUpdatedDashboard[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading: isLoadingProductsAdminstrated,
    isSuccess: isSuccessProductsAdminstrated,
    isError: isProductsAdminstratedError,
    data: dataProductsAdminstrated,
  } = useQuery({
    queryKey: ["product-administrated"],
    queryFn: () => getProductsAdministrated(),
  });

  const {
    mutateAsync: server_getProductAslanBySku,
    isPending: isPendingProductAslanBySku,
    isSuccess: isSuccessProductAslanBySku,
    isError: isProductAslanBySkuError,
    data: dataProductAslanBySku,
  } = useMutation({
    mutationFn: (sku: string) => getProductAslanBySku(sku),
  });

  const {
    mutateAsync: server_getUnicomProductBySku,
    isPending: isPendingUnicomProductBySku,
    isSuccess: isSuccessUnicomProductBySku,
    isError: isErrorUnicomProductBySku,
    data: dataUnicomProductBySku,
  } = useMutation({
    mutationFn: (sku: string) => getProductBySku(sku),
  });

  const {
    mutateAsync: server_removeProductFromCatalog,
    isPending: isPendingRemoveProductFromCatalog,
    isSuccess: isSuccessRemoveProductFromCatalog,
    isError: isErrorRemoveProductFromCatalog,
    data: dataRemoveProductFromCatalog,
  } = useMutation({
    mutationFn: (productId: number) => removeFromTheCalalog(productId),
  });

  const {
    mutateAsync: server_productBackToTheCatalog,
    isPending: isPendingProductBackToTheCatalog,
    isSuccess: isSuccessProductBackToTheCatalog,
    isError: isErrorProductBackToTheCatalog,
    data: dataProductBackToTheCatalog,
  } = useMutation({
    mutationFn: (productId: number) => productBackToTheCatalog(productId),
  });

  const {
    data: dataOrdersAslan,
    isLoading: isLoadingOrdersAslan,
    isSuccess: isSuccessOrdersAslan,
    isError: isErrorOrdersAslan,
  } = useQuery({
    queryKey: ["orders-woocomerce"],
    queryFn: () => getOrdersWoocomerce(),
  });

  const {
    isLoading: isLoadingOffersProductsByPage,
    isSuccess: isSuccessOffersProductsByPage,
    isError: isErrorOffersProductsByPage,
    data: dataOffersProductsByPage,
  } = useQuery({
    queryKey: ["offers-products"],
    queryFn: () => getOffersProductsByPage({ page: 1 }),
  });

  const columns: GridColDef[] = [
    { field: "title", headerName: "Producto", flex: 1 },
    // { field: "availability", headerName: "Disponibilidad", width: 120 },
    { field: "marca", headerName: "Marca", width: 120 },
    { field: "stock", headerName: "Stock", type: "number", width: 90 },
    {
      field: "guaranteeDays",
      headerName: "Garantia",
      type: "number",
      width: 90,
    },
    { field: "sku", headerName: "SKU", width: 90 },
    {
      field: "price",
      headerName: "Precio",
      type: "number",
      flex: 1,
    },
  ];

  useEffect(() => {
    if (isSuccessOrdersAslan) {
      console.log(dataOrdersAslan);
    }
  }, [dataOrdersAslan]);

  const handleUpdateStock = async () => {
    setLoadingPercentage(0);
    setProductsUpdated([]);
    for (const product of dataProductsAdminstrated) {
      setIsLoading(true);
      const totalPercentage = 100 / dataProductsAdminstrated.length;

      for (const relation of product.relations) {
        const resultAslan = await server_getProductAslanBySku(
          relation.SKU_Relation
        );
        const resultUnicom = await server_getUnicomProductBySku(
          relation.sku_provider
        );

        if (resultAslan && resultUnicom) {
          let actualStatus = resultAslan.status;
          if (
            resultUnicom.availability !== "in_stock" &&
            resultAslan.status !== "draft"
          ) {
            console.log("No hay stock en Unicom");
            // Actualizar stock en Aslan
            server_removeProductFromCatalog(resultAslan.id);
            actualStatus = "draft";
          }

          if (
            resultUnicom.availability === "in_stock" &&
            resultAslan.status === "draft"
          ) {
            console.log("Hay stock en Unicom");
            // Actualizar stock en Aslan
            // server_productBackToTheCatalog(resultAslan.id);
            actualStatus = "publish";
          }
          setProductsUpdated((prev) => [
            ...prev,
            {
              id: resultAslan.id,
              title: resultAslan.name,
              marca: resultUnicom.marca,
              stock: resultUnicom.stock,
              guaranteeDays: resultUnicom.guaranteeDays || 0,
              sku: resultAslan.sku,
              priceProvider: resultUnicom.price,
              price: resultAslan.price,
              partNumber: resultUnicom.partNumber
                ? resultUnicom.partNumber[0].partNumber
                : "",
              availability: resultUnicom.availability,
              aslanPrevStatus: resultAslan.status,
              aslanActualStatus: actualStatus,
            },
          ]);
        }
        setLoadingPercentage((prev) => prev + totalPercentage);
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Administrados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div className="flex flex-col justify-center">
              <div className="text-2xl font-bold">
                {dataProductsAdminstrated?.length || <Spinner size="sm" />}
              </div>
              <div className="flex items-center space-x-4">
                {loadingPercentage !== 0 ? (
                  <p className="text-xs text-muted-foreground">{`${loadingPercentage}%  ${productsUpdated.length}/${dataProductsAdminstrated.length}
                     `}</p>
                ) : (
                  ""
                )}
                {productsUpdated.length > 0 ? (
                  <Dialog>
                    <DialogTrigger className="flex text-sm">
                      Productos Actualizados
                      <SquareArrowUpRight size={20} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>Productos Actualizados</DialogTitle>
                        <DialogDescription>
                          Lista de los productos actualizados
                        </DialogDescription>
                      </DialogHeader>
                      <ListProductUpdatedDashboard
                        productsRows={productsUpdated}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>Salir</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    isDisabled={isLoadingProductsAdminstrated || isLoading}
                    size="sm"
                    onClick={() => {
                      router.push("/dashboard/identify");
                    }}
                    color="secondary"
                    isIconOnly
                  >
                    <Layers />
                  </Button>
                )}
              </div>
            </div>
            <Button
              color="primary"
              onClick={handleUpdateStock}
              isDisabled={isLoadingProductsAdminstrated || isLoading}
            >
              {isLoadingProductsAdminstrated || isLoading ? (
                <Spinner size="sm" color="secondary" />
              ) : (
                "Actualizar"
              )}
            </Button>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos en Oferta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOffersProductsByPage ? (
                <Spinner size="sm" />
              ) : (
                dataOffersProductsByPage?.length
              )}
            </div>
            {dataOffersProductsByPage && (
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground">
                  {/* Porcentaje de productos en proveedores en oferta */}
                  {(dataOffersProductsByPage.length /
                    (dataOffersProductsByPage.length + 0 + 0)) *
                    100}
                  %
                </p>
                <span className="text-blue-500 text-xs">Unicom</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40,000U$D</div>
            <p className="text-xs text-muted-foreground">
              +19% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Ultimas Compras</CardTitle>
              <CardDescription>
                Lista de las ultimas compras realizadas
              </CardDescription>
            </div>
            {/* <Button size="sm" className="ml-auto gap-1">
              <Link href="#">Ver Todas</Link>
            </Button> */}
          </CardHeader>
          <CardContent>
            <DataGrid rows={[]} columns={columns} />
          </CardContent>
        </Card>
        <ListOrders wooOrders={dataOrdersAslan} />
      </div>
    </div>
  );
}
