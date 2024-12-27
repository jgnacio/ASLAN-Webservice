"use client";

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
import { useToast } from "@/components/ui/use-toast";
import { ProductsUpdatedDashboard } from "@/Resources/API/entitites/ProductsUpdated";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Layers, SquareArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductAslanBySku } from "../_actions/get-aslan-product-by-sku";
import { getOffersProductsByPage } from "../_actions/get-offer-products";
import { getOrdersWoocomerce } from "../_actions/get-orders-woocomerce";
import { getProviderByID } from "../_actions/get-provider-by-id";
import { productBackToTheCatalog } from "../_actions/product-back-to-the-catalog";
import { removeFromTheCalalog } from "../_actions/remove-product-from-catalog";
import { getProductsAdministrated } from "../identify/_actions/get-product-administrated";
import { getProductBySku } from "../product/_actions/get-product-by-sku";
import ListOrders from "./ListOrders";
import ListProductUpdatedDashboard from "./ListProductUpdatedDashboard";
import ExcelExportButton from "./Export/SaveToExcel";
import { deleteProductRelation } from "../identify/_actions/delete-product-relation";
import { v4 as uuidv4 } from "uuid";

export default function ResentSales() {
  const { toast } = useToast();
  const router = useRouter();
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
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
    data: provider,
    isPending: isLoadingProvider,
    isSuccess: isSuccessProvider,
    isError: isErrorProvider,
  } = useMutation({
    mutationFn: (id: number) => getProviderByID(id),
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
    mutateAsync: server_getProductBySku,
    isPending: isPendingProductBySku,
    isSuccess: isSuccessProductBySku,
    isError: isErrorProductBySku,
    data: dataProductBySku,
  } = useMutation({
    mutationFn: ({ sku, provider }: { sku: string; provider: string }) =>
      getProductBySku(sku, provider),
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

  const {
    mutateAsync: server_deleteProductRelation,
    isPending: isPendingDeleteProductRelation,
    isSuccess: isSuccessDeleteProductRelation,
    isError: isErrorDeleteProductRelation,
  } = useMutation({
    mutationFn: (SKU_RELATION: string) => deleteProductRelation(SKU_RELATION),
  });

  const {
    mutateAsync: server_setAsInStock,
    isPending: isPendingSetAsInStock,
    isSuccess: isSuccessSetAsInStock,
    isError: isErrorSetAsInStock,
  } = useMutation({
    mutationFn: (productId: number) => productBackToTheCatalog(productId),
  });

  const {
    mutateAsync: server_setAsOutOfStock,
    isPending: isPendingSetAsOutOfStock,
    isSuccess: isSuccessSetAsOutOfStock,
    isError: isErrorSetAsOutOfStock,
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
    setIsLoading(true);

    if (!dataProductsAdminstrated) {
      setIsLoading(false);
      return;
    }

    const totalRelations = dataProductsAdminstrated
      .map((product: any) => product.relations.length)
      .reduce((a: any, b: any) => a + b, 0);

    const incrementPerRelation = 100 / totalRelations;
    let processedRelations = 0;

    const updateProgress = () => {
      setLoadingPercentage((prev) =>
        Math.min(prev + incrementPerRelation, 100)
      );
    };

    try {
      for (const product of dataProductsAdminstrated) {
        await Promise.all(
          product.relations.map(async (relation: any) => {
            try {
              const resultAslan = await server_getProductAslanBySku(
                relation.SKU_Relation
              );
              const provider = await getProviderByID(relation.ID_Provider);
              const providerName = provider.data.name;
              const resultProduct = await server_getProductBySku({
                sku: relation.sku_provider,
                provider: providerName,
              });

              if (!resultAslan && resultProduct) {
                await handleDeleteRelation(
                  relation,
                  resultProduct,
                  processedRelations++
                );
              } else if (resultAslan && resultProduct) {
                await handleUpdateAslan(
                  resultAslan,
                  resultProduct,
                  processedRelations++
                );
              } else {
                if (!resultProduct) {
                  toast({
                    title: "No disponible",
                    description: `El producto con SKU: ${relation.sku_provider} no se encuentra disponible en ${providerName}`,
                    variant: "outline-warning",
                  });

                  // Set out of stock in Aslan
                  if (resultAslan) {
                    await server_setAsOutOfStock(resultAslan.id);
                    setProductsUpdated((prev) => [
                      ...prev,
                      {
                        id: uuidv4(),
                        title:
                          resultAslan.name + " (No disponible en proveedor)",
                        marca: "N/A",
                        stock: 0,
                        guaranteeDays: 0,
                        sku: resultAslan.sku,
                        priceProvider: 0,
                        price: resultAslan.price,
                        partNumber: "",
                        provider: providerName,
                        availability: "out_of_stock",
                        aslanPrevStatus: resultAslan.stock_status,
                        aslanActualStatus: "outofstock",
                      },
                    ]);
                    processedRelations++;
                  }
                }

                if (!resultAslan) {
                  toast({
                    title: "Error",
                    description: `El producto con SKU: ${relation.SKU_Relation} no se encuentra en Aslan`,
                    variant: "destructive",
                  });
                }

                // Incrementa el contador incluso si no se encuentra algún producto
                processedRelations++;
              }
              updateProgress();
            } catch (error) {
              console.error(
                `Error procesando relación: ${relation.SKU_Relation}`,
                error
              );

              // Incrementa el contador también en caso de error
              processedRelations++;
              updateProgress();
            }
          })
        );
      }
    } catch (error) {
      console.error("Error general en handleUpdateStock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRelation = async (
    relation: any,
    resultProduct: any,
    id: number
  ) => {
    try {
      await server_deleteProductRelation(relation.SKU_Relation);
      setProductsUpdated((prev) => [
        ...prev,
        {
          id: uuidv4(),
          title: resultProduct.title,
          marca: resultProduct.marca,
          stock: resultProduct.stock,
          guaranteeDays: resultProduct.guaranteeDays || 0,
          sku: "N/A",
          priceProvider: resultProduct.price,
          price: resultProduct.price,
          partNumber: resultProduct.partNumber?.[0]?.partNumber || "",
          availability: resultProduct.availability,
          aslanPrevStatus: "deleted",
          aslanActualStatus: "deleted",
        },
      ]);
      toast({
        title: relation.SKU_Relation,
        description: `El producto con SKU: ${relation.SKU_Relation} no se encuentra en Aslan. (Eliminar residuos)`,
      });
    } catch (error) {
      console.error(
        `Error eliminando relación: ${relation.SKU_Relation}`,
        error
      );
    }
  };

  const handleUpdateAslan = async (
    resultAslan: any,
    resultProduct: any,
    id: number
  ) => {
    try {
      let actualStatus = resultAslan.stock_status;

      if (resultAslan.stock_status === "onbackorder") {
        resultProduct.availability = "on_demand";
      } else if (
        resultProduct.availability === "in_stock" &&
        resultAslan.stock_status === "outofstock"
      ) {
        await server_setAsInStock(resultAslan.id);
        actualStatus = "instock";
      } else if (
        resultProduct.availability !== "out_of_stock" &&
        resultAslan.stock_status !== "instock"
      ) {
        await server_setAsOutOfStock(resultAslan.id);
        actualStatus = "outofstock";
      }

      setProductsUpdated((prev) => [
        ...prev,
        {
          id: uuidv4(),
          title: resultAslan.name,
          marca: resultProduct.marca,
          stock: resultProduct.stock,
          guaranteeDays: resultProduct.guaranteeDays || 0,
          sku: resultAslan.sku,
          priceProvider: resultProduct.price,
          price: resultAslan.price,
          provider: resultProduct.provider,
          partNumber: resultProduct.partNumber?.[0]?.partNumber || "",
          availability: resultProduct.availability,
          aslanPrevStatus: resultAslan.stock_status,
          aslanActualStatus: actualStatus,
        },
      ]);
    } catch (error) {
      console.error(
        `Error actualizando producto en Aslan: ${resultAslan.sku}`,
        error
      );
    }
  };

  useEffect(() => {
    if (dataProductsAdminstrated) {
      console.log(dataProductsAdminstrated);
    }
  }, [dataProductsAdminstrated]);

  return (
    <div className="space-y-2">
      <div className="grid gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Administrados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div className="flex flex-col justify-center">
              <div className="text-2xl font-bold">
                {!dataProductsAdminstrated ? (
                  <Spinner size="sm" />
                ) : (
                  dataProductsAdminstrated.length
                )}
              </div>
              <div className="flex items-center space-x-4">
                {loadingPercentage !== 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {`${loadingPercentage.toFixed(2)}%`}
                  </p>
                ) : (
                  ""
                )}

                <Button
                  isDisabled={isLoading}
                  size="sm"
                  onPress={() => {
                    router.push("/icc-aslan-dashboard/identify");
                  }}
                  color="secondary"
                  isIconOnly
                >
                  <Layers />
                </Button>
              </div>
            </div>
            <Button
              color="primary"
              onPress={handleUpdateStock}
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
      <div className="grid gap-4 md:gap-2 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center w-full">
            <div className="grid gap-2 w-full items-center">
              <CardTitle>Productos Actualizados</CardTitle>
              <CardDescription className="w-full">
                <span className="flex justify-between items-center w-full">
                  <span>Lista de los productos actualizados</span>
                  {productsUpdated.length > 0 && (
                    <span className="flex items-center gap-2">
                      <span>Descargar datos en Excel </span>
                      <ExcelExportButton data={productsUpdated} />
                    </span>
                  )}
                </span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {productsUpdated.length > 0 ? (
              <>
                <ListProductUpdatedDashboard productsRows={productsUpdated} />
              </>
            ) : (
              <span className="text-muted-foreground">
                Haga click en el botón{" "}
                <span className="font-bold">Actualizar</span> para empezar a
                actualizar los productos
              </span>
            )}
          </CardContent>
        </Card>
        <ListOrders wooOrders={dataOrdersAslan} />
      </div>
    </div>
  );
}
