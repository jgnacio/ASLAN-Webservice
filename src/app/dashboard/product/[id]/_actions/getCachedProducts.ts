"use server";
import { ProductType } from "@/domain/product/entities/Product";
import axios from "axios";

const API_PRODUCT_CACHED_URL = process.env.API_SOLUTIONBOX_CACHED_URL || "";

export const getCachedProducts = async (): Promise<{
  message: string;
  data: ProductType[];
}> => {
  const response = await axios.post(
    `${API_PRODUCT_CACHED_URL}/api/products-cache`,
    {
      provider: "Solutionbox",
    }
  );

  return response.data;
};
