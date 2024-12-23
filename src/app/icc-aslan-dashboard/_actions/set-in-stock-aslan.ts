"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function setInStock(productId: number): Promise<boolean> {
  try {
    await AslanWooAPIPublishProductAdapter.setInStock(productId);
  } catch (error: any) {
    console.error(error);
    return false;
  }

  return true;
}
