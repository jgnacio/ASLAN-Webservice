import { PCServiceImages } from "../Product/PCServiceAPIProduct";

export enum PCServiceCategoryType {
  Rfgcontent = "rfgcontent",
}
export interface PCServiceCategories {
  id: number;
  title: string;
  description: string;
  type: PCServiceCategoryType;
  childs?: PCServiceCategories[];
}
export interface PCServiceSubcategories {
  id: number;
  title: string;
  description: string;
  type: string;
  images: PCServiceImages[];
  childs?: PCServiceSubcategories[];
}
