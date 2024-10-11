"use server";

import axios from "axios";

export const getProductsAdministrated = async () => {
  const response = await axios
    .get(
      `https://product-sku-internal-service-test-207026078475.us-west1.run.app/api/products`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error);
    });

  const product = response.data.map((product: any) => {
    return {
      id: product.ID,
      skuInterno: product.SKU,
      title: product.title,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      relations: product.relations,
    };
  });

  return product;
};
