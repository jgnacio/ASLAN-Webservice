"use server";

import { Product, ProductType } from "@/domain/product/entities/Product";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";

export const getProductBySku = async (
  sku: string
): Promise<ProductType | null> => {
  const unicomAPIProductAdapter = new UnicomAPIProductAdapter();
  const product = await unicomAPIProductAdapter.getBySKU(sku);
  if (!product) {
    return null;
  }
  return product.toPlainObject();
};
