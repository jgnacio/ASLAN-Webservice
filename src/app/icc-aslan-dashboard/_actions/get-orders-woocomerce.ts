"use server";

import { AslanAPIProductsAdapter } from "@/Resources/API/ASLAN/adapters/AslanAPIProductsAdapter";

export const getOrdersWoocomerce = async (status?: string) => {
  try {
    const aslanAPIProductsAdapter = new AslanAPIProductsAdapter();
    const orders = await aslanAPIProductsAdapter.getOrders(status);
    return orders;
  } catch (error: any) {
    throw new Error("Error fetching orders");
  }
};
