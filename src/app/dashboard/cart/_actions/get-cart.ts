"use server";
import { CartType } from "@/domain/product/entities/Cart";
import { UnicomAPICartAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPICartAdapter";

// const cart = Cart.getInstance();

export const getCart = async (): Promise<CartType | {}> => {
  try {
    const unicomApiCartAdapter = new UnicomAPICartAdapter();

    const cart = unicomApiCartAdapter.get();
    return cart;
  } catch {
    return {};
  }
};
