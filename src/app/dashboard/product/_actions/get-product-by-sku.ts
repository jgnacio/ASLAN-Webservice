"use server";

import { Product, ProductType } from "@/domain/product/entities/Product";
import { PCServiceAPIProductAdapter } from "@/Resources/API/PC Service/adapters/PCServiceAPIProductAdapter";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";

export const getProductBySku = async (
  sku: string,
  provider: string
): Promise<ProductType | null> => {
  if (provider === "unicom") {
    const unicomAPIProductAdapter = new UnicomAPIProductAdapter();
    const product = await unicomAPIProductAdapter.getBySKU(sku);
    if (!product) {
      return null;
    }
    return product.toPlainObject();
  } else if (provider === "PC Service") {
    const pcServiceAPIProductAdapter = new PCServiceAPIProductAdapter();
    const product = await pcServiceAPIProductAdapter.getBySKU(sku);
    if (!product) {
      return null;
    }
    return product.toPlainObject();
  }

  const unicomAPIProductAdapter = new UnicomAPIProductAdapter();
  const product = await unicomAPIProductAdapter.getBySKU(sku);
  if (!product) {
    return null;
  }
  return product.toPlainObject();
};
