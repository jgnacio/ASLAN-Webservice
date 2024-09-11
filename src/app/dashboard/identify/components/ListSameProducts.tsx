import { ProductType } from "@/domain/product/entities/Product";
import { AslanWooAPIProduct } from "@/Resources/API/ASLAN/entities/AslanWooAPIProduct";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import HoverCardActions from "../../components/HoverCardActions";
import { AlignEndHorizontal } from "lucide-react";

export default function ListSameProduct({
  comparisonListAslan,
  comparisonListB,
}: {
  comparisonListAslan: AslanWooAPIProduct[];
  comparisonListB: ProductType[];
}) {
  const [comparisonList, setComparisonList] = useState<any>([]);

  const unicomColumns = [
    {
      field: "title",
      headerName: "Nombre",
      renderCell: (params: GridRenderCellParams) => (
        <HoverCardActions content={params.row.name} />
      ),
      flex: 1,
      resizable: false,
    },
    {
      field: "price",
      headerName: "Precio Publicado",
      with: 150,
      resizable: false,
    },

    {
      field: "priceB",
      headerName: "Precio Unicom",
      with: 150,
      resizable: false,
    },
    {
      field: "part_number",
      headerName: "Part Number",
      renderCell: (params: GridRenderCellParams) =>
        params.row.partNumber ? (
          <HoverCardActions content={params.row.partNumber} />
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
      flex: 1,
      resizable: false,
    },
    {
      field: "titleB",
      headerName: "Nombre Unicom",
      renderCell: (params: GridRenderCellParams) =>
        params.row.titleB ? (
          <HoverCardActions content={params.row.titleB} />
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
      flex: 1,
      resizable: false,
    },
  ];

  useEffect(() => {
    if (comparisonListAslan.length > 0 && comparisonListB.length > 0) {
      const list = comparisonListAslan.filter((product: any) => {
        const sameProduct = comparisonListB.find(
          (productB: any) =>
            productB.partNumber[0].partNumber === product.partNumber
        );
        if (sameProduct) {
          return {
            id: sameProduct.id,
            title: sameProduct.title,
            price: sameProduct.price,
            partNumber: sameProduct.partNumber,
          };
        }
      });
      //   add properties of the other productList
      list.forEach((product: any) => {
        const productUnicom = comparisonListB.find(
          (productB: any) =>
            productB.partNumber[0].partNumber === product.partNumber
        );
        product.partNumberB =
          productUnicom &&
          productUnicom.partNumber &&
          productUnicom.partNumber[0].partNumber;
        product.titleB = productUnicom && productUnicom.title;
        product.priceB = productUnicom && productUnicom.price;
      });
      setComparisonList(list);
    }
  }, [comparisonListAslan, comparisonListB]);

  return (
    <div>
      <h1>Productos Unicom Publicados en ASLAN</h1>
      <DataGrid
        rows={comparisonList}
        columns={unicomColumns}
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
    </div>
  );
}
