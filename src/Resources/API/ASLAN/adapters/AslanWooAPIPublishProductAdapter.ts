import { FormPublishProduct } from "@/app/icc-aslan-dashboard/product/[id]/components/types/formTypes";
import { AslanWooAPIProductRequest } from "../AslanAPIRequest";
import { AslanWooAPI } from "../entities/AslanWooAPI";

export class AslanWooAPIPublishProductAdapter {
  public static async publishProduct(product: FormPublishProduct) {
    const wooAPI = AslanWooAPI.getInstance();

    const productMapped: AslanWooAPIProductRequest = {
      name: product.title,
      type: "simple",
      regular_price: product.price.toString(),
      description: product.description,
      short_description: "",
      categories: [],
      images: product.images,
      stock_status: product.stock_status,
      status: "draft",
      sku: product.sku || "",
    };

    await wooAPI.post("products", productMapped as any);

    // console.log(response);
  }

  public static async getProductBySku(sku: string): Promise<any> {
    try {
      const product = await AslanWooAPI.getProductBySku(sku);
      console.log(product);

      return product;
    } catch (error: any) {
      console.error(error);
    }
  }

  public static async setOutOfStock(productId: number) {
    const wooAPI = AslanWooAPI.getInstance() as any;

    const productMapped = {
      id: productId,
      stock_status: "outofstock",
    };

    await wooAPI.put(`products/${productId}`, productMapped as any);
  }

  public static async setInStock(productId: number) {
    const wooAPI = AslanWooAPI.getInstance() as any;

    const productMapped = {
      id: productId,
      stock_status: "instock",
    };

    await wooAPI.put(`products/${productId}`, productMapped as any);
  }

  public static async removeFromTheCalalog(productId: number) {
    const wooAPI = AslanWooAPI.getInstance() as any;

    const productMapped = {
      id: productId,
      status: "draft",
    };

    await wooAPI.put(`products/${productId}`, productMapped as any);
  }

  public static async productBackToTheCatalog(productId: number) {
    const wooAPI = AslanWooAPI.getInstance() as any;

    const productMapped = {
      id: productId,
      status: "publish",
    };

    await wooAPI.put(`products/${productId}`, productMapped as any);
  }
}
