"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { getProductsAdministrated } from "./_actions/get-product-administrated";

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

  // const {
  //   data: dataAslanPublishedFromAdmin,
  //   isError: isErrorAslanPublishedFromAdmin,
  //   isSuccess: isSuccessAslanPublishedFromAdmin,
  //   isLoading: isLoadingAslanPublishedFromAdmin,
  // } = useQuery({
  //   queryKey: ["product-aslan-published-relatons"],
  //   queryFn: () => getRelations(),
  // });

  const columns = [
    { field: "skuInterno", headerName: "SKU Interno", width: 150 },
    { field: "title", headerName: "Product", flex: 1 },
    {
      field: "partNumber",
      headerName: "Identificadores",
      width: 300,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          <Tooltip
            title={
              <div>
                {params.row.relations.map((relation: any, index: number) => (
                  <div
                    key={index}
                    className="flex text-lg space-x-2 items-center w-full"
                  >
                    <a
                      target="_blank"
                      href={`https://www.unicom.com.uy/Producto?id=${relation.sku_provider}`}
                    >
                      <Button variant="solid" color="secondary">
                        <Search /> SKU
                      </Button>
                    </a>
                    <a
                      target="_blank"
                      href={`https://www.unicom.com.uy/Busqueda?SearchQuery=${relation.PartNumber}`}
                    >
                      <Button variant="solid" color="secondary">
                        <Search /> PartNumber
                      </Button>{" "}
                    </a>
                    {relation.name && (
                      <span className="rounded-xl overflow-hidden">
                        {relation.name === "Unicom" && (
                          <img src="https://assets.apidog.com/app/project-icon/custom/20240326/d9d73462-4e88-42d7-ae58-e5b33d38c626.jpeg"></img>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            }
          >
            <div>
              {params.row.relations.map((relation: any) => {
                return (
                  <span key={relation.ID_Provider}>
                    {relation.PartNumber}/
                    {relation.ID_Provider === 1 && "Unicom"},
                  </span>
                );
              })}
            </div>
          </Tooltip>
        </div>
      ),
    },
    { field: "price", headerName: "Price" },
  ];

  const unicomColumns = [
    {
      field: "title",
      headerName: "Product",
      flex: 1,

      renderCell: (params: GridRenderCellParams) => (
        <div>{params.row.title}</div>
      ),
    },
    { field: "price", headerName: "Price" },
    {
      field: "partNumber",
      headerName: "Part Number",

      flex: 1,
    },
  ];

  useEffect(() => {
    if (dataAslanPublishedFromAdmin) {
      console.log(dataAslanPublishedFromAdmin);
    }
  }, [dataAslanPublishedFromAdmin]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Administrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {dataAslanPublishedFromAdmin && (
            <DataGrid
              rows={dataAslanPublishedFromAdmin}
              columns={columns}
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
        </div>
      </CardContent>
    </Card>
  );
}
