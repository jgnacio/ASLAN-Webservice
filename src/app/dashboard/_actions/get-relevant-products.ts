"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";
import { UnicomAPIProductCategoryAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductCategoryAdsapter";
import { UnicomAPICategory } from "@/Resources/API/Unicom/entities/Category/UnicomAPICategory";
import { PCServiceAPIProductAdapter } from "@/Resources/API/PC Service/adapters/PCServiceAPIProductAdapter";

export const getRelevantProducts = async ({
  page,
  category,
}: {
  page: number;
  category: UnicomAPICategory;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();
  const pcServiceAPIAdapter = new PCServiceAPIProductAdapter();

  const productsPcService = await pcServiceAPIAdapter.getByCategory(
    category.nameES
  );

  const productsUnicom = await unicomAPIAdapter.getAll({
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

  const productConcat = productsPcService.concat(productsUnicom);

  const flat = productConcat.flat();

  const productList = flat.map((product) => ProductClassToObj(product));

  // const flat = productLists.flat();

  // const productList = flat.map((product) => ProductClassToObj(product));

  return productList;
};
