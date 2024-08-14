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

  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${API_UNICOM_TOKEN}`,
  //   },
  // };
  // let resCart: any;
  // try {
  //   resCart = await axios
  //     .get(`${API_UNICOM_URL}/carrito`, config)
  //     .then((res) => {
  //       console.log("res", res.data);
  //       return res.data;
  //     })
  //     .catch(function (error) {
  //       if (error.response) {
  //         // La respuesta fue hecha y el servidor respondió con un código de estado
  //         // que esta fuera del rango de 2xx
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  //         // La petición fue hecha pero no se recibió respuesta
  //         // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
  //         // http.ClientRequest en node.js
  //         console.log(error.request);
  //       } else {
  //         // Algo paso al preparar la petición que lanzo un Error
  //         console.log("Error", error.message);
  //       }
  //       console.log(error.config);

  //       return mapperCart;
  //     });
  // } catch (error) {
  //   console.log("error", error);
  // }

  // if (!resCart) {
  //   const mapperCart: ICart = {
  //     products: [],
  //     delivery_options: [],
  //     payment_options: [],
  //     total_including_tax: 0,
  //     total: 0,
  //     id: "",
  //     userId: "",
  //     lastUpdate: new Date().toISOString(),
  //   };
  //   return mapperCart;
  // }
  // const products = cartProductsMapper(resCart.articulos);
  // const total_including_tax = resCart.total_con_impuestos;
  // const payment_options = resCart.forma_de_pago;
  // const delivery_options = resCart.opciones_entrega;

  // const mapperCart: ICart = {
  //   products,
  //   delivery_options,
  //   payment_options,
  //   total_including_tax,
  //   total: 0,
  //   id: "",
  //   userId: "",
  //   lastUpdate: new Date().toISOString(),
  // };

  // return mapperCart;
};

// const cartProductsMapper = (products: any): ICartProduct[] => {
//   return products.map((product: any) => {
//     return {
//       id: product.codigo_articulo,
//       title: product.descripcion,
//       price: product.costo_unitario,
//       tax: product.iva_unitario,
//       quantity: product.cantidad,
//       available: product.disponibilidad,
//       sku: product.codigo_articulo,
//       category: {
//         id: "",
//         name: "",
//       },
//     };
//   });
// };
