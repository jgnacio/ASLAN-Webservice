import { ICartRepository } from "@/domain/product/repositories/ICartRepository";
import { Cart } from "@/domain/product/entities/Cart";
const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export class UnicomAPICartAdapter implements ICartRepository {
  private readonly baseUrl = API_UNICOM_URL;
  private readonly token = API_UNICOM_TOKEN;

  constructor() {}

  async getById(id: string): Promise<Cart> {
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
