"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/UnicomAPIAdapters";
import { Product } from "@/domain/product/Product";

export const getProductsByPage = async ({
  page,
}: {
  page: number;
}): Promise<Product[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = unicomAPIAdapter.getAll();
  console.log(products);
  return products;
};
