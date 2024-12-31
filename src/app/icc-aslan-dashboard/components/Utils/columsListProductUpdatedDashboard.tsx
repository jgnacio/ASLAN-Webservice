import { ProductType } from "@/domain/product/entities/Product";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@mui/material";
import { Plane } from "lucide-react";
import HoverCardActions from "../HoverCardActions";
import StockStatus from "../StockStatus";
import ToolsProductList from "../ToolsProductList";

export const columsListProductUpdatedDashboard: GridColDef[] = [
  {
    field: "title",
    headerName: "Producto",
    width: 250,
    resizable: false,
    renderCell: (params: GridRenderCellParams) =>
      params.row.title && params.row.sku ? (
        <ToolsProductList
          title={params.row.title}
          partNumber={params.row.partNumber || params.row.sku}
          sku={params.row.sku}
          price={params.row.priceProvider}
          provider={params.row.provider}
        />
      ) : (
        <span className="text-muted-foreground">{params.row.title}</span>
      ),
  },
  {
    field: "provider",
    headerName: "Proveedor",
    width: 100,
    valueGetter: (value, row) => {
      return row.provider.name;
    },
  },
  {
    field: "priceProvider",
    headerName: "U$D Proveedor",
    type: "number",
    width: 70,
    resizable: false,
  },
  {
    field: "price",
    headerName: "U$D Publicado",
    type: "number",
    width: 70,
    resizable: false,
  },
  {
    field: "aslanPrevStatus",
    headerName: "est. Anterior",
    minWidth: 90,
    flex: 1,
    resizable: false,
    renderCell: (params: GridRenderCellParams) => {
      const status = params.row.aslanPrevStatus;
      return (
        <Badge
          variant="outline"
          className={
            status === "instock"
              ? "text-success-400"
              : status === "outofstock"
              ? "text-yellow-400"
              : status === "on_demand"
              ? "text-blue-400"
              : status === "deleted"
              ? "text-red-400"
              : "text-muted-foreground"
          }
        >
          {status === "instock"
            ? "En Stock"
            : status === "outofstock"
            ? "Sin Stock"
            : status === "on_demand"
            ? "Bajo Pedido"
            : status === "deleted"
            ? "Eliminado"
            : "Desconocido"}
        </Badge>
      );
    },
  },
  {
    field: "aslanActualStatus",
    headerName: "est. Actual",
    minWidth: 90,
    flex: 1,
    resizable: false,
    renderCell: (params: GridRenderCellParams) => {
      const status = params.row.aslanActualStatus;
      return (
        <Badge
          variant="outline"
          className={
            status === "instock"
              ? "text-success-400"
              : status === "outofstock"
              ? "text-yellow-400"
              : status === "on_demand"
              ? "text-blue-400"
              : status === "deleted"
              ? "text-red-400"
              : "text-muted-foreground"
          }
        >
          {status === "instock"
            ? "En Stock"
            : status === "outofstock"
            ? "Sin Stock"
            : status === "on_demand"
            ? "Bajo Pedido"
            : status === "deleted"
            ? "Eliminado"
            : "Desconocido"}
        </Badge>
      );
    },
  },
  {
    field: "marca",
    headerName: "Marca",
    minWidth: 80,
    maxWidth: 70,

    resizable: false,
  },
  {
    field: "availability",
    headerName: "Disponibilidad",
    type: "string",
    width: 90,
    resizable: false,
    valueFormatter: (value, row, column, apiRef) => {
      switch (row.availability) {
        case "in_stock":
          return "En Stock";
        case "out_of_stock":
          return "Sin Stock";
        default:
          return "Consultar";
      }
    },
    cellClassName: (params) => {
      // Aplica la clase CSS basada en el valor formateado
      if (params.value === "in_stock") {
        return "text-green-500";
      } else if (params.value === "out_of_stock") {
        return "text-yellow-500";
      } else {
        return "text-blue-500";
      }
    },
  },
  {
    field: "stock",
    headerName: "Stock",
    type: "number",
    width: 60,
    resizable: false,
  },

  {
    field: "sku",
    headerName: "SKU Interno",
    minWidth: 120,
    maxWidth: 150,
    flex: 1,
    resizable: false,
  },
  {
    field: "partNumber",
    headerName: "Part Number",
    minWidth: 120,
    flex: 1,
    resizable: false,
    valueGetter: (value, row) => {
      if (!row.partNumber) {
        return "";
      }
      if (row.partNumber[0].partNumber) {
        return row.partNumber[0].partNumber;
      }
      return row.partNumber;
    },
  },
];
