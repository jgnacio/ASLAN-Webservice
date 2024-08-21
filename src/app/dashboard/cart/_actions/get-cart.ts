"use server";
import {
  Cart,
  CartType,
  ICart,
  ICartProduct,
} from "@/domain/product/entities/Cart";
import { UnicomAPICartAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPICartAdapter";
import axios from "axios";
const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

// const cart = Cart.getInstance();

export const getCart = async (): Promise<CartType> => {
  const unicomApiCartAdapter = new UnicomAPICartAdapter();

  return unicomApiCartAdapter.get();
};
