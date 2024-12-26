import axios from "axios";
import { RelevantCategoriesType } from "@/domain/categories/defaultCategories";
import { Product } from "@/domain/product/entities/Product";
import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import { getUTCTimestamp } from "@/lib/functions/DateFunctions";
import { hashSHA256 } from "@/lib/functions/hashes";
import { IntcomexAPIPriceType } from "../entities/IntcomexAPIPrice";
import {
  IntcomexAPIProductsTypeExtended,
  IntcomexAPIProductType,
} from "../entities/IntcomexAPIProducts";
import { IntcomexAPIStockType } from "../entities/IntcomexAPIStock";

export class IntcomexAPIProductAdapter implements IProductRepository {
  private readonly API_URL = process.env.API_INTCOMEX_URL || "";
  private static lastFetched: number | null = null;
  private static readonly CACHE_DURATION = 1.2 * 60 * 60 * 1000; // 1.2 hours in milliseconds
  private static products: IntcomexAPIProductsTypeExtended[];

  constructor() {}

  async getInstance(): Promise<IntcomexAPIProductsTypeExtended[]> {
    const now = Date.now();

    console.log(
      `Is Ready to fetch products?: ${
        !IntcomexAPIProductAdapter.lastFetched ||
        now - IntcomexAPIProductAdapter.lastFetched >=
          IntcomexAPIProductAdapter.CACHE_DURATION
          ? "YYYYYYYYYY"
          : "NNNNNNNNNN"
      }`
    );

    if (
      !IntcomexAPIProductAdapter.lastFetched ||
      now - IntcomexAPIProductAdapter.lastFetched >=
        IntcomexAPIProductAdapter.CACHE_DURATION
    ) {
      IntcomexAPIProductAdapter.lastFetched = now;
      IntcomexAPIProductAdapter.products = await this.fetchProducts();
    }

    console.log("Products fetched from Intcomex API");
    console.log(IntcomexAPIProductAdapter.products.length);

    return IntcomexAPIProductAdapter.products;
  }

