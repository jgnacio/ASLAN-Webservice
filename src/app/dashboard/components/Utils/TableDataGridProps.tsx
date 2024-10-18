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

export const columnsDataGridProductList: GridColDef[] = [
  {
    field: "title",
    headerName: "Producto",
    minWidth: 300,
    flex: 2,
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
    field: "price",
    headerName: "Precio",
    type: "number",
    width: 90,
    resizable: false,
  },
  // { field: "availability", headerName: "Disponibilidad", width: 120 },
  {
    field: "marca",
    headerName: "Marca",
    minWidth: 80,
    maxWidth: 120,

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
    field: "guaranteeDays",
    headerName: "Garantia",
    type: "number",
    width: 90,
  },
  {
    field: "provider",
    headerName: "Proveedor",
    minWidth: 80,
    renderCell: (params: GridRenderCellParams) =>
      params.row.provider ? (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center rounded-md w-full h-full "
        >
          <img
            src={params.row.provider.logoUrl}
            alt="provider logo"
            className="  object-cover h-full aspect-square p-2"
          />
        </motion.div>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      ),
    valueGetter: (value, row) => {
      return `${row.provider.name || ""}`;
    },
  },
  {
    field: "sku",
    headerName: "SKU",
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
      params.row.partNumber[0].partNumber ? (
        <HoverCardActions content={params.row.partNumber[0].partNumber} />
      ) : (
        <span className="text-muted-foreground">N/A</span>
      ),
    valueGetter: (value, row) => {
      return `${row.partNumber[0].partNumber || ""}`;
    },
  },
];
