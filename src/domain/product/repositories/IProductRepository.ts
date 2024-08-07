import { Product } from "../Product";
import { UnicomAPIProductRequest } from "@/Resources/API/Unicom/UnicomAPIRequets";

export interface IProductRepository {
  getById(id: number): Promise<Product | null>;
  getAll(request?: UnicomAPIProductRequest): Promise<Product[]>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: number): Promise<void>;
}
