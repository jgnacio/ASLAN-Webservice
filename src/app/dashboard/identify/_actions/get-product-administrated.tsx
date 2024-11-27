"use server";

import { SKUInternalServiceAPIAdapter } from "@/Resources/API/SKUInternalService/adapters/SKUInternalServiceAPIAdapter";

export const getProductsAdministrated = async () => {
  const skuInternalServiceAPIAdapter = new SKUInternalServiceAPIAdapter();
  return skuInternalServiceAPIAdapter.getProductsAdministrated();
};
