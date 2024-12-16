"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "@/domain/product/entities/Product";

export const getProductsByPage = async ({
  page,
  category,
}: {
  page: number;
  category?: string;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const products = unicomAPIAdapter.getAll({ page, categoryCode: category });
  const productList: ProductType[] = (await products).map((product) =>
    product.toPlainObject()
  );
  return productList;
};
