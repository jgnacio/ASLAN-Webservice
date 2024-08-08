"use server";
import { UnicomAPIProductAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { defaultUnicomAPIRelevantCategories as categories } from "@/Resources/API/Unicom/UnicomAPIRequets";
import { ProductClassToObj } from "@/lib/Utils/Functions/ClassToObject";

export const getRelevantProducts = async ({
  page,
}: {
  page: number;
}): Promise<ProductType[]> => {
  const unicomAPIAdapter = new UnicomAPIProductAdapter();

  let productList = [];
  const date = new Date("2024-01-01T00:00:00Z");
  const isoDate = date.toISOString();

  for (const category of categories) {
    const products = await unicomAPIAdapter.getAll({
      request: {
        solo_articulos_destacados: false,
        tipo_informe: "completo",
        solo_favoritos: false,
        rango_articulos_informe: {
          desde_articulo_nro: 0,
          hasta_articulo_nro: 100,
        },
        solo_modificados_desde: isoDate,
      },
    });

    productList.push(...products);
  }
  productList = productList.map((product) => ProductClassToObj(product));

  return productList;
};
