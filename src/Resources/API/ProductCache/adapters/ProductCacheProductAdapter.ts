import { Product, ProductType } from "@/domain/product/entities/Product";
import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import axios from "axios";
import { UnicomAPIProductRequest } from "../../Unicom/UnicomAPIRequets";
import { ProductObjToClass } from "@/lib/Utils/Functions/ClassToObject";

export class ProductCacheProductAdapter implements IProductRepository {
  private readonly API_PRODUCT_CACHED_URL =
    process.env.API_SOLUTIONBOX_CACHED_URL;

  constructor() {}
  private async fetchProducts(): Promise<Product[]> {
    const response = await axios
      .get(`${this.API_PRODUCT_CACHED_URL}/api/products-cache`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Error fetching products from cache");
        }
        return response.data.data as ProductType[];
      });

    const productsToObj = response.map((product) => {
      return ProductObjToClass(product);
    });

    return productsToObj;
  }

  private async fetchProductsByProvider(provider: string): Promise<Product[]> {
    const body = {
      provider: provider,
    };
    const response = await axios
      .post(`${this.API_PRODUCT_CACHED_URL}/api/products-cache`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Error fetching products from cache");
        }
        return response.data.data as ProductType[];
      });

    const productsToObj = response.map((product) => {
      return ProductObjToClass(product);
    });

    return productsToObj;
  }

  async getAll(): Promise<Product[]> {
    const products = await this.fetchProducts();
    return products;
  }

  async getByProvider(provider: string): Promise<Product[]> {
    const products = await this.fetchProductsByProvider(provider);
    return products;
  }

  async getByCategory(category: string): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  async getBySKU(sku: string): Promise<Product> {
    const products = await this.fetchProducts();
    const product = products.find((product) => product.getSku() === sku);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getFeatured(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async getOffers(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
}
