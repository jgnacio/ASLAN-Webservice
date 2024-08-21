"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";

export const getOffersProductsByPage = async ({
  page,
}: {
  page?: number;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = await unicomAPIAdapter.getOffers();
  const productList = products.map((product) => ProductClassToObj(product));
  // console.log(products);
  return productList;
};
