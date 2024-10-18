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
import { useRouter } from "next/navigation";
import ButtonAddToCart from "./ButtonAddToCart";

import { useToast } from "@/components/ui/use-toast";
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
  const router = useRouter();
  const { toast } = useToast();
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
          <Link href={`/dashboard/product/${params.row.sku}/edit`}>
            <Button
              color="secondary"
              isIconOnly
              onClick={() => router.push(``)}
            >
              <FilePen className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        ),
      });
    }

    if (cart) {
      columns.push({
        field: "add",
        headerName: "Agregar",
        type: "actions",
        resizable: false,

        sortable: false,
        renderCell: (params: GridRenderCellParams) =>
          !cart ? (
            <Spinner color="primary" />
          ) : (
            <ButtonAddToCart params={{ id: params.row.sku, cart }} />
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
      rowHeight={45}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      pageSizeOptions={[10, 20]}
    />
  );
}
