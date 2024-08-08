import { Cart } from "../entities/Cart";

export interface ICartRepository {
  getById(id: string): Promise<Cart>;
  save(cart: Cart): Promise<void>;
  update(cart: Cart): Promise<void>;
  addProduct(cart: Cart, product: Cart): Promise<void>;
  delete(id: string): Promise<void>;
  clear(id: string): Promise<void>;
}
