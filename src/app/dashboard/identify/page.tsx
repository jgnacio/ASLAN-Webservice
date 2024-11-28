"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { columnsListProductsAdministrated } from "../components/Utils/columsListProductsAdministrated";
import { getProductsAdministrated } from "./_actions/get-product-administrated";
import { getProviderByID } from "../_actions/get-provider-by-id";

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

  const {
    mutateAsync: server_getProviderByID,
    data: provider,
    isPending: isLoadingProvider,
    isSuccess: isSuccessProvider,
    isError: isErrorProvider,
  } = useMutation({
    mutationFn: (id: number) => getProviderByID(id),
  });
  const handleUpdateProducts = async (dataAslanPublishedFromAdmin: any) => {
    const updatedProducts = await Promise.all(
      dataAslanPublishedFromAdmin.map(async (product: any) => {
        const relations = await Promise.all(
          product.relations.map(async (relation: any) => {
            const provider = await server_getProviderByID(relation.ID_Provider);

            return {
              ...relation,
              provider: provider.data || {},
            };
          })
        );
        return {
          ...product,
          relations,
        };
      })
    );
    if (!updatedProducts) {
      toast({
        title: "Sin productos para mostrar",
        description: "No se pudieron obtener los productos administrados",
      });
      setProducts([]);
      return;
    }

    setProducts(updatedProducts);
  };

  useEffect(() => {
    if (dataAslanPublishedFromAdmin) {
      handleUpdateProducts(dataAslanPublishedFromAdmin);
    }
  }, [dataAslanPublishedFromAdmin]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Administrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {isSuccessAslanPublishedFromAdmin && products && (
            <DataGrid
              rows={products}
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
      </CardContent>
    </Card>
  );
}
