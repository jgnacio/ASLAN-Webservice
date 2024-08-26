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
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/dashboard/product/${params.row.sku}`}>
          {params.row.title}
        </Link>
      ),
      flex: 1,
    },
    {
      field: "price",
      headerName: "Precio",
      type: "number",
      width: 90,
    },
    // { field: "availability", headerName: "Disponibilidad", width: 120 },
    { field: "marca", headerName: "Marca", width: 120 },
    { field: "stock", headerName: "Stock", type: "number", width: 90 },
    {
      field: "guaranteeDays",
      headerName: "Garantia",
      type: "number",
      width: 90,
    },
    { field: "sku", headerName: "SKU", flex: 1 },
    {
      field: "add",
      headerName: "",
      type: "actions",
      sortable: false,
      renderCell: (params: GridRenderCellParams) =>
        isPending ? (
          <Spinner color="primary" />
        ) : (
          <ButtonAddToCart params={{ id: params.row.sku, cart: dataCart }} />
        ),
    },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) =>
    //     `${row.firstName || ""} ${row.lastName || ""}`,
    // },
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
        guaranteeDays: product.guaranteeDays,
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
        guaranteeDays: product.guaranteeDays,
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
            autoHeight
            onRowClick={(params) => {
              router.push(`/dashboard/product/${params.row.sku}/edit`);
            }}
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
