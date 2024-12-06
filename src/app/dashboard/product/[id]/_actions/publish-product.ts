"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";
import { FormPublishProduct } from "../components/types/formTypes";

export const publishProduct = async (product: FormPublishProduct) => {
  try {
    await AslanWooAPIPublishProductAdapter.publishProduct(product);
  } catch (error) {
    console.error(error);
    throw new Error("Error al publicar el producto");
  }
};
