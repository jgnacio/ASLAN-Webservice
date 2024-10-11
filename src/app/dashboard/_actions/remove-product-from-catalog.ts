"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function removeFromTheCalalog(productId: number) {
  try {
    await AslanWooAPIPublishProductAdapter.removeFromTheCalalog(productId);
  } catch (error: any) {
    throw new Error("Error removing product from catalog");
  }

  return true;
}
