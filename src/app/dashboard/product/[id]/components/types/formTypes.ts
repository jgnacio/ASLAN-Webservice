import { ProductType } from "@/domain/product/entities/Product";

export interface FormPublishProduct extends ProductType {
  publishState: string;
  stock_status: string;
}
