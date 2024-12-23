"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function setOutOfStock(productId: number): Promise<boolean> {
  try {
    await AslanWooAPIPublishProductAdapter.setOutOfStock(productId);
  } catch (error: any) {
    console.error(error);
    return false;
  }

  return true;
}
