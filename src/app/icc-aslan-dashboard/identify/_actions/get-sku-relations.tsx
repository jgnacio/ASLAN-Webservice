"use server";

import { SKUInternalServiceAPIAdapter } from "@/Resources/API/SKUInternalService/adapters/SKUInternalServiceAPIAdapter";

export const getAllSKURelations = async () => {
  const skuInternalServiceAPIAdapter = new SKUInternalServiceAPIAdapter();
  const response = await skuInternalServiceAPIAdapter.getAllSKURelations();

  if (!response) {
    return [];
  }
  return response.data;
};
