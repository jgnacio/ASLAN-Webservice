"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductsAdministrated } from "../identify/_actions/get-product-administrated";
import { getProductAslanBySku } from "../_actions/get-aslan-product-by-sku";
import { getProductBySku } from "../product/_actions/get-product-by-sku";
import { useState } from "react";
import { removeFromTheCalalog } from "../_actions/remove-product-from-catalog";
import { productBackToTheCatalog } from "../_actions/product-back-to-the-catalog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquareArrowUpRight } from "lucide-react";
import ListProductModular from "./ListProductModular";
import ListProductUpdatedDashboard from "./ListProductUpdatedDashboard";
import { ProductsUpdatedDashboard } from "@/Resources/API/entitites/ProductsUpdated";
import { DialogClose } from "@radix-ui/react-dialog";

export default function ResentSales() {
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
            server_productBackToTheCatalog(resultAslan.id);
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
                <p className="text-xs text-muted-foreground">
                  {loadingPercentage !== 0
                    ? `${loadingPercentage}%  ${productsUpdated.length}/${dataProductsAdminstrated.length}`
                    : ""}
                </p>
                {productsUpdated.length > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" color="secondary" isIconOnly>
                        <SquareArrowUpRight size={20} />
                      </Button>
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
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground">
              +180.1% desde el mes pasado
            </p>
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
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Ultimas Ventas</CardTitle>
            <CardDescription>
              Lista de las ultimas ventas realizadas. (Datos Ficticios) luego se
              conectara a la base de datos de ASLAN
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$1,999.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">
                  jackson.lee@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/03.png" alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  isabella.nguyen@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$299.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/04.png" alt="Avatar" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">William Kim</p>
                <p className="text-sm text-muted-foreground">will@email.com</p>
              </div>
              <div className="ml-auto font-medium">+$99.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  sofia.davis@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
