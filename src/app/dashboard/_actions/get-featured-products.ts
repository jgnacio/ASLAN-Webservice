"use server";
import { PCServiceAPIProductAdapter } from "@/Resources/API/PC Service/adapters/PCServiceAPIProductAdapter";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";

export const getFeaturedProductsByPage = async ({
  page,
}: {
  page?: number;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();
  const pcServiceAPIAdapter = new PCServiceAPIProductAdapter();

  const productsUnicom = await unicomAPIAdapter.getFeatured();

  const productsPCService = await pcServiceAPIAdapter.getFeatured();

  const productUnicomObj = productsUnicom.map((product) =>
    ProductClassToObj(product)
  );

  const productPCServiceObj = productsPCService.map((product) =>
    ProductClassToObj(product)
  );

  const productList = [...productUnicomObj, ...productPCServiceObj];
  console.log("productList", productList);

  return productList;
};
