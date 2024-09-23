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
      sku: product.partNumberToSend || "",
    };

    await wooAPI.post("products", productMapped as any);

    // console.log(response);
  }
}
