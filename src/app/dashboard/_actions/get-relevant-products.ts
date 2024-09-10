"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { ProductType } from "@/domain/product/entities/Product";
import { defaultUnicomAPIRelevantCategories as categories } from "@/Resources/API/Unicom/UnicomAPIRequets";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";

export const getRelevantProducts = async ({
  page,
}: {
  page: number;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  const date = new Date("2024-01-01T00:00:00Z");
  const isoDate = date.toISOString();

  const requests = categories.map((category) =>
    unicomAPIAdapter.getAll({
      request: {
        solo_articulos_destacados: false,
        tipo_informe: "completo",
        solo_favoritos: false,
        rango_articulos_informe: {
          desde_articulo_nro: 0,
          hasta_articulo_nro: 200,
        },
        solo_modificados_desde: isoDate,
      },
    })
  );

  // await for all requests to finish in parallel
  const productLists = await Promise.all(requests);
  const flattenedProductList = productLists.flat();

  const productList = flattenedProductList.map((product) =>
    ProductClassToObj(product)
  );

  return productList;
};
