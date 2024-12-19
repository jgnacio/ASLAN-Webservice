"use server";

import { AslanAPIProductsAdapter } from "@/Resources/API/ASLAN/adapters/AslanAPIProductsAdapter";

export const getOrdersWoocomerce = async (status?: string) => {
  try {
    const aslanAPIProductsAdapter = new AslanAPIProductsAdapter();
    const orders = await aslanAPIProductsAdapter.getOrders(status);
    if (!orders) {
      console.error("Error fetching orders");
      return [];
    }
    return orders;
  } catch (error: any) {
    console.error("Error fetching orders");
    return [];
  }
};
