"use server";
import { ProductType } from "@/domain/product/entities/Product";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export const publishProduct = async (product: ProductType) => {
  try {
    await AslanWooAPIPublishProductAdapter.publishProduct(product);
  } catch (error) {
    console.error(error);
    throw new Error("Error al publicar el producto");
  }
};
