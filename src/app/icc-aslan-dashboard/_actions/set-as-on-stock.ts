"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function setAsInStock(productId: number) {
  try {
    await AslanWooAPIPublishProductAdapter.setAsInStock(productId);
  } catch (error: any) {
    throw new Error("Error removing product from catalog");
  }

  return true;
}
