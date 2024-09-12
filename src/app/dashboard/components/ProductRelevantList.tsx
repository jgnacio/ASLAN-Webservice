"use client";
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
import { Select } from "@/components/ui/select";

export function CustomFooterStatusComponent(
  props: NonNullable<GridSlotsComponentsProps["footer"]>
) {
  return <Box sx={{ p: 1, display: "flex" }}>test</Box>;
}

export default function ProductRelevantList() {
  const router = useRouter();
  const [rows, setRows] = useState<any>([]);
  const [category, setCategory] = useState<UnicomAPICategory>(
    defaultUnicomAPIRelevantCategories[0]
  );

  const {
    mutateAsync: server_getRelevantProducts,
    data: dataGetProductsByPage,
    isPending: isLoadingGetProductsByPage,
  } = useMutation({
    mutationFn: ({
      page,
      category,
    }: {
      page: number;
      category: UnicomAPICategory;
    }) => getRelevantProducts({ page, category }),
  });

  const {
    isPending: isLoadingGetAllProducts,
    data: dataGetAllProducts,
    mutateAsync: server_getAllProducts,
  } = useMutation({
    mutationFn: () => getAllProducts(),
  });

  const {
    mutateAsync: server_getCart,
    isSuccess,
    isPending,
    data: dataCart,
    isError,
  } = useMutation({
    mutationFn: getCart,
  });

  useEffect(() => {
    server_getCart();
  }, []);

  const columns: GridColDef[] = [
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
      field: "sku",
      headerName: "SKU",
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
        params.row.partNumber[0].partNumber ? (
          <HoverCardActions content={params.row.partNumber[0].partNumber} />
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      field: "edit",
      headerName: "Publicar",
      type: "actions",
      sortable: false,
      resizable: false,

      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/dashboard/product/${params.row.sku}/edit`}>
          <Button color="secondary" isIconOnly onClick={() => router.push(``)}>
            <FilePen className="h-5 w-5 text-muted-foreground" />
          </Button>
        </Link>
      ),
    },
    {
      field: "add",
      headerName: "Agregar",
      type: "actions",
      resizable: false,

      sortable: false,
      renderCell: (params: GridRenderCellParams) =>
        isPending ? (
          <Spinner color="primary" />
        ) : (
          <ButtonAddToCart params={{ id: params.row.sku, cart: dataCart }} />
        ),
    },
  ];

  useEffect(() => {
    if (dataGetProductsByPage) {
      handleSetRows(dataGetProductsByPage);
    }
  }, [dataGetProductsByPage]);

  useEffect(() => {
    if (category) {
      server_getRelevantProducts({
        page: 1,
        category: category,
      });
    }
  }, [category]);

  const handleSetRows = (products: ProductType[]) => {
    const newRows = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        marca: product.marca,
        stock: product.stock,
        guaranteeDays: product.guaranteeDays,
        partNumber: product.partNumber,
        sku: product.sku,
        availability: product.availability,
      };
    });
    setRows(newRows);
  };

  const handleSetAllNewRows = (products: ProductType[]) => {
    const newRows = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        marca: product.marca,
        stock: product.stock,
        guaranteeDays: product.guaranteeDays,
        partNumber: product.partNumber,
        avalability: product.availability,
        sku: product.sku,
      };
    });
    setRows(newRows);
  };

  return (
    <div className="w-full h-full">
      <Select></Select>
      {isLoadingGetAllProducts ? "cargado todos los productos" : ""}
      {isLoadingGetProductsByPage ? (
        <Spinner color="primary" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnSelector
            disableRowSelectionOnClick
            rowHeight={55}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20]}
          ></DataGrid>
        </motion.div>
      )}
    </div>
  );
}
