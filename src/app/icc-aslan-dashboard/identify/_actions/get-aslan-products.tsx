"use server";
import { AslanAPIProductsAdapter } from "@/Resources/API/ASLAN/adapters/AslanAPIProductsAdapter";

export const getAslanProducts = async (page: number, per_page: number) => {
  const aslanAPI = new AslanAPIProductsAdapter();
  const response = await aslanAPI.getProducts(page, per_page);
  return response;
};
