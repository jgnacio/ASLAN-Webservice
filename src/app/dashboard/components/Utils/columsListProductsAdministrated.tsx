"use client";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import ProductRelationConfig from "../ProductRelationConfig";
import { Separator } from "@radix-ui/react-separator";
import { ImplementProviders } from "@/Resources/API/config";

export const columnsListProductsAdministrated = [
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
            <div className="w-full">
              {params.row.relations.map((relation: any, index: number) => (
                <div>
                  <span className="text-medium">{relation.provider.name}</span>

                  <div
                    key={index}
                    className="flex flex-col text-lg space-x-2 items-center w-full"
                  >
                    <div className="flex w-full justify-between text-sm ">
                      {relation.sku_provider}
                      <a
                        target="_blank"
                        href={`${
                          ImplementProviders.find(
                            (provider) =>
                              provider.name === relation.provider.name
                          )?.searchPageUrl
                        }${relation.sku_provider}`}
                      >
                        <Button
                          variant="outline"
                          color="secondary"
                          className="text-foreground"
                          size={"sm"}
                        >
                          <Search /> SKU
                        </Button>
                      </a>
                    </div>

                    <div className="flex w-full justify-between text-sm ">
                      {relation.PartNumber}
                      <a
                        target="_blank"
                        href={`${
                          ImplementProviders.find(
                            (provider) =>
                              provider.name === relation.provider.name
                          )?.searchPageUrl
                        }${relation.PartNumber}`}
                      >
                        <Button
                          variant="outline"
                          color="secondary"
                          className="text-foreground"
                          size={"sm"}
                        >
                          <Search /> PartNumber
                        </Button>{" "}
                      </a>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          }
        >
          <div>
            {params.row.relations.map((relation: any) => {
              console.log(relation);
              return (
                <span key={relation.ID_Provider}>{relation.PartNumber}</span>
              );
            })}
          </div>
        </Tooltip>
      </div>
    ),
  },
  { field: "price", headerName: "Price" },
  {
    field: "edit",
    headerName: "Editar",
    sortable: false,
    resizable: false,
    renderCell: (params: GridRenderCellParams) => (
      <ProductRelationConfig SKU_Relation={params.row.skuInterno} />
    ),
  },
];
