import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import ToolsProductList from "../ToolsProductList";

export const columnsDataGridProductList: GridColDef[] = [
  {
    field: "title",
    headerName: "Producto",
    minWidth: 300,
    flex: 2,
    resizable: false,
    renderCell: (params: GridRenderCellParams) =>
      params.row.partNumber[0].partNumber &&
      params.row.title &&
      params.row.sku ? (
        <ToolsProductList
          title={params.row.title}
          partNumber={params.row.partNumber[0].partNumber}
          sku={params.row.sku}
          price={params.row.price}
          provider={params.row.provider}
        />
      ) : (
        <span className="text-muted-foreground">{params.row.title}</span>
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
    field: "stock",
    headerName: "Stock",
    type: "string",
    width: 50,
    resizable: false,
  },
  {
    field: "availability",
    headerName: "Disponibilidad",
    type: "string",
    width: 90,
    resizable: false,
    valueFormatter: (value, row, column, apiRef) => {
      switch (row.availability) {
        case "in_stock":
          return "En Stock";
        case "out_of_stock":
          return "Sin Stock";
        default:
          return "Consultar";
      }
    },

    cellClassName: (params) => {
      // Aplica la clase CSS basada en el valor formateado
      if (params.value === "in_stock") {
        return "text-green-500";
      } else if (params.value === "out_of_stock") {
        return "text-red-500";
      } else {
        return "text-yellow-500";
      }
    },
  },

  {
    field: "guaranteeDays",
    headerName: "Garantia",
    type: "number",
    width: 90,
  },
  {
    field: "provider",
    headerName: "Proveedor",
    minWidth: 80,
    // renderCell: (params: GridRenderCellParams) =>
    //   params.row.provider ? (
    //     <motion.div
    //       whileHover={{ scale: 1.1 }}
    //       className="flex items-center justify-center rounded-md w-full h-full "
    //     >
    //       <img
    //         src={params.row.provider.logoUrl}
    //         alt="provider logo"
    //         className="  object-cover h-full aspect-square p-2"
    //       />
    //     </motion.div>
    //   ) : (
    //     <span className="text-muted-foreground">N/A</span>
    //   ),
    valueGetter: (value, row) => {
      return `${row.provider.name || ""}`;
    },
  },
  {
    field: "sku",
    headerName: "SKU",
    flex: 1,
    resizable: false,
    // renderCell: (params: GridRenderCellParams) =>
    //   params.row.sku ? (
    //     <HoverCardActions content={params.row.sku} />
    //   ) : (
    //     <span className="text-muted-foreground">N/A</span>
    //   ),
  },
  {
    field: "partNumber",
    headerName: "Part Number",
    minWidth: 120,
    flex: 1,
    resizable: false,
    valueGetter: (value, row) => {
      return `${row.partNumber[0].partNumber || ""}`;
    },
  },
];
