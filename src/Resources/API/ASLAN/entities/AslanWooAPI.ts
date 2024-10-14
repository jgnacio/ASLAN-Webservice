import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";

export interface WooOrder {
  id: number;
  number: string;
  status: string;
  date_created: Date;
  date_modified: Date;
  payment_method: string;
  total: string;
  billing: {
    address_1: string;
    address_2: string;
    city: string;
    company: string;
    country: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    postcode: string;
    state: string;
  };
}

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

  public static async getOrders(status?: string): Promise<WooOrder[]> {
    try {
      const api = AslanWooAPI.getInstance();

      // Parámetros opcionales, como el estado del pedido (por ejemplo, "completed")
      const params: { status?: string } = {};
      if (status) {
        params.status = status;
      }

      // Petición para obtener los pedidos
      const response = await api.get("orders", params);

      // Tipar correctamente la respuesta
      const orders: WooOrder[] = response.data;

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Error fetching orders");
    }
  }
}
