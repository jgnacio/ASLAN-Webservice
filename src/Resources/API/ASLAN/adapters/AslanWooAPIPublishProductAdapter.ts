import { ProductType } from "@/domain/product/entities/Product";
import { AslanWooAPI } from "../entities/AslanWooAPI";
import { AslanWooAPIProduct } from "../entities/AslanWooAPIProduct";
import { AslanWooAPIProductRequest } from "../AslanAPIRequest";

export class AslanWooAPIPublishProductAdapter {
  public static async publishProduct(product: ProductType): Promise<any> {
    const wooAPI = AslanWooAPI.getInstance();

    console.log(product.images.map((images) => ({ src: images })));

    const productMapped: AslanWooAPIProductRequest = {
      name: product.title,
      type: "simple",
      regular_price: product.price.toString(),
      description: product.description,
      short_description: "",
      categories: [],
      images: product.images.map((images) => ({ src: images })),
      status: "draft",
    };

    const response = await wooAPI.post("products", productMapped as any);
    console.log(response);
  }
}
