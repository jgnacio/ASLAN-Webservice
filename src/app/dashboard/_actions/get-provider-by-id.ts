"use server";

import { SKUInternalServiceAPIAdapter } from "@/Resources/API/SKUInternalService/adapters/SKUInternalServiceAPIAdapter";

export const getProviderByID = async (providerID: number) => {
  try {
    const skuInternalServiceAPIAdapter = new SKUInternalServiceAPIAdapter();
    const response = await skuInternalServiceAPIAdapter.getProviderByID(
      providerID
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
    // throw new Error("Error");
  }
};
