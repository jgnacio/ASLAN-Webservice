"use server";

import axios from "axios";

export const getRelations = async () => {
  const response = await axios
    .get(
      "https://product-sku-internal-service-test-207026078475.us-west1.run.app/api/relationProducts"
    )
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error);
    });

  const relations = response.data.map((relation: any) => {
    return {
      id: relation.ID,
      SKU_Relation: relation.SKU_Relation,
      ID_Provider: relation.ID_Provider,
      partNumber: relation.PartNumber,
      price: relation.price,
      stock: relation.stock,
      providers: relation.providers,
      products: relation.products,
    };
  });

  return relations;
};
