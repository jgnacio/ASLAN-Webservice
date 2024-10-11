import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";

export class AslanWooAPI {
  private static instance: WooCommerceRestApi<WooRestApiOptions>;
  private constructor() {} // Prevenir la instanciación directa

  public static getInstance(): WooCommerceRestApi<WooRestApiOptions> {
    if (!AslanWooAPI.instance) {
      const opt: WooRestApiOptions = {
        url: process.env.WP_URL || "",
        consumerKey: process.env.WC_CONSUMER_KEY || "",
        consumerSecret: process.env.WC_CONSUMER_SECRET || "",
        version: "wc/v3",
        queryStringAuth: false,
      };
      AslanWooAPI.instance = new WooCommerceRestApi(opt);
    }
    return AslanWooAPI.instance;
  }

  public static async getProductBySku(sku: string): Promise<any> {
    try {
      const api = AslanWooAPI.getInstance();
      const response = await api.get("products", {
        sku, // Parámetro de búsqueda por SKU
      });

      const exactProduct = response.data.find(
        (product: any) => product.sku === sku
      );

      if (!exactProduct) {
        throw new Error(`No product found with SKU: ${sku}`);
      }

      return exactProduct;
    } catch (error) {
      console.error(`Error fetching product with SKU ${sku}:`, error);
      throw new Error("Error fetching product by SKU");
    }
  }
}
