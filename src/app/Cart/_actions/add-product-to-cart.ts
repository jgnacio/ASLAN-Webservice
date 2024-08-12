"use server";
import axios from "axios";
const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export default async function addToCart(id: string, quantity: number) {
  // console.log(await getToken());
  console.log("addToCart", id, quantity);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_UNICOM_TOKEN}`,
    },
  };

  const bodyParameters = {
    codigo_articulo: id,
    cantidad: quantity,
  };

  const response = await axios
    .put(`${API_UNICOM_URL}/carrito/articulo`, bodyParameters, config)
    .then((response) => {
      console.log("response", response);
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      return [];
    });

  return response;
}
