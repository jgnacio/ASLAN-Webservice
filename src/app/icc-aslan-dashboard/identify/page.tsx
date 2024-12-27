"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { columnsListProductsAdministrated } from "../components/Utils/columsListProductsAdministrated";
import { getProductsAdministrated } from "./_actions/get-product-administrated";
import { getProviderByID } from "../_actions/get-provider-by-id";
import ProductSearchEngine from "../components/ProductSearchEngine";
import { Separator } from "@radix-ui/react-separator";
import { ImplementProviders } from "@/Resources/API/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);

  const {
    data: dataAslanPublishedFromAdmin,
    isError: isErrorAslanPublishedFromAdmin,
    isSuccess: isSuccessAslanPublishedFromAdmin,
    isLoading: isLoadingAslanPublishedFromAdmin,
  } = useQuery({
    queryKey: ["product-aslan-administrated-products"],
    queryFn: () => getProductsAdministrated(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Administrados</CardTitle>
        <CardDescription className="flex flex-col space-y-2">
          <span>
            Listado de productos administrados en la base de datos de Aslan.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 ">
        <div>
          {isSuccessAslanPublishedFromAdmin && products && (
            <DataGrid
              rows={dataAslanPublishedFromAdmin}
              columns={columnsListProductsAdministrated}
              disableRowSelectionOnClick
              // checkboxSelection
              //  onRowSelectionModelChange={handleSelectionChange}
              rowHeight={45}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20]}
            />
          )}
          {isLoadingAslanPublishedFromAdmin && <Spinner />}
          {isErrorAslanPublishedFromAdmin && (
            <div>
              <h3>Error</h3>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Busqueda de Productos</AccordionTrigger>
            <AccordionContent>
              <Card>
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
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
