"use client";
import { ProductType } from "@/domain/product/entities/Product";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetter,
} from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import { FilePen, Plane } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllProducts } from "../_actions/get-all-products";
import { getFeaturedProductsByPage } from "../_actions/get-featured-products";
import { getCart } from "../cart/_actions/get-cart";
import ButtonAddToCart from "./ButtonAddToCart";
import HoverCardActions from "./HoverCardActions";
import StockStatus from "./StockStatus";
import { Tooltip } from "@mui/material";

export default function ProductFeaturedList() {
  const router = useRouter();
  const [rows, setRows] = useState<any>([]);

  const { toast } = useToast();

  const { data: dataGetProductsByPage, isLoading: isLoadingGetProductsByPage } =
    useQuery({
      queryKey: ["get-featured-products"],
      queryFn: () => getFeaturedProductsByPage({ page: 1 }),
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
    {
      field: "marca",
      headerName: "Marca",
      minWidth: 80,
      maxWidth: 90,
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

      valueGetter: (value, row) => {
        return `${row.partNumber[0].partNumber || ""}`;
      },

      filterable: true,
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

  const handleSetRows = (products: ProductType[]) => {
    const newRows = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        marca: product.marca,
        stock: product.stock,
        availability: product.availability,
        guaranteeDays: product.guaranteeDays,
        sku: product.sku,
        partNumber: product.partNumber,
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
        availability: product.availability,
        guaranteeDays: product.guaranteeDays,
        sku: product.sku,
        partNumber: product.partNumber,
      };
    });
    setRows(newRows);
  };

  return (
    <div className="w-full h-full">
      {isLoadingGetAllProducts ? "cargado todos los productos" : ""}
      {isLoadingGetProductsByPage ? (
        <div className="flex justify-center items-center h-[200px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <Spinner color="primary" />
          </motion.div>
        </div>
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
            rowHeight={45}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20]}
          />
        </motion.div>
      )}
    </div>
  );
}
