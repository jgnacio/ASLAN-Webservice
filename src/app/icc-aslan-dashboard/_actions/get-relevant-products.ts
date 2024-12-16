"use server";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";
import { PCServiceAPIProductAdapter } from "@/Resources/API/PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "@/Resources/API/Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { UnicomAPICategory } from "@/Resources/API/Unicom/entities/Category/UnicomAPICategory";

export const getRelevantProducts = async ({
  page,
  category,
}: {
  page: number;
  category: UnicomAPICategory;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();
  const pcServiceAPIAdapter = new PCServiceAPIProductAdapter();
  const solutionboxAPIAdapter = new SolutionboxAPIProductAdapter();

  let productsUnicom: Product[] = [];
  let productsPCService: Product[] = [];
  let productsSolutionbox: Product[] = [];

  try {
    productsPCService = await pcServiceAPIAdapter.getByCategory(
      category.nameES
    );
  } catch (error) {
    console.error("Error getting featured products from PC Service API", error);
  }

  try {
    productsSolutionbox = await solutionboxAPIAdapter.getByCategory(
      category.nameES
    );
  } catch (error) {
    console.error(
      "Error getting featured products from Solutionbox API",
      error
    );
  }

  try {
    productsUnicom = await unicomAPIAdapter.getAll({
      request: {
        solo_articulos_destacados: false,
        codigo_grupo: category.code,
        tipo_informe: "completo",
        solo_favoritos: false,
        rango_articulos_informe: {
          desde_articulo_nro: 0,
          hasta_articulo_nro: 200,
        },
      },
    });
  } catch (error) {
    console.error("Error getting featured products from Unicom API", error);
  }

  const productUnicomObj = productsUnicom.map((product) =>
    ProductClassToObj(product)
  );
  const productSolutionboxObj = productsSolutionbox.map((product) =>
    ProductClassToObj(product)
  );
  const productPcServiceObj = productsPCService.map((product) =>
    ProductClassToObj(product)
  );

  const productList = [
    ...productUnicomObj,
    ...productPcServiceObj,
    ...productSolutionboxObj,
  ];

  return productList;
};
