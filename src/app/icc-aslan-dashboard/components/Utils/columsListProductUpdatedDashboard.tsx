import { ProductType } from "@/domain/product/entities/Product";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@mui/material";
import { Plane } from "lucide-react";
import HoverCardActions from "../HoverCardActions";
import StockStatus from "../StockStatus";

export const columsListProductUpdatedDashboard: GridColDef[] = [
  {
    field: "title",
    headerName: "Producto",
    width: 250,
    resizable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div className="flex flex-col h-full w-full justify-center items-start">
        <HoverCardActions content={params.row.title} />
        {params.row.estimatedArrivalDate && (
          <Tooltip
            title={`Fecha estimada de Arribo ${params.row.estimatedArrivalDate?.getDate()}/${
              params.row.estimatedArrivalDate?.getMonth() + 1
            }/${params.row.estimatedArrivalDate?.getFullYear()}`}
          >
            <Plane className="text-blue-400" size={18} />
          </Tooltip>
        )}
      </div>
    ),
  },
  {
    field: "priceProvider",
    headerName: "U$D Proveedor",
    type: "number",
    width: 120,
    resizable: false,
  },
  {
    field: "price",
    headerName: "U$D Publicado",
    type: "number",
    width: 90,
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
  // { field: "availability", headerName: "Disponibilidad", width: 120 },
  {
    field: "marca",
    headerName: "Marca",
    minWidth: 80,
    maxWidth: 70,

    resizable: false,
  },
  {
    field: "availability",
    headerName: "Stock",
    type: "string",
    width: 50,
    resizable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <StockStatus
          stock={params.row.availability as ProductType["availability"]}
        />
      );
    },
  },
  {
    field: "stock",
    headerName: "Stock",
    type: "number",
    width: 70,
    resizable: false,
  },

  {
    field: "sku",
    headerName: "SKU Interno",
    minWidth: 120,
    maxWidth: 150,
    flex: 1,

    resizable: false,
    renderCell: (params: GridRenderCellParams) =>
      params.row.sku ? (
        <HoverCardActions content={params.row.sku} />
      ) : (
        <span className="text-muted-foreground">N/A</span>
      ),
  },
  {
    field: "partNumber",
    headerName: "Part Number",
    minWidth: 120,
    flex: 1,
    resizable: false,

    renderCell: (params: GridRenderCellParams) =>
      params.row.partNumber ? (
        <HoverCardActions content={params.row.partNumber} />
      ) : (
        <span className="text-muted-foreground">N/A</span>
      ),
  },
];
