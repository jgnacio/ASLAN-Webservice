"use client";
import { ProductType } from "@/domain/product/entities/Product";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UnicomAPICategory } from "@/Resources/API/Unicom/entities/Category/UnicomAPICategory";
import { defaultUnicomAPIRelevantCategories } from "@/Resources/API/Unicom/UnicomAPIRequets";
import { Tooltip } from "@mui/material";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import { FilePen, Plane } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRelevantProducts } from "../_actions/get-relevant-products";
import ButtonAddToCart from "./ButtonAddToCart";
import HoverCardActions from "./HoverCardActions";
import StockStatus from "./StockStatus";

import { useToast } from "@/components/ui/use-toast";

export default function ProductRelevantList({ cart }: { cart: any }) {
  const router = useRouter();
  const [rows, setRows] = useState<any>([]);
  const [category, setCategory] = useState<UnicomAPICategory>(
    defaultUnicomAPIRelevantCategories[0]
  );

  const { toast } = useToast();

  const {
    mutateAsync: server_getRelevantProducts,
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
      valueGetter: (value, row) => {
        return `${row.partNumber[0].partNumber || ""}`;
      },
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
        !cart ? (
          <Spinner color="primary" />
        ) : (
          <ButtonAddToCart params={{ id: params.row.sku, cart: cart }} />
        ),
    },
  ];

  const handleSearchCategory = async () => {
    const response = await server_getRelevantProducts({
      page: 1,
      category: category,
    });

    if (response) {
      handleSetRows(response);
    }
  };

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

  return (
    <div className="w-full h-full ">
      <div className="flex space-x-2 h-16 -mt-16 items-center w-full justify-end">
        <Select
          defaultValue="Notebooks"
          onValueChange={(value) => {
            const category = defaultUnicomAPIRelevantCategories.find(
              (category) => category.name === value
            );
            if (category) {
              setCategory(category);
              console.log("category", category);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categorias</SelectLabel>
              {defaultUnicomAPIRelevantCategories.map((category, index) => (
                <SelectItem value={category.name} key={category.code + index}>
                  {category.nameES}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" />
        <Button color="primary" onClick={handleSearchCategory}>
          Buscar
        </Button>
      </div>

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
          {rows && rows.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, easings: "easeInOut" }}
              className="flex justify-center items-center h-[200px]"
            >
              <p className="font-semibold">Realiza una busqueda!</p>
            </motion.div>
          ) : (
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
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
