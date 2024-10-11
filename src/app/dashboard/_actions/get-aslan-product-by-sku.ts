"use server";
import { AslanWooAPIPublishProductAdapter } from "@/Resources/API/ASLAN/adapters/AslanWooAPIPublishProductAdapter";

export async function getProductAslanBySku(sku: string) {
  const product = await AslanWooAPIPublishProductAdapter.getProductBySku(sku);
  return product;
}
