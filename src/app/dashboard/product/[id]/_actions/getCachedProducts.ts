"use server";
import { ProductType } from "@/domain/product/entities/Product";
import axios from "axios";

export const getCachedProducts = async (): Promise<{
  message: string;
  data: ProductType[];
}> => {
  const response = await axios.get(
    "https://product-getter-service-207026078475.us-central1.run.app/api/products-cache"
  );

  return response.data;
};
