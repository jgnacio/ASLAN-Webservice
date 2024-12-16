"use server";
import { ProductType } from "@/domain/product/entities/Product";
import {
  ProductClassToObj,
  ProductClassToObjFixed,
} from "@/lib/Utils/Functions/ClassToObject";
import { ProductCacheProductAdapter } from "@/Resources/API/ProductCache/adapters/ProductCacheProductAdapter";

export const getProductCachedBySkuProvider = async (
  sku: string,
  provider: string
): Promise<ProductType> => {
  const productCacheProductAdapter = new ProductCacheProductAdapter();
  const products = await productCacheProductAdapter.getByProvider(provider);
  const product = products.find((product) => product.getSku() === sku);

  if (!product) {
    throw new Error("Product not found");
  }
  const productObj = ProductClassToObjFixed(product);

  return productObj;
};
