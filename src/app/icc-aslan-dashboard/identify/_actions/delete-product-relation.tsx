"use server";
import { SKUInternalServiceAPIAdapter } from "@/Resources/API/SKUInternalService/adapters/SKUInternalServiceAPIAdapter";

export const deleteProductRelation = (SKU_Relation: string) => {
  const skuInternalServiceAPIAdapter = new SKUInternalServiceAPIAdapter();
  return skuInternalServiceAPIAdapter.deleteProductRelation(SKU_Relation);
};