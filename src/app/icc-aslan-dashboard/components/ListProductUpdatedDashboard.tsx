"use client";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { ProductsUpdatedDashboard } from "@/Resources/API/entitites/ProductsUpdated";
import { columsListProductUpdatedDashboard } from "./Utils/columsListProductUpdatedDashboard";
export default function ListProductUpdatedDashboard({
  productsRows = [],
}: {
  productsRows: ProductsUpdatedDashboard[];
}) {
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
      pageSizeOptions={[5, 10]}
    />
  );
}
