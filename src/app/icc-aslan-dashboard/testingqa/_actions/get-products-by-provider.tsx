"use server";
import { ProductType } from "@/domain/product/entities/Product";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";
import { ProductCacheProductAdapter } from "@/Resources/API/ProductCache/adapters/ProductCacheProductAdapter";

export const getProductsByProvider = async (
  provider: string
): Promise<ProductType[]> => {
  const products = await new ProductCacheProductAdapter().getByProvider(
    provider
  );

  const productObj: ProductType[] = products.map((product) => {
    return ProductClassToObj(product);
  });

  return productObj;
};
