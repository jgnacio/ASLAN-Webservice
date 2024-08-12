import { ICartRepository } from "@/domain/product/repositories/ICartRepository";
import { Cart } from "@/domain/product/entities/Cart";
import { UnicomAPICartRequest } from "../UnicomAPIRequets";
const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export class UnicomAPICartAdapter implements ICartRepository {
  private readonly baseUrl = API_UNICOM_URL;
  private readonly token = API_UNICOM_TOKEN;

  constructor() {}

  private async fetchCart({
    body,
    route,
    method = "GET",
  }: {
    route: string;
    body?: UnicomAPICartRequest;
    method?: string;
  }) {
    if (!this.token) {
      throw new Error("Token not found");
    }

    if (!this.baseUrl) {
      throw new Error("URL not found");
    }

    if (!route) {
      throw new Error("Route not found");
    }

    if (method === "GET" && body) {
      throw new Error("GET method does not support body");
    }

    const response = await fetch(`${this.baseUrl}/${route}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
    });

    console.log(response);

    // throw new Error("Method not implemented.");
    // return response;
  }

  async get(): Promise<Cart> {
    throw new Error("Method not implemented.");
  }
  async save(cart: Cart): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async update(cart: Cart): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addProduct(cart: Cart, product: Cart): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async clear(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
