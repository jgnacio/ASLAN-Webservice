"use server";
import { ProductType } from "@/domain/product/entities/Product";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";
import { IntcomexAPIProductAdapter } from "@/Resources/API/Intcomex/adapters/IntcomexAPIProductAdapter";

export const getIntcomexProducts = async () => {
  try {
    const adapter = new IntcomexAPIProductAdapter();
    const products = await adapter.getAll({});
    const productsObj: ProductType[] = products.map((product) => {
      return ProductClassToObj(product);
    });

    return productsObj;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};
