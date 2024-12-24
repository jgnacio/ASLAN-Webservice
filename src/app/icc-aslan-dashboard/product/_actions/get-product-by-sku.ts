"use server";
import { ProductType } from "@/domain/product/entities/Product";
import { APIsAdapterSingleton } from "@/Resources/API/CommandCenter/adapters/APIsSingeltonAdapter";

export const getProductBySku = async (
  sku: string,
  provider: string
): Promise<ProductType | null> => {
  try {
    const adapter = APIsAdapterSingleton.getAdapter(provider);
    const product = await adapter.getBySKU(sku);
    return product ? product.toPlainObject() : null;
  } catch (error) {
    console.error(
      `Error retrieving product for provider "${provider}":`,
      error
    );
    return null;
  }
};
