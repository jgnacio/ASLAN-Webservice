"use server";

import axios from "axios";

const SKU_INTERNAL_SERVICE_URL = process.env.SKU_INTERNAL_SERVICE_URL;

export const getProductsAdministrated = async () => {
  const response = await axios
    .get(`${SKU_INTERNAL_SERVICE_URL}/api/products`)
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
