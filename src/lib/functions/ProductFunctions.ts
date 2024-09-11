import { ProductType } from "@/domain/product/entities/Product";
import { AslanWooAPIProduct } from "@/Resources/API/ASLAN/entities/AslanWooAPIProduct";
import { UnicomAPIProduct } from "@/Resources/API/Unicom/entities/Product/UnicomAPIProduct";

export const extractPartNumber = (description: string) => {
  // Expresión regular para encontrar el part number en texto plano o en HTML
  const regex = /Part Number\s*[^:]*:\s*([\w\-./# ]+)\b/i;
  const match = description.match(regex);
  if (match) {
    return match[1].trim(); // El primer grupo de captura contiene el part number y se elimina cualquier espacio extra
  }

  return null; // No se encontró ningún part number
};

export const isTheSameProductAslanUnicom = (
  productA: AslanWooAPIProduct,
  productB: ProductType
) => {
  // Compara los part numbers de los productos
  if (productA.description && productB.partNumber) {
    return (
      productB.partNumber[0].partNumber ===
      extractPartNumber(productA.description)
    );
  }
};
