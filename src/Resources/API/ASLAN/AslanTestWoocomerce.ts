"use server";
import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";

const opt: WooRestApiOptions = {
  url: process.env.WP_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3",
  queryStringAuth: false, // Force Basic Authentication as query string true and using under
};

const api = new WooCommerceRestApi(opt);

export default async function AslanTestWoocomerce() {
  const responseData = {
    success: false,
    products: [],
  };

  try {
    const response = await api.get("products");
    responseData.success = true;
    responseData.products = response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return responseData;
}
