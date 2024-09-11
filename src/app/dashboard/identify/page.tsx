"use client";
import { useMutation } from "@tanstack/react-query";
import { getAslanProducts } from "./_actions/get-aslan-products";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridRenderCellParams,
  GridSortCellParams,
} from "@mui/x-data-grid";
import { extractPartNumber } from "@/lib/functions/ProductFunctions";
import { getAllProducts } from "../_actions/get-all-products";
import { getProductsByPage } from "../_actions/get-product-by-page";
import { AslanWooAPIProduct } from "@/Resources/API/ASLAN/entities/AslanWooAPIProduct";
import { ProductType } from "@/domain/product/entities/Product";
import { UnicomAPIProduct } from "@/Resources/API/Unicom/entities/Product/UnicomAPIProduct";
import ListSameProduct from "./components/ListSameProducts";
import { Button } from "@nextui-org/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@nextui-org/spinner";

export default function Page() {
  const [productList, setProductList] = useState<AslanWooAPIProduct[]>([]);
  const [unicomProducts, setUnicomProducts] = useState<ProductType[]>([]);
  const [comparisonList, setComparisonList] = useState<any>([]);

  const {
    data,
    isError,
    isSuccess,
    isPending,
    mutateAsync: server_getAslanProducts,
  } = useMutation({
    mutationFn: ({ page, per_page }: { page: number; per_page: number }) =>
      getAslanProducts(page, per_page),
  });

  const {
    data: dataUnicomProducts,
    isError: isErrorUnicomProducts,
    isSuccess: isSuccessUnicomProducts,
    isPending: isPendingUnicomProducts,
    mutateAsync: server_getAllUnicomProducts,
  } = useMutation({
    mutationFn: ({ page }: { page: number }) => getProductsByPage({ page }),
  });

  const handleGetProducts = async () => {
    // get all products iterating
    let page = 1;
    let per_page = 100;
    let response: any[] = []; // Define la variable response fuera del bucle

    do {
      // Obtén los productos de la página actual
      response = await server_getAslanProducts({ page, per_page });

      // Verifica si la respuesta contiene productos
      if (response.length === 0) {
        console.log("No se encontraron más productos.");
        break; // Sale del bucle si no hay más productos
      }

      // Realizar el guardado de PartNumber
      const productListWithPartNumbers = response.map((product) => {
        return {
          ...product,
          partNumber: extractPartNumber(product.description),
        };
      });

      // Añade los productos de la respuesta al array principal
      setProductList((prev: any) => [...prev, ...productListWithPartNumbers]);

      // Incrementa el número de página
      page++;
    } while (response.length === per_page); // Continúa mientras la respuesta tenga el número máximo de productos por página
  };

  const handleGetUnicomProducts = async () => {
    let page = 1;
    let response: any[] = [];

    do {
      response = await server_getAllUnicomProducts({ page });

      if (response.length === 0) {
        console.log("No se encontraron más productos.");
        break;
      }

      setUnicomProducts((prev: any) => [...prev, ...response]);

      page++;
    } while (response.length >= 190);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "price", headerName: "Price" },
    {
      field: "part_number",
      headerName: "Part Number",
      renderCell: (params: GridRenderCellParams) =>
        params.row.description && <div>{params.row.partNumber}</div>,
      flex: 1,
    },
  ];

  const unicomColumns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Name", flex: 1 },
    { field: "price", headerName: "Price" },
    {
      field: "part_number",
      headerName: "Part Number",
      renderCell: (params: GridRenderCellParams) =>
        params.row.partNumber && (
          <div>{params.row.partNumber[0].partNumber}</div>
        ),
      flex: 1,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificar Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          isDisabled={isPending || isPendingUnicomProducts}
          onClick={() => {
            handleGetProducts();
            handleGetUnicomProducts();
          }}
        >
          {isPending || isPendingUnicomProducts ? (
            <Spinner />
          ) : (
            "Comenzar Identificacion"
          )}
        </Button>
        <div>
          <ListSameProduct
            comparisonListAslan={productList}
            comparisonListB={unicomProducts}
          />
        </div>
      </CardContent>
    </Card>
  );
}
