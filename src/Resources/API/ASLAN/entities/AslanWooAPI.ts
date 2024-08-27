import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";

export class AslanWooAPI {
  private static instance: WooCommerceRestApi<WooRestApiOptions>;
  private constructor() {} // Prevenir la instanciación directa

  public static getInstance(): WooCommerceRestApi<WooRestApiOptions> {
    if (!AslanWooAPI.instance) {
      const opt: WooRestApiOptions = {
        url: process.env.WC_URL || "",
        consumerKey: process.env.WC_CONSUMER_KEY || "",
        consumerSecret: process.env.WC_CONSUMER_SECRET || "",
        version: "wc/v3",
        queryStringAuth: false,
      };
      AslanWooAPI.instance = new WooCommerceRestApi(opt);
    }
    return AslanWooAPI.instance;
  }
}
