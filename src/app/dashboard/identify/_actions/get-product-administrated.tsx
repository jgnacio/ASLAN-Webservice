"use server";

import { SKUInternalServiceAPIAdapter } from "@/Resources/API/SKUInternalService/adapters/SKUInternalServiceAPIAdapter";

export const getProductsAdministrated = async (): Promise<any> => {
  const skuInternalServiceAPIAdapter = new SKUInternalServiceAPIAdapter();
  return await skuInternalServiceAPIAdapter.getProductsAdministrated();
};
