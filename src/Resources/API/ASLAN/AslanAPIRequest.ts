export interface AslanWooAPIProductRequest {
  name: string;
  type: string;
  regular_price: string;
  description: string;
  short_description: string;
  status: "draft" | "publish";
  categories: {
    id: number;
  }[];
  images:
    | (
        | {
            id: number;
          }
        | { src?: string }
      )[]
    | (
        | {
            id?: number;
          }
        | { src: string }
      )[];
}
