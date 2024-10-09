import { ProductType } from "@/domain/product/entities/Product";

export interface ProductTypeWithProvider extends ProductType {
  provider: string;
}
