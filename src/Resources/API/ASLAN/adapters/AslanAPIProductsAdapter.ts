import wpRAPI from "../entities/AslanWPAPI";
import { AslanWooAPI } from "../entities/AslanWooAPI";

export class AslanAPIProductsAdapter {
  constructor() {}

  public async getProducts(page: number, per_page: number): Promise<any> {
    try {
      const products = await wpRAPI.getProducts(page, per_page);

      return products;
    } catch (error: any) {
      console.error(error);
    }
  }

  public async getOrders(status?: string): Promise<any> {
    try {
      const orders = await AslanWooAPI.getOrders(status);

      return orders;
    } catch (error: any) {
      console.error(error);
    }
  }
}
