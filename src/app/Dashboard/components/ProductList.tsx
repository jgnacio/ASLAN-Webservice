"use client";
import { ProductType } from "@/domain/product/entities/Product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOffersProductsByPage } from "../_actions/get-offer-products";
import ProductRow from "@/components/ProductRow";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { RiShoppingCartFill } from "react-icons/ri";
import ButtonAddToCart from "./ButtonAddToCart";
import { getAllFeaturedProducts } from "../_actions/get-all-featured-products";
import { getFeaturedProductsByPage } from "../_actions/get-featured-products";
import { getAllOfferProducts } from "../_actions/get-all-offer-products";
import { getAllProducts } from "../_actions/get-all-products";

export default function ProductList() {
  const [rows, setRows] = useState<any>([]);

  const { data: dataGetProductsByPage, isLoading: isLoadingGetProductsByPage } =
    useQuery({
      queryKey: ["get-offer-products"],
      queryFn: () => getOffersProductsByPage({ page: 1 }),
    });

  // const {
  //   isLoading: isLoadingGetAllProductsByPage,
  //   data: dataGetAllFeaturedProductsByPage,
  // } = useQuery({
  //   queryKey: ["get-all-featured-products"],
  //   queryFn: getAllFeaturedProducts,
  // });

  const {
    isPending: isLoadingGetAllProducts,
    data: dataGetAllProducts,
    mutateAsync: server_getAllProducts,
  } = useMutation({
    mutationFn: () => getAllProducts(),
  });

  const columns: GridColDef[] = [
    { field: "title", headerName: "Producto", flex: 1 },
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
      renderCell: (params: GridRenderCellParams) => (
        <ButtonAddToCart params={{ id: params.row.sku }} />
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
    if (dataGetProductsByPage && rows.length === 0) {
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

  const handleGetAllProducts = async () => {
    // const products = await server_getAllProducts();
    // console.log("products", products);
    // handleSetAllNewRows(products);
  };

  return (
    <div>
      <h2>ProductList</h2>
      <div>
        <p>Obtener todos los productos en oferta</p>
        <Button
          disabled={isLoadingGetAllProducts}
          onClick={() => {
            handleGetAllProducts();
          }}
        >
          Obtener
        </Button>
        <div className="w-full h-full">
          {isLoadingGetAllProducts ? "cargado todos los productos" : ""}
          {isLoadingGetProductsByPage ? (
            "Cargando..."
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnSelector
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              autoHeight
            />
          )}
        </div>
      </div>
    </div>
  );
}
