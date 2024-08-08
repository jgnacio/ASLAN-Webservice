"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product } from "@/domain/product/entities/Product";

export const getOffersProductsByPage = async ({
  page,
}: {
  page: number;
}): Promise<Product[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = unicomAPIAdapter.getOffers();
  // console.log(products);
  return products;
};
