"use server";

import { Product, ProductType } from "@/domain/product/entities/Product";
import { PCServiceAPIProductAdapter } from "@/Resources/API/PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "@/Resources/API/Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { CDRMediosAPIProductAdapter } from "@/Resources/API/CDRMedios/adapters/CDRMediosAPIProductAdapter";

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
  } else if (provider === "PCService") {
    const pcServiceAPIProductAdapter = new PCServiceAPIProductAdapter();
    const product = await pcServiceAPIProductAdapter.getBySKU(sku);
    if (!product) {
      return null;
    }
    return product.toPlainObject();
  } else if (provider === "Solutionbox") {
    const solutionboxAPIProductAdapter = new SolutionboxAPIProductAdapter();
    const product = await solutionboxAPIProductAdapter.getBySKU(sku);
    if (!product) {
      return null;
    }
    return product.toPlainObject();
  } else if (provider === "CDR") {
    const cdrMediosAPIProductAdapter = new CDRMediosAPIProductAdapter();
    const product = await cdrMediosAPIProductAdapter.getBySKU(sku);
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
