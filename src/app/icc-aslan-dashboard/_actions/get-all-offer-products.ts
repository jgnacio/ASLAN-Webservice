"use server";

import { ProductType } from "@/domain/product/entities/Product";
import { getOffersProductsByPage } from "./get-offer-products";

export const getAllOfferProducts = async (): Promise<ProductType[]> => {
  const products = await getOffersProductsByPage({ page: 2 });
  let page = 3;
  while (products.length >= 200) {
    const newProducts = await getOffersProductsByPage({ page });
    products.push(...newProducts);
    page++;
  }
  return products;
};
