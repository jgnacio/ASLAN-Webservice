import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const ExcelExportButton = ({ data }: { data: any }) => {
  const handleExport = () => {
    // Translate data with Spanish column headers
    const translatedData = data.map((item: any) => ({
      ID: item.id,
      Título: item.title,
      Marca: item.marca,
      Stock: item.stock,
      "Días de Garantía": item.guaranteeDays,
      "SKU Interno": item.sku,
      "Precio Proveedor": item.priceProvider,
      Precio: item.price,
      "Número de Parte": item.partNumber,
      Disponibilidad:
        item.availability === "in_stock"
          ? "En Stock"
          : item.availability === "on_demand"
          ? "En Reserva"
          : item.availability,
      "Estado Anterior":
        item.aslanPrevStatus === "draft"
          ? "Borrador"
          : item.aslanPrevStatus === "publish"
          ? "Publicado"
          : item.aslanPrevStatus,
      "Estado Actual":
        item.aslanActualStatus === "draft"
          ? "Borrador"
          : item.aslanActualStatus === "publish"
          ? "Publicado"
          : item.aslanActualStatus,
    }));
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(translatedData);

    // Customize column widths
    const columnWidths = [
      { wch: 5 }, // id
      { wch: 40 }, // title
      { wch: 15 }, // marca
      { wch: 5 }, // stock
      { wch: 5 }, // guaranteeDays
      { wch: 20 }, // sku
      { wch: 15 }, // priceProvider
      { wch: 10 }, // price
      { wch: 20 }, // partNumber
      { wch: 15 }, // availability
      { wch: 20 }, // aslanPrevStatus
      { wch: 20 }, // aslanActualStatus
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Data");

    XLSX.writeFile(workbook, "product_data.xlsx", {
      bookType: "xlsx",
      type: "buffer",
    });
  };

  return (
    <Button variant={"outline"} size={"icon"} onClick={handleExport}>
      <PiMicrosoftExcelLogoFill size={20} />
    </Button>
  );
};

export default ExcelExportButton;
