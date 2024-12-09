"use client";
import { Product, ProductType } from "@/domain/product/entities/Product";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";

import Box from "@mui/material/Box";
import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import { getAllProducts } from "../_actions/get-all-products";
import { getRelevantProducts } from "../_actions/get-relevant-products";
import ButtonAddToCart from "./ButtonAddToCart";
import { getCart } from "../cart/_actions/get-cart";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { FilePen, Plane, PlaneLanding } from "lucide-react";
import Link from "next/link";
import HoverCardActions from "./HoverCardActions";
import StockStatus from "./StockStatus";
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
import { Checkbox } from "@nextui-org/checkbox";

import { useToast } from "@/components/ui/use-toast";
import { columnsDataGridProductList } from "./Utils/TableDataGridProps";
import { ProductsUpdatedDashboard } from "@/Resources/API/entitites/ProductsUpdated";
import { columsListProductUpdatedDashboard } from "./Utils/columsListProductUpdatedDashboard";
export default function ListProductUpdatedDashboard({
  productsRows = [],
}: {
  productsRows: ProductsUpdatedDashboard[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  // Memoriza las columnas para evitar recalcularlas en cada render
  const memoizedColumns = useMemo(() => {
    const columns = [...columsListProductUpdatedDashboard];
    return columns;
  }, []); // Se ejecuta solo una vez

  return (
    <DataGrid
      rows={productsRows}
      columns={memoizedColumns}
      disableRowSelectionOnClick
      rowHeight={45}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 8]}
    />
  );
}
