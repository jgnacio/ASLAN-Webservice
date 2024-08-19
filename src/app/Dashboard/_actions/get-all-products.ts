"use server";
import { getProductsByPage } from "./get-product-by-page";
import { ProductType } from "@/domain/product/entities/Product";

export const getAllProducts = async (): Promise<ProductType[]> => {
  const products = await getProductsByPage({ page: 1 });
  let page = 2;
  let count = products.length;
  console.log("products length:", products.length);
  while (count >= 100) {
    const newProducts = await getProductsByPage({ page });
    products.push(...newProducts);
    console.log("products length:", products.length);
    page++;
    count = newProducts.length;
  }
  return products;
};
