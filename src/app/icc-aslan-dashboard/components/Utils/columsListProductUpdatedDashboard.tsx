import { Product, ProductType } from "@/domain/product/entities/Product";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import { getAllProducts } from "../../_actions/get-all-products";
import { getRelevantProducts } from "../../_actions/get-relevant-products";
import ButtonAddToCart from "../ButtonAddToCart";
import { getCart } from "../../cart/_actions/get-cart";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { FilePen, Plane, PlaneLanding } from "lucide-react";
import Link from "next/link";
import HoverCardActions from "../HoverCardActions";
import StockStatus from "../StockStatus";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { UnicomAPICategory } from "@/Resources/API/Unicom/entities/Category/UnicomAPICategory";
import { defaultUnicomAPIRelevantCategories } from "@/Resources/API/Unicom/UnicomAPIRequets";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";

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
      const { aslanPrevStatus } = params.row;

      const getBadge = (status: string) => {
        switch (status) {
          case "out_of_stock":
            return (
              <Badge variant="outline" className="text-muted-foreground">
                Sin existencias
              </Badge>
            );
          case "deleted":
            return (
              <Badge variant="outline" className="text-red-400">
                Eliminado
              </Badge>
            );
          case "in_stock":
            return (
              <Badge variant="outline" className="text-success-400">
                Hay existencias
              </Badge>
            );
          default:
            return (
              <Badge variant="outline" className="text-muted-foreground">
                Sin cambios
              </Badge>
            );
        }
      };

      return getBadge(aslanPrevStatus || "unknown");
    },
  },
  {
    field: "aslanActualStatus",
    headerName: "est. Actual",
    minWidth: 90,
    flex: 1,
    resizable: false,
    renderCell: (params: GridRenderCellParams) => {
      const { aslanActualStatus } = params.row;
      console.log(aslanActualStatus);

      const getBadge = (status: string) => {
        switch (status) {
          case "out_of_stock":
            return (
              <Badge variant="outline" className="text-muted-foreground">
                Sin existencias
              </Badge>
            );
          case "deleted":
            return (
              <Badge variant="outline" className="text-red-400">
                Eliminado
              </Badge>
            );
          case "in_stock":
            return (
              <Badge variant="outline" className="text-success-400">
                Hay existencias
              </Badge>
            );
          default:
            return (
              <Badge variant="outline" className="text-muted-foreground">
                Sin cambios
              </Badge>
            );
        }
      };

      return getBadge(aslanActualStatus || "unknown");
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
