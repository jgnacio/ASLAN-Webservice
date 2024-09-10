"use client";
import { ProductType } from "@/domain/product/entities/Product";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import { getAllProducts } from "../_actions/get-all-products";
import ButtonAddToCart from "./ButtonAddToCart";
import { getOffersProductsByPage } from "../_actions/get-offer-products";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart } from "../cart/_actions/get-cart";
import { Button } from "@nextui-org/button";
import { FilePen, Plane } from "lucide-react";
import HoverCardActions from "./HoverCardActions";
import StockStatus from "./StockStatus";
import { Tooltip } from "@mui/material";

export default function ProductOfferList() {
  const [rows, setRows] = useState<any>([]);
  const router = useRouter();

  const { data: dataGetProductsByPage, isLoading: isLoadingGetProductsByPage } =
    useQuery({
      queryKey: ["get-offer-products"],
      queryFn: () => getOffersProductsByPage({ page: 1 }),
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
        params.row.partNumber && params.row.partNumber[0].partNumber ? (
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

  const handleSetRows = (products: ProductType[]) => {
    console.log(products);
    const newRows = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        marca: product.marca,
        stock: product.stock,
        availability: product.availability,
        guaranteeDays: product.guaranteeDays,
        partNumber: product.partNumber,
        sku: product.sku,
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
        partNumber: product.partNumber,

        sku: product.sku,
      };
    });
    setRows(newRows);
  };

  return (
    <div className="w-full h-full">
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
            rowHeight={55}
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
