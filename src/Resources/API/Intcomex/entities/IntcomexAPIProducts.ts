import { IntcomextAPICategoryType } from "./IntcomextAPICategory";
import { IntcomexAPIBrandType } from "./IntcomexAPIBrand";
import { ProductAvailability } from "@/domain/product/entities/Product";

export interface IntcomexAPIProductType {
  Sku: string;
  Mpn: string;
  Description: string;
  Type: string;
  Manufacturer: any;
  Brand: IntcomexAPIBrandType;
  Category: IntcomextAPICategoryType;
  Components: any;
  CompilationDate: string;
  PrePurchaseStartDate: string;
  PrePurchaseEndDate: any;
  PrePurchaseActive: boolean;
}

export interface IntcomexAPIProductsTypeExtended
  extends IntcomexAPIProductType {
  price: number;
  stock: number;
  availability: boolean;
}
