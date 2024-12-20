"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function setAsOutOfStock(productId: number) {
  try {
    await AslanWooAPIPublishProductAdapter.setAsOutOfStock(productId);
  } catch (error: any) {
    throw new Error("Error removing product from catalog");
  }

  return true;
}
