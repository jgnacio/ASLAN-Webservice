"use server";
import { ICart, ICartProduct } from "@/domain/product/entities/Cart";
import axios from "axios";
import { removeProduct } from "@/lib/features/cart/cartProductUpdates";

const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export const removeProductOnCart = async (id: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_UNICOM_TOKEN}`,
    },
  };
  // need to pas in params this url /carrito/articulo/{codigo_articulo} codigo articulo

  try {
    const response = await axios
      .delete(`${API_UNICOM_URL}/carrito/articulo/${id}`, config)
      .then((res) => res.data);
    console.log("response", response);
  } catch (error) {
    console.log("error", error);
    return;
  }
  return;
};
