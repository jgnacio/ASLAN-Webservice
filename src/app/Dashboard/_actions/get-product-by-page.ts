"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/UnicomAPIAdapters";
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
  // console.log(products);
  return products;
};

export const getFeaturedProductsByPage = async ({
  page,
}: {
  page: number;
}): Promise<Product[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = unicomAPIAdapter.getFeatured();
  // console.log(products);
  return products;
};

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