  private async fetchProducts(): Promise<IntcomexAPIProductsTypeExtended[]> {
    try {
      const apikey = process.env.API_KEY_INTCOMEX_PUBLIC || "";
      const apiaccess = process.env.API_KEY_INTCOMEX_ACCESS || "";
      // timeStamp on UTC
      const timeStampNow = getUTCTimestamp();

      const signature = `${apikey},${apiaccess},${timeStampNow}`;
      const signahashed = hashSHA256(signature);
      const priceList: IntcomexAPIPriceType[] = await this.getPriceList();
      const inventoryList: IntcomexAPIStockType[] = await this.getInventory();

      const response = await axios
        .get(
          `${this.API_URL}/getcatalog?format=json&inventoryFilter=Any&locale=es`,
          {
            headers: {
              "content-type": "application/json",
              authorization:
                "Bearer " +
                `apiKey=${apikey}&utcTimeStamp=${timeStampNow}&signature=${signahashed}`,
            },
          }
        )
        .then((response) => {
          return response.data;
        });

      // Merge Both responses to get the final product list with prices
      const products: IntcomexAPIProductsTypeExtended[] = response.map(
        (product: IntcomexAPIProductType) => {
          const price = priceList.find((price) => price.Sku === product.Sku);
          const stock = inventoryList.find(
            (stock) => stock.Sku === product.Sku
          );
          return {
            ...product,
            price: price?.Price.UnitPrice || 0,
            stock: stock?.InStock || 0,
            available: stock?.RealStockValue || false,
          };
        }
      );

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getPriceList(): Promise<any> {
    try {
      const apikey = process.env.API_KEY_INTCOMEX_PUBLIC || "";
      const apiaccess = process.env.API_KEY_INTCOMEX_ACCESS || "";
      // timeStamp on UTC
      const timeStampNow = getUTCTimestamp();

      const signature = `${apikey},${apiaccess},${timeStampNow}`;
      const signahashed = hashSHA256(signature);

      const priceList: IntcomexAPIPriceType[] = await axios
        .get(`${this.API_URL}/getpricelist?inStock=true`, {
          headers: {
            "content-type": "application/json",
            authorization:
              "Bearer " +
              `apiKey=${apikey}&utcTimeStamp=${timeStampNow}&signature=${signahashed}`,
          },
        })
        .then((response) => {
          return response.data;
        });

      return priceList;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getInventory(): Promise<any> {
    try {
      const apikey = process.env.API_KEY_INTCOMEX_PUBLIC || "";
      const apiaccess = process.env.API_KEY_INTCOMEX_ACCESS || "";
      // timeStamp on UTC
      const timeStampNow = getUTCTimestamp();

      const signature = `${apikey},${apiaccess},${timeStampNow}`;
      const signahashed = hashSHA256(signature);

      const priceList: IntcomexAPIPriceType[] = await axios
        .get(`${this.API_URL}/getinventory?inStock=true`, {
          headers: {
            "content-type": "application/json",
            authorization:
              "Bearer " +
              `apiKey=${apikey}&utcTimeStamp=${timeStampNow}&signature=${signahashed}`,
          },
        })
        .then((response) => {
          return response.data;
        });

      return priceList;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getBySKU(sku: string): Promise<Product | null> {
    try {
      const apikey = process.env.API_KEY_INTCOMEX_PUBLIC || "";
      const apiaccess = process.env.API_KEY_INTCOMEX_ACCESS || "";

      // timeStamp on UTC
      const timeStampNow = getUTCTimestamp();
      const signature = `${apikey},${apiaccess},${timeStampNow}`;
      const signahashed = hashSHA256(signature);

      const response = await axios
        .get(`${this.API_URL}/getproduct?sku=${sku}&locale=es`, {
          headers: {
            "content-type": "application/json",
            authorization:
              "Bearer " +
              `apiKey=${apikey}&utcTimeStamp=${timeStampNow}&signature=${signahashed}`,
          },
        })
        .then((response) => {
          return response.data;
        });

      return this.mapToProduct(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    }
  }
  async getAll({
    request,
    page,
    category,
    provider,
  }: {
    request?: any;
    page?: number;
    category?: string;
    provider?: string;
  }): Promise<Product[]> {
    const response = await this.getInstance();
    if (response.length > 0) {
      const filteredResponse = response.filter(
        (product) => product.price > 0 && product.stock > 0
      );
      return this.mapToProducts(filteredResponse);
    }

    return [];
  }
  async getByCategory(category: any): Promise<Product[]> {
    const formatCategory: RelevantCategoriesType = category;
    const response = await this.getInstance();

    if (response.length === 0) return [];

    const filteredResponse = response.filter(
      (product) => product.price > 0 && product.stock > 0
    );

    let productsByCategory: any[] = [];

    for (const cat of formatCategory.providerCategories) {
      productsByCategory = productsByCategory.concat(
        filteredResponse.filter(
          (product) => product.Category.Description === cat.providerCategoryName
        )
      );
    }

    try {
      return this.mapToProducts(productsByCategory);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
  async getFeatured(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  mapToProduct(product: IntcomexAPIProductsTypeExtended): Product {
    const newProduct = new Product({
      sku: product.Sku,
      partNumber: [
        {
          partNumber: product.Sku,
          ean: 12345,
          units_x_box: 1,
        },
      ],
      description: product.Description,
      marca: product.Brand.Description,
      category: {
        id: product.Category.CategoryId,
        name: product.Category.Description,
      },
      price: product.price,
      priceHistory: [],
      stock: product.stock,
      availability: product.stock > 0 ? "in_stock" : "out_of_stock",
      title: product.Description.slice(0, 50),
      submitDate: new Date(),
      images: [],
    });
    return newProduct;
  }

  mapToProducts(products: IntcomexAPIProductsTypeExtended[]): Product[] {
    return products.map((product) => this.mapToProduct(product));
  }
}
