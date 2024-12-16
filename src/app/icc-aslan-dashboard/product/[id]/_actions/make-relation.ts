"use server";

import { ProductType } from "@/domain/product/entities/Product";
import axios from "axios";

const SKU_INTERNAL_SERVICE_URL = process.env.SKU_INTERNAL_SERVICE_URL;

export const makeProductRelation = async ({
  productToPublish,
  productList,
}: {
  productToPublish: ProductType;
  productList: ProductType[];
}) => {
  const providersOnSkuInternalService = await axios
    .get(`${SKU_INTERNAL_SERVICE_URL}/api/providers`)
    .then((response) => response.data.data)
    .catch((error) => {
      console.log("Error:", error);
    });

  // Make all products if not exist
  const body = {
    title: productToPublish.title,
    price: productToPublish.price,
    description: productToPublish.description || ".",
    stock: productToPublish.stock,
    category: productToPublish.category.name,
    brand: productToPublish.marca,
  };

  const headers = {
    "Content-Type": "application/json",
  };
  const product = await axios
    .post(`${SKU_INTERNAL_SERVICE_URL}/api/products`, body, { headers })
    .then((response) => response.data.data)
    .catch((error) => {
      console.log("Error:", error);
    });

  if (!product) {
    throw new Error("Product not found");
  }

  let bodyRelations: any[] = [];

  for (const productOnList of productList) {
    if (!productOnList.partNumber) {
      continue;
    }
    // si es objeto
    let partNumber = "";
    if (typeof productOnList.partNumber === "object") {
      partNumber = productOnList.partNumber[0].partNumber;
    } else {
      partNumber = productOnList.partNumber;
    }

    if (!partNumber) {
      throw new Error("Part number is required");
    }

    // si contiene una palabra del proveedore

    const providerName = productOnList.provider
      ? productOnList.provider.name
      : "";

    const provider = providersOnSkuInternalService.find((provider: any) =>
      providerName.includes(provider.name)
    );

    if (!provider) {
      // Eliminar producto creado
      await axios
        .delete(`${SKU_INTERNAL_SERVICE_URL}/api/products/${product.SKU}`, {
          headers,
        })
        .then((response) => response.data)
        .catch((error) => {
          console.log("Error:", error);
        });
      throw new Error("Provider not found");
    }

    const toSend = {
      PartNumber: partNumber,
      sku_provider: productOnList.sku,
      price: productOnList.price,
      stock: productOnList.stock,
      products: {
        connect: {
          SKU: product.SKU,
        },
      },
      providers: {
        connect: {
          ID_Provider: provider.ID_Provider,
        },
      },
    };
    bodyRelations.push(toSend);
  }

  for (const relation of bodyRelations) {
    console.log(
      await axios
        .post(`${SKU_INTERNAL_SERVICE_URL}/api/relationProducts`, relation, {
          headers,
        })
        .then((response) => response.data)
        .catch((error) => {
          console.log("Error:", error);
        })
    );
  }
  return product;
};
