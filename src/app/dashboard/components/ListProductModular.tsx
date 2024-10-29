"use client";
import { ProductType } from "@/domain/product/entities/Product";
import {
  DataGrid,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useMemo } from "react";

import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { FilePen } from "lucide-react";
import Link from "next/link";
import ButtonAddToCart from "./ButtonAddToCart";

import { columnsDataGridProductList } from "./Utils/TableDataGridProps";
export default function ListProductModular({
  productsRows = [],
  cart,
  publish = true,
  setProductRows,
  productsSelected = [],
  setProductsSelected,
  isSelectable = false,
}: {
  productsRows: ProductType[] | undefined;
  cart?: any;
  publish?: boolean;
  setProductRows?: Function;
  productsSelected?: ProductType[];
  setProductsSelected?: Function;
  isSelectable?: boolean;
}) {
  // Memoriza las columnas para evitar recalcularlas en cada render
  const memoizedColumns = useMemo(() => {
    const columns = [...columnsDataGridProductList];

    if (publish) {
      columns.push({
        field: "edit",
        headerName: "Publicar",
        type: "actions",
        sortable: false,
        resizable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Link
            href={`/dashboard/product/${encodeURI(
              params.row.sku
            )}/edit?provider=${params.row.provider.name}`}
          >
            <Button color="secondary" isIconOnly>
              <FilePen className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        ),
      });
    }

    return columns;
  }, []); // Se ejecuta solo una vez

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    if (!setProductsSelected) return;
    setProductsSelected(newSelection); // Actualiza los IDs seleccionados

    // Obtén los productos seleccionados basados en los IDs
    const selectedItems = productsRows.filter((product) =>
      newSelection.includes(product.id)
    );
    setProductsSelected(selectedItems); // Actualiza el estado con los productos seleccionados
  };

  return (
    <DataGrid
      rows={productsRows}
      columns={memoizedColumns}
      disableRowSelectionOnClick
      checkboxSelection={isSelectable}
      onRowSelectionModelChange={handleSelectionChange}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      pageSizeOptions={[10, 15, 20]}
    />
  );
}
