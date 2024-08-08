"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product } from "@/domain/product/entities/Product";

export const getProductsByPage = async ({
  page,
  category,
}: {
  page: number;
  category?: string;
}): Promise<Product[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = unicomAPIAdapter.getAll({ page, category });
  return products;
};
