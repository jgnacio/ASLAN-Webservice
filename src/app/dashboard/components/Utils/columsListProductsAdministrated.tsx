import { Tooltip } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { Search } from "lucide-react";

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
];
