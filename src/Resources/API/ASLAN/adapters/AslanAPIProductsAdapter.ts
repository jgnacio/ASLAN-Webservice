import wpRAPI from "../entities/AslanWPAPI";

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
}
