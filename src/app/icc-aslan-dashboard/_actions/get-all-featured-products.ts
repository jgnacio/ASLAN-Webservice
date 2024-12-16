"use server";

import { ProductType } from "@/domain/product/entities/Product";
import { getFeaturedProductsByPage } from "./get-featured-products";

export const getAllFeaturedProducts = async (): Promise<ProductType[]> => {
  const products = await getFeaturedProductsByPage({ page: 1 });
  let page = 2;
  while (products.length >= 200) {
    const newProducts = await getFeaturedProductsByPage({ page });
    products.push(...newProducts);
    page++;
  }
  return products;
};
