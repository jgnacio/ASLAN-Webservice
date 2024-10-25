import {
  Product,
  ProductType,
  Provider,
} from "@/domain/product/entities/Product";
import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import axios from "axios";
import { SolutionboxAPITokenAdapter } from "./SolutionboxAPITokenAdapter";
import { SolutionboxAPIProduct } from "../entities/Products/SolutionboxAPIProduct";

export const solutionBoxProvider: Provider = {
  name: "Solutionbox",
  mainPageUrl: "https://www.solutionbox.com.uy/",
  searchPageUrl: "https://www.solutionbox.com.uy/detalle?sku=",
  logoUrl:
    "https://res.cloudinary.com/dhq5ewbyu/image/upload/v1729604229/ASLAN/vkr0voqeoh47duv94jw3.png",
};

export class SolutionboxAPIProductAdapter implements IProductRepository {
  private readonly URL = process.env.API_SOLUTIONBOX_CACHED_URL || "";

  constructor() {}

  private async fetchProduct(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }

  private async fetchProducts(params: any): Promise<Product[]> {
    const response = await axios
      .post(`${this.URL}/api/products-cache`, {
        password: process.env.API_SOLUTIONBOX_PASSWORD_FUNCTION,
        provider: "Solutionbox",
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
    const products = this.productMapperList(response);
    return products;
  }

  async getBySKU(sku: string): Promise<Product | null> {
    const products = await this.fetchProducts({});
    const product = products.find((product) => product.getSku() === sku);
    return product || null;
  }
  async getByPartNumber(partNumber: string): Promise<Product | null> {
    const products = await this.fetchProducts({});
    const product = products.find(
      (product) =>
        product.partNumber && product.partNumber[0].partNumber === partNumber
    );

    return product || null;
  }

  async getByCategory(category: string): Promise<Product[]> {
    const products = await this.fetchProducts({});
    console.log("category:", category);
    console.log("products:", products);

    switch (category) {
      case "Notebooks":
        const notebooks = products.filter(
          (product) =>
            product.title.toLowerCase().includes("notebook") ||
            product.title.toLowerCase().includes("laptop") ||
            product.marca.includes("apple")
        );
        console.log("Filtered Notebooks:", notebooks);
        return notebooks;
      case "Motherboards":
        return products.filter((product) =>
          product.title.toLowerCase().includes("motherboard")
        );
      case "Monitores":
        return products.filter(
          (product) =>
            product.title.toLowerCase().includes("monitor") ||
            product.title.toLowerCase().includes("pantalla") ||
            product.title.toLowerCase().includes("display")
        );
      case "CPU":
        return products.filter((product) => product.marca.includes("AMD"));
      case "GPU":
        return products.filter((product) =>
          product.title.toLowerCase().includes("rtx")
        );
      case "RAM":
        return products.filter((product) =>
          product.title.toLowerCase().includes("ram")
        );
      case "Fuentes":
        return products.filter((product) =>
          product.title.toLowerCase().includes("fuente")
        );
      case "Refrigeración":
        return products.filter(
          (product) =>
            product.title.toLowerCase().includes("ref.liq") ||
            product.title.toLowerCase().includes("refrigeracion") ||
            product.title.toLowerCase().includes(" 240mm") ||
            product.title.toLowerCase().includes(" 120mm") ||
            product.title.toLowerCase().includes(" 360mm")
        );

      default:
        return [];
    }
  }

  async getAll(): Promise<Product[]> {
    const products = await this.fetchProducts({});
    return products;
  }

  async getFeatured(request?: any): Promise<Product[]> {
    const products = await this.fetchProducts({});
    const featuredProducts = products.filter((product) => product.stock <= 5);
    console.log("featuredProducts", featuredProducts.slice(0, 5));
    return featuredProducts;
  }

  async getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  productMapper(product: ProductType): Product {
    const partNumber = product.partNumber as string | undefined;
    const productMapped = new Product({
      title: product.title,
      description: product.description || "",
      price: product.price,
      sku: product.sku,
      stock: product.stock,
      marca: product.marca,
      provider: solutionBoxProvider,
      partNumber: [
        {
          partNumber: partNumber || product.sku,
          ean: 123456789,
          units_x_box: 1,
        },
      ],
      category: product.category,
      images: product.images,
      submitDate: product.submitDate,
      availability: product.availability,
    });

    return productMapped;
  }

  productMapperList(products: ProductType[]): Product[] {
    return products.map((product) => this.productMapper(product));
  }
}
