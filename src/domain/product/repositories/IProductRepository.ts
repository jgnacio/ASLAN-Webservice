import { Product, ProductType } from "../entities/Product";
import { UnicomAPIProductRequest } from "@/Resources/API/Unicom/UnicomAPIRequets";

export interface IProductRepository {
  getBySKU(sku: string): Promise<Product | null>;
  getAll({
    request,
    page,
    category,
    provider,
  }: {
    request?: UnicomAPIProductRequest;
    page?: number;
    category?: string;
    provider?: string;
  }): Promise<Product[]>;
  getByCategory(category: string): Promise<Product[]>;
  getFeatured(request?: UnicomAPIProductRequest): Promise<Product[]>;
  getOffers(request?: UnicomAPIProductRequest): Promise<Product[]>;
}
