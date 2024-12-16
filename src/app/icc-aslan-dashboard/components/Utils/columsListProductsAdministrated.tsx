"use client";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { CircleAlert } from "lucide-react";
import ViewRelatedProducts from "../../identify/components/ViewRelatedProducts";
import ProductRelationConfig from "../ProductRelationConfig";

export const columnsListProductsAdministrated: GridColDef[] = [
  { field: "title", headerName: "Product", flex: 1 },
  {
    field: "price",
    headerName: "Precio",
    type: "number",
    width: 150,
    resizable: false,
    valueFormatter: (value, row, column, apiRef) => {
      return `${row.price} U$D`;
    },
  },
  { field: "skuInterno", headerName: "SKU Interno", width: 300 },
  {
    field: "partNumber",
    headerName: "Identificadores",
    width: 300,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        {params.row.relations && params.row.relations.length > 0 ? (
          <ViewRelatedProducts row={params.row} />
        ) : (
          <span className="text-muted-foreground">
            N/A <CircleAlert className="text-destructive" size={20} />
          </span>
        )}
      </div>
    ),
  },

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
