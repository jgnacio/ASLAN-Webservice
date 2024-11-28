import { Product } from "@/domain/product/entities/Product";
import axios from "axios";

export class SKUInternalServiceAPIAdapter {
  private readonly SKU_INTERNAL_SERVICE_URL =
    process.env.SKU_INTERNAL_SERVICE_URL;

  constructor() {}

  async getProductsAdministrated(): Promise<Product[]> {
    const response = await axios
      .get(`${this.SKU_INTERNAL_SERVICE_URL}/api/products`)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });

    if (!response.data) {
      return [];
    }

    const products = response.data.map((product: any) => {
      return {
        id: product.ID,
        skuInterno: product.SKU,
        title: product.title,
        price: product.price,
        description: product.description,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        relations: product.relations,
      };
    });

    return products;
  }

  async getAllSKURelations(): Promise<any> {
    const response = await axios
      .get(`${this.SKU_INTERNAL_SERVICE_URL}/api/relationProducts`)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });

    return response;
  }

  async getProviderByID(providerID: number): Promise<any> {
    const response = await axios
      .get(`${this.SKU_INTERNAL_SERVICE_URL}/api/providers/${providerID}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });

    return response;
  }

  async deleteProductRelation(SKU_Relation: string): Promise<any> {
    const response = await axios
      .delete(
        `${this.SKU_INTERNAL_SERVICE_URL}/api/relationProducts/deletebySKU/${SKU_Relation}`
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });

    return response;
  }
}
