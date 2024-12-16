"use server";
import { PCServiceAPIProductAdapter } from "@/Resources/API/PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "@/Resources/API/Solutionbox/adapters/SolutionboxAPIProductAdapter";
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
  const solutionboxAPIAdapter = new SolutionboxAPIProductAdapter();

  let productsUnicom: Product[] = [];
  let productsPCService: Product[] = [];
  let productsSolutionbox: Product[] = [];

  try {
    productsUnicom = await unicomAPIAdapter.getFeatured();
  } catch (error) {
    console.error("Error getting featured products from Unicom API", error);
  }

  try {
    productsPCService = await pcServiceAPIAdapter.getFeatured();
  } catch (error) {
    console.error("Error getting featured products from PC Service API", error);
  }

  try {
    productsSolutionbox = await solutionboxAPIAdapter.getFeatured();
  } catch (error) {
    console.error(
      "Error getting featured products from Solutionbox API",
      error
    );
  }

  const productUnicomObj = productsUnicom.map((product) =>
    ProductClassToObj(product)
  );

  const productPCServiceObj = productsPCService.map((product) =>
    ProductClassToObj(product)
  );

  const productSolutionboxObj = productsSolutionbox.map((product) =>
    ProductClassToObj(product)
  );

  const productList = [
    ...productUnicomObj,
    ...productPCServiceObj,
    ...productSolutionboxObj,
  ];

  return productList;
};
