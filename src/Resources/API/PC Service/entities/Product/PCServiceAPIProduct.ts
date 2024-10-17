import { PCServiceCategories } from "../Category/PCServiceAPICategory";

export enum PCServiceProductType {
  Product = "product",
}

export interface PCServiceRootObject {
  id: number;
  title: string;
  description: string;
  type: "rfgcontent";
  images: PCServiceImages[];
  childs: PCServiceChild[];
}

export interface PCServiceChild {
  id: number;
  title: string;
  description: string;
  type: "rfgcontent";
  images: PCServiceImages[];
  products: PCServiceProduct[];
}

export interface PCServiceProductWithoutPriceAndStock {
  id: number;
  title: string;
  description: string;
  type: PCServiceProductType;
  images: PCServiceImages[];
  sku: string;
}

export interface PCServiceProduct {
  id: number;
  title: string;
  description: string;
  type: PCServiceProductType;
  images: PCServiceImages[];
  sku: string;
}

export interface PCServicePriceAndStock {
  id: number;
  title: string;
  type: string;
  sku: string;
  price: Price;
  availability: PCServiceAvailability;
}

export interface PCServiceImages {
  variations: PCServiceImageVariations[];
}

export interface PCServiceImageVariations {
  url: string;
  mime: null;
  size: PCServiceSizeImage;
}

export enum PCServiceSizeImage {
  Large = "LARGE",
  Medium = "MEDIUM",
  Small = "SMALL",
}

export interface PCServiceProductDetails {
  id: number;
  title: string;
  description: string;
  type: string;
  images: PCServiceImages[];
  extraData: ExtraData;
  sku: string;
  extra: string;
  body: string;
  price: Price;
  availability: PCServiceAvailability;
}

export interface PCServiceAvailability {
  id: number;
  availability: boolean;
  stock: number;
  sku: string;
}

export interface PCServiceProductByDate {
  id: number;
  title: string;
  description: string;
  type: PCServiceProductType;
  images: PCServiceImages[];
  extraData: ExtraData;
  sku: string;
  extra: string;
  body: string;
  price: Price;
  availability: PCServiceAvailability;
  categories: PCServiceCategories[];
}

export interface ExtraData {
  changes: Change[];
  currency: Currency;
  brand: string;
  barcode: string;
}

export enum Change {
  Price = "price",
  Stock = "stock",
}

export enum Currency {
  US = "U$S",
}

export interface Price {
  id: number;
  price: number;
  currency: Currency;
  currencyCode: string;
  sku: string;
}
