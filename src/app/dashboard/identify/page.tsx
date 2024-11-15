"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { getProductsAdministrated } from "./_actions/get-product-administrated";
import { Spinner } from "@nextui-org/spinner";
import { columnsListProductsAdministrated } from "../components/Utils/columsListProductsAdministrated";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { deleteProductRelation } from "./_actions/delete-product-relation";

export default function Page() {
  const { toast } = useToast();

  const {
    data: dataAslanPublishedFromAdmin,
    isError: isErrorAslanPublishedFromAdmin,
    isSuccess: isSuccessAslanPublishedFromAdmin,
    isLoading: isLoadingAslanPublishedFromAdmin,
  } = useQuery({
    queryKey: ["product-aslan-administrated-products"],
    queryFn: () => getProductsAdministrated(),
  });

  useEffect(() => {
    if (dataAslanPublishedFromAdmin) {
    }
  }, [dataAslanPublishedFromAdmin]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Administrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {dataAslanPublishedFromAdmin ? (
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
          ) : (
            <Spinner className="h-12 w-12" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
