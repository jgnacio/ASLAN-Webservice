"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "@/domain/product/entities/Product";

export const getFeaturedProductsByPage = async ({
  page,
}: {
  page?: number;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = unicomAPIAdapter.getFeatured();
  const productList: ProductType[] = (await products).map((product) =>
    product.toPlainObject()
  );
  return productList;
};
