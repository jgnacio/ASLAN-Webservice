"use server";

import { SKUInternalServiceAPIAdapter } from "@/Resources/API/SKUInternalService/adapters/SKUInternalServiceAPIAdapter";
import { getProviderByID } from "../../_actions/get-provider-by-id";

export const getProductsAdministrated = async (): Promise<any> => {
  const skuInternalServiceAPIAdapter = new SKUInternalServiceAPIAdapter();
  const productsAdministrated =
    await skuInternalServiceAPIAdapter.getProductsAdministrated();
  const updatedProducts = await Promise.all(
    productsAdministrated.map(async (product: any) => {
      const relations = await Promise.all(
        product.relations.map(async (relation: any) => {
          const provider = await getProviderByID(relation.ID_Provider);

          return {
            ...relation,
            provider: provider.data || {},
          };
        })
      );
      return {
        ...product,
        relations,
      };
    })
  );
  if (!updatedProducts) {
    return [];
  }
  return updatedProducts;
};
