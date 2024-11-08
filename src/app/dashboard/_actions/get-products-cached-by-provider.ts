"use server";
import { ProductType } from "@/domain/product/entities/Product";
import {
  ProductClassToObj,
  ProductObjToClass,
} from "@/lib/Utils/Functions/ClassToObject";
import { ProductCacheProductAdapter } from "@/Resources/API/ProductCache/adapters/ProductCacheProductAdapter";

export const getProductCachedByProvider = async (
  provider: string
): Promise<ProductType[]> => {
  const productCacheProductAdapter = new ProductCacheProductAdapter();
  const products = await productCacheProductAdapter.getByProvider(provider);

  if (!products) {
    throw new Error("Error fetching products from cache");
  }

  const productsToObj = products.map((product) => {
    return ProductClassToObj(product);
  });

  return productsToObj;
};
