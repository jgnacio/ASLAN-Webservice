import { ProductType } from "@/domain/product/entities/Product";
import { AslanWooAPI } from "../entities/AslanWooAPI";
import { AslanWooAPIProduct } from "../entities/AslanWooAPIProduct";
import { AslanWooAPIProductRequest } from "../AslanAPIRequest";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export class AslanWooAPIPublishProductAdapter {
  public static async publishProduct(product: ProductType) {
    const wooAPI = AslanWooAPI.getInstance();

    const productMapped: AslanWooAPIProductRequest = {
      name: product.title,
      type: "simple",
      regular_price: product.price.toString(),
      description: product.description,
      short_description: "",
      categories: [],
      images: product.images,
      status: "draft",
      sku: product.sku || "",
    };

    await wooAPI.post("products", productMapped as any);

    // console.log(response);
  }

  public static async getProductBySku(sku: string): Promise<any> {
    console.log("sku", sku);
    try {
      const product = await AslanWooAPI.getProductBySku(sku);

      return product;
    } catch (error: any) {
      // console.error(error);
    }
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
