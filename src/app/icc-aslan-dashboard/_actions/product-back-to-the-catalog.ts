"use server";

import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function productBackToTheCatalog(productId: number) {
  try {
    await AslanWooAPIPublishProductAdapter.productBackToTheCatalog(productId);
  } catch (error: any) {
    throw new Error("Error putting product back to the catalog");
  }

  return true;
}
